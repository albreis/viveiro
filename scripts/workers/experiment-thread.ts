import { installPortableMath } from "../../src/libs/portable-math.ts";
import { prepareExtensionPlan } from "../lib/extension-module.ts";
import { parentPort, workerData } from "node:worker_threads";
import { runPortableExperiment } from "../../src/modules/experiments/portable-run.ts";
try {
  installPortableMath();
  const plan = await prepareExtensionPlan(
    workerData.plan,
    workerData.extensionModule,
  );
  const result = await runPortableExperiment(plan);
  parentPort?.postMessage({ type: "result", result });
} catch (error) {
  parentPort?.postMessage({
    type: "error",
    message: error instanceof Error ? error.message : String(error),
  });
} finally {
  parentPort?.close();
}
