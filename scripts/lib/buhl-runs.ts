import { createHash } from "node:crypto";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { Worker } from "node:worker_threads";
import { TICKS_PER_DAY } from "../../src/modules/simulation/constants.js";
import type {
  DiggingRun,
  DiggingRunOptions,
} from "../../src/modules/benchmarks/digging-run.ts";
import type { BuhlOptions } from "./buhl-args.ts";
import { modelPool } from "./model-pool.ts";
import { plainParents } from "./release-files.ts";
import { modelSourceFingerprint } from "./source-fingerprint.ts";
import {
  immutableSweepFile,
  readSweepJson,
  sweepLease,
} from "./sweep-files.ts";

type Job = Omit<DiggingRunOptions, "onProgress" | "progressEvery">;
type Progress = (job: Job, tick: number, total: number) => void;
export interface BuhlResults {
  config: Omit<BuhlOptions, "out" | "resume" | "limit" | "jobs" | "parallel">;
  sourceFingerprint: string;
  folder: string;
  total: number;
  runs: DiggingRun[];
}
const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

function workerRun(
  job: Job,
  signal: AbortSignal,
  progress: Progress,
): Promise<DiggingRun> {
  return new Promise((done, fail) => {
    signal.throwIfAborted();
    const worker = new Worker(new URL("./buhl-worker.ts", import.meta.url), {
      workerData: job,
    });
    const abort = () => {
      fail(signal.reason);
      void worker.terminate();
    };
    signal.addEventListener("abort", abort, { once: true });
    worker.on("message", (message) => {
      if (message.type === "progress")
        progress(job, message.tick, message.total);
      else if (message.type === "done") done(message.run);
    });
    worker.once("error", fail);
    worker.once("exit", (code) => {
      signal.removeEventListener("abort", abort);
      fail(
        Error(
          "Worker de Buhl encerrou antes de entregar o resultado. Código " +
            code,
        ),
      );
    });
  });
}

function makeJobs(options: BuhlOptions): Job[] {
  const jobs: Job[] = [];
  for (
    let seed = options.firstSeed;
    seed < options.firstSeed + options.seeds;
    seed++
  )
    for (const workers of options.groups)
      jobs.push({
        seed: "BUHL-" + seed,
        workers,
        days: options.days,
        ticks: options.realTime?.ticks,
        sampleEvery: options.sampleEvery,
        setup: {
          mode: options.mode,
          workersOnly: options.protocol === "grupo-fixo",
          insideNest: options.protocol === "grupo-fixo",
          idleYield: options.idle === "cedem",
          freezeDaily: !!options.realTime,
          noPredators: !!options.realTime,
          stigmergy: options.brake,
        },
      });
  return jobs;
}

function validateRun(job: Job, run: DiggingRun, digest: string): DiggingRun {
  if (
    run?.seed !== job.seed ||
    run.workers !== job.workers ||
    !Array.isArray(run.samples) ||
    run.samples.at(-1)?.tick !== (job.ticks ?? job.days * TICKS_PER_DAY) ||
    digest !== hash(run)
  )
    throw Error("Resultado de Buhl inválido: " + job.seed + "/" + job.workers);
  return run;
}

export async function runBuhlJobs(
  options: BuhlOptions,
  signal: AbortSignal,
  progress: Progress,
  writeResults: (result: BuhlResults) => void,
): Promise<void> {
  const {
    out,
    resume,
    limit,
    jobs: concurrency,
    parallel: _parallel,
    ...config
  } = options;
  const folder = resolve(out);
  plainParents(folder);
  if (existsSync(folder) !== resume)
    throw Error(
      "Pasta existente exige --resume; pasta nova não pode ser retomada.",
    );
  if (!existsSync(dirname(folder)) || !statSync(dirname(folder)).isDirectory())
    throw Error("A pasta pai da saída deve existir.");
  if (!resume) mkdirSync(folder);
  const close = sweepLease(folder);
  try {
    const manifest = join(folder, "plano.json");
    if (resume && !existsSync(manifest))
      throw Error("Plano ausente na pasta de retomada.");
    const sourceFingerprint = modelSourceFingerprint(process.cwd());
    immutableSweepFile(
      manifest,
      json({ schema: "viveiro-buhl-plano-v1", sourceFingerprint, config }),
    );
    const planned = makeJobs(options);
    const file = (job: Job) =>
      join(folder, job.seed + "-" + job.workers + ".json");
    const saved = new Map<Job, DiggingRun>();
    for (const job of planned) {
      if (!existsSync(file(job))) continue;
      const record = readSweepJson(file(job), 512 * 1024 * 1024) as {
        run: DiggingRun;
        sha256: string;
      };
      saved.set(job, validateRun(job, record.run, record.sha256));
    }
    const pending = planned.filter((job) => !saved.has(job)).slice(0, limit);
    await modelPool(
      pending,
      concurrency,
      async (job, workerSignal) => {
        const run = await workerRun(job, workerSignal, progress);
        const sha256 = hash(run);
        validateRun(job, run, sha256);
        immutableSweepFile(file(job), json({ sha256, run }));
        saved.set(job, run);
      },
      signal,
    );
    writeResults({
      config,
      sourceFingerprint,
      folder,
      total: planned.length,
      runs: planned.flatMap((job) => {
        const run = saved.get(job);
        return run ? [run] : [];
      }),
    });
  } finally {
    close();
  }
}
