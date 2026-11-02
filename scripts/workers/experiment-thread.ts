import { parentPort, workerData } from "node:worker_threads";
import { runPortableExperiment } from "../../src/modules/experiments/portable-run.ts";
try {
  const result = await runPortableExperiment(workerData);
  parentPort?.postMessage({ type: "result", result });
} catch (error) {
  parentPort?.postMessage({
    type: "error",
    message: error instanceof Error ? error.message : String(error),
  });
} finally {
  parentPort?.close();
}
