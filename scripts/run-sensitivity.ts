import { existsSync, mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import {
  morrisDesign,
  type MorrisOptions,
} from "../src/modules/sensitivity/design.ts";
import { analyzeMorris } from "../src/modules/sensitivity/analyze.ts";
import { validateRecord } from "../src/modules/sweeps/checkpoint.ts";
import { runExperimentProcess } from "./lib/experiment-process.ts";
import {
  readSweepJson,
  immutableSweepFile,
  sweepLease,
} from "./lib/sweep-files.ts";
import { plainParents } from "./lib/release-files.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";
import { modelPool } from "./lib/model-pool.ts";
import { writeMorrisOutput } from "./lib/morris-output.ts";
let close: (() => void) | undefined;
const controller = new AbortController(),
  stop = () => controller.abort();
try {
  const args = process.argv.slice(2),
    v: Record<string, string> = {},
    flags = new Set<string>();
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (flags.has(key) || Object.hasOwn(v, key))
      throw Error("Argumento repetido.");
    if (["--resume", "--help"].includes(key)) {
      flags.add(key);
      continue;
    }
    if (
      ![
        "--out",
        "--seed",
        "--levels",
        "--days",
        "--trajectories",
        "--replicates",
        "--jobs",
      ].includes(key) ||
      !args[i + 1] ||
      args[i + 1].startsWith("--")
    )
      throw Error("Argumento inválido: " + key);
    v[key] = args[++i];
  }
  if (flags.has("--help"))
    process.stdout.write(
      "npm run sensitivity -- --out nova-pasta [--jobs 4] [--trajectories 4 --replicates 2 --days 10 --levels 4 --seed MORRIS-42] [--resume]\n",
    );
  else {
    if (!v["--out"]) throw Error("Informe --out.");
    const options: Partial<MorrisOptions> = {};
    for (const key of ["levels", "days", "trajectories", "replicates"] as const)
      if (v["--" + key] !== undefined) options[key] = Number(v["--" + key]);
    if (v["--seed"] !== undefined) options.seed = v["--seed"];
    const jobs = Number(v["--jobs"] ?? 4);
    if (!Number.isInteger(jobs) || jobs < 1 || jobs > 8)
      throw Error("Use 1–8 Workers.");
    const design = await morrisDesign(options),
      root = process.cwd(),
      fingerprint = modelSourceFingerprint(root),
      folder = resolve(v["--out"]);
    plainParents(folder);
    const resume = flags.has("--resume");
    if (existsSync(folder) !== resume)
      throw Error(
        "Pasta existente exige --resume; uma pasta nova não pode ser retomada.",
      );
    if (!existsSync(dirname(folder))) throw Error("Pasta pai ausente.");
    if (!resume) mkdirSync(folder);
    close = sweepLease(folder);
    immutableSweepFile(
      join(folder, "desenho.json"),
      JSON.stringify({ ...design, sourceFingerprint: fingerprint }, null, 2) +
        "\n",
    );
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
    let completed = 0;
    const records = await modelPool(
      design.jobs,
      jobs,
      async (job, signal) => {
        const file = join(folder, job.id + ".json");
        const record = existsSync(file)
          ? await validateRecord(readSweepJson(file, 1024 * 1024), job)
          : await validateRecord(
              {
                id: job.id,
                result: await runExperimentProcess(job.plan, { signal }),
              },
              job,
            );
        immutableSweepFile(file, JSON.stringify(record, null, 2) + "\n");
        completed++;
        process.stdout.write(
          JSON.stringify({ completed, total: design.jobs.length }) + "\n",
        );
        return record;
      },
      controller.signal,
    );
    if (modelSourceFingerprint(root) !== fingerprint)
      throw Error(
        "Fonte mudou durante o ensaio; dados preservados sem finalizar a análise.",
      );
    const result = analyzeMorris(design, records);
    writeMorrisOutput(folder, design, result, fingerprint);
    process.stdout.write(
      JSON.stringify({
        status: "completed",
        runs: records.length,
        designId: design.id,
        top10: result.rankings.population.slice(0, 10).map((r) => r.parameter),
      }) + "\n",
    );
  }
} catch (e) {
  process.stderr.write((e instanceof Error ? e.message : String(e)) + "\n");
  process.exitCode = controller.signal.aborted ? 130 : 1;
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
  close?.();
}
