import { parentPort, workerData } from "node:worker_threads";
import { runDigging } from "../../src/modules/benchmarks/digging-run.ts";

/** Runs one Buhl group in its own thread; same code path as the serial run. */
const job = workerData as Parameters<typeof runDigging>[0];
const run = runDigging({
  ...job,
  onProgress: (tick, total) =>
    parentPort!.postMessage({ type: "progress", tick, total }),
  progressEvery: Math.max(1000, Math.round((job.ticks ?? 0) / 20)),
});
parentPort!.postMessage({ type: "done", run });
