import { parentPort, workerData } from "node:worker_threads";
import { runBuhlLab } from "../../src/modules/benchmarks/buhl-arena/run.ts";

const run = runBuhlLab(workerData, (tick, total) =>
  parentPort!.postMessage({ tick, total }),
);
parentPort!.postMessage({ run });
