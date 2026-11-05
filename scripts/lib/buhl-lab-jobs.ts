import { createHash } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { Worker } from "node:worker_threads";
import type { BuhlLabRun } from "../../src/modules/benchmarks/buhl-arena/run.ts";
import type { BuhlLabPlan } from "../../src/modules/benchmarks/buhl-arena/settings.ts";
import { modelPool } from "./model-pool.ts";
import { plainParents } from "./release-files.ts";
import { modelSourceFingerprint } from "./source-fingerprint.ts";
import {
  immutableSweepFile,
  readSweepJson,
  sweepLease,
} from "./sweep-files.ts";

export interface BuhlLabJobOptions {
  out: string;
  resume: boolean;
  concurrency: number;
  limit?: number;
}

const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
export const buhlLabJson = (value: unknown) =>
  JSON.stringify(value, null, 2) + "\n";

function launch(
  plan: BuhlLabPlan,
  signal: AbortSignal,
  progress: (tick: number, total: number) => void,
) {
  return new Promise<BuhlLabRun>((done, fail) => {
    signal.throwIfAborted();
    const worker = new Worker(
      new URL("./buhl-lab-worker.ts", import.meta.url),
      { workerData: plan },
    );
    const abort = () => {
      void worker.terminate();
      fail(signal.reason);
    };
    signal.addEventListener("abort", abort, { once: true });
    worker.on("message", (message) => {
      if (message.run) done(message.run);
      else progress(message.tick, message.total);
    });
    worker.once("error", fail);
    worker.once("exit", (code) => {
      signal.removeEventListener("abort", abort);
      fail(Error("Worker da arena encerrou sem resultado. Código " + code));
    });
  });
}

function readRecord(file: string, plan: BuhlLabPlan): BuhlLabRun {
  const saved = readSweepJson(file, 8 * 1024 * 1024) as {
    sha256: string;
    run: BuhlLabRun;
  };
  if (
    saved?.run?.seed !== plan.seed ||
    saved.run.workers !== plan.workers ||
    !Array.isArray(saved.run.samples) ||
    saved.run.samples[0]?.timeSeconds !== 0 ||
    saved.run.samples.at(-1)?.timeSeconds !== plan.durationSeconds ||
    saved.sha256 !== hash([plan, saved.run])
  )
    throw Error("Registro da arena inválido: " + file);
  return saved.run;
}

export async function runBuhlLabJobs(
  plans: BuhlLabPlan[],
  options: BuhlLabJobOptions,
  signal: AbortSignal,
  summarize: (
    folder: string,
    fingerprint: string,
    results: BuhlLabRun[],
  ) => void,
) {
  const folder = resolve(options.out);
  plainParents(folder);
  if (existsSync(folder) !== options.resume)
    throw Error(
      "Pasta existente exige --resume. Para iniciar, use uma pasta nova.",
    );
  if (!existsSync(dirname(folder)))
    throw Error("A pasta pai da saída não existe.");
  if (!options.resume) mkdirSync(folder);
  const close = sweepLease(folder);
  try {
    const fingerprint = modelSourceFingerprint(process.cwd());
    const manifest = join(folder, "plano.json");
    if (options.resume && !existsSync(manifest))
      throw Error("Plano da arena ausente na retomada.");
    immutableSweepFile(
      manifest,
      buhlLabJson({
        schema: "viveiro-buhl-arena-lote-v1",
        sourceFingerprint: fingerprint,
        runtime: process.version,
        plans,
      }),
    );
    const jobs = plans.map((plan, index) => ({
      plan,
      index,
      file: join(
        folder,
        "rodada-" + String(index + 1).padStart(3, "0") + ".json",
      ),
    }));
    const saved = new Map<number, BuhlLabRun>();
    for (const job of jobs)
      if (existsSync(job.file))
        saved.set(job.index, readRecord(job.file, job.plan));
    const pending = jobs
      .filter((job) => !saved.has(job.index))
      .slice(0, options.limit);
    await modelPool(
      pending,
      options.concurrency,
      async (job, workerSignal) => {
        const { index, plan, file } = job;
        const run = await launch(plan, workerSignal, (tick, total) => {
          process.stderr.write(
            JSON.stringify({
              job: index + 1,
              workers: plan.workers,
              seed: plan.seed,
              tick,
              total,
            }) + "\n",
          );
        });
        immutableSweepFile(
          file,
          buhlLabJson({ run, sha256: hash([plan, run]) }),
        );
        saved.set(index, run);
      },
      signal,
    );
    if (modelSourceFingerprint(process.cwd()) !== fingerprint)
      throw Error(
        "A fonte mudou durante a rodada. Dados preservados sem finalizar o lote.",
      );
    if (saved.size === jobs.length)
      summarize(
        folder,
        fingerprint,
        jobs.map((job) => saved.get(job.index)!),
      );
    return { completed: saved.size, total: jobs.length };
  } finally {
    close();
  }
}
