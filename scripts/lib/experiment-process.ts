import { Worker } from "node:worker_threads";
import { normalizeExperiment } from "../../src/modules/experiments/plan.ts";
import type { ExperimentResult } from "../../src/modules/experiments/result.ts";
import type { ExperimentResponse } from "../../src/modules/experiments/messages.ts";
/** Isolate the numeric backend and module caches, just as the browser worker does. */
export function runExperimentProcess(
  value: unknown,
): Promise<ExperimentResult> {
  const plan = normalizeExperiment(value);
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../workers/experiment-thread.ts", import.meta.url),
      { workerData: plan, execArgv: [] },
    );
    let completed = false;
    worker.once("message", (message: ExperimentResponse) => {
      completed = true;
      if (message.type === "result") resolve(message.result);
      else
        reject(
          Error(
            message.type === "error"
              ? message.message
              : "Resposta inesperada do experimento.",
          ),
        );
    });
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (!completed)
        reject(Error("Worker encerrou sem resultado (" + code + ")."));
    });
  });
}
