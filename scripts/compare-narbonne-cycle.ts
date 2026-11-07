import { mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { Worker } from "node:worker_threads";
import { normalizeExperiment } from "../src/modules/experiments/plan.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";
import { modelPool } from "./lib/model-pool.ts";
import { readSweepJson, immutableSweepFile } from "./lib/sweep-files.ts";
import { plainParents } from "./lib/release-files.ts";

const { values } = parseArgs({
  options: {
    out: { type: "string" },
    plan: { type: "string" },
    resume: { type: "boolean" },
  },
});
if (!values.out || !values.plan)
  throw Error(
    "Uso: node scripts/compare-narbonne-cycle.ts --plan PLANO.json --out PASTA [--resume]",
  );
const folder = resolve(values.out);
plainParents(folder);
if (existsSync(folder) !== !!values.resume)
  throw Error("Use uma pasta nova ou --resume na mesma configuração.");
if (!values.resume) mkdirSync(folder);
const plan = readSweepJson(values.plan) as {
  seeds: string[];
  versions: number[];
  days: number;
  parameters: object;
};
const jobs = plan.seeds.flatMap((seed) =>
  plan.versions.map((version) =>
    normalizeExperiment({
      schema: "viveiro-experiment-v1",
      seed,
      days: plan.days,
      startMode: "founding",
      biologicalProfile: { schema: 1, id: "messor-narbonne", version },
      parameters: plan.parameters,
    }),
  ),
);
const fingerprint = modelSourceFingerprint(process.cwd());
const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
immutableSweepFile(
  join(folder, "plano.json"),
  json({ plan, fingerprint, runtime: process.version }),
);
const controller = new AbortController();
const stop = () => controller.abort();
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
try {
  const results = await modelPool(
    jobs,
    3,
    async (job, signal) => {
      const index = jobs.indexOf(job);
      const file = join(
        folder,
        "rodada-" + String(index + 1).padStart(2, "0") + ".json",
      );
      if (existsSync(file)) return readSweepJson(file);
      const result = await new Promise<Record<string, unknown>>(
        (done, fail) => {
          const worker = new Worker(
            new URL("./lib/narbonne-cycle-worker.ts", import.meta.url),
            { workerData: job },
          );
          const abort = () => {
            void worker.terminate();
            fail(new Error("Comparação interrompida."));
          };
          signal.addEventListener("abort", abort, { once: true });
          worker.once("message", done);
          worker.once("error", fail);
          worker.once("exit", () => {
            signal.removeEventListener("abort", abort);
            fail(Error("Worker encerrou sem resultado."));
          });
        },
      );
      const record = { plan: job, ...result };
      immutableSweepFile(file, json(record));
      process.stdout.write(
        json({
          completed: index + 1,
          seed: job.seed,
          version: job.biologicalProfile.version,
        }),
      );
      return record;
    },
    controller.signal,
  );
  if (modelSourceFingerprint(process.cwd()) !== fingerprint)
    throw Error("A fonte mudou durante o lote.");
  immutableSweepFile(
    join(folder, "series.json"),
    json({ fingerprint, results }),
  );
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
}
