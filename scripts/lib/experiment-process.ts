import { Worker } from "node:worker_threads";
import { normalizeExperiment } from "../../src/modules/experiments/plan.ts";
import type { ExperimentResult } from "../../src/modules/experiments/result.ts";
import type { ExperimentResponse } from "../../src/modules/experiments/messages.ts";
/** Isolate the numeric backend and module caches, just as the browser worker does. */
export function runExperimentProcess(
  value: unknown,
  options: { signal?: AbortSignal } = {},
): Promise<ExperimentResult> {
  const plan = normalizeExperiment(value);
  if (options.signal?.aborted)
    return Promise.reject(
      new DOMException("Experimento cancelado.", "AbortError"),
    );
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../workers/experiment-thread.ts", import.meta.url),
      { workerData: plan, execArgv: [] },
    );
    let completed = false;
    const cleanup = () => options.signal?.removeEventListener("abort", abort);
    const abort = () => {
      if (completed) return;
      completed = true;
      cleanup();
      void worker.terminate();
      reject(new DOMException("Experimento cancelado.", "AbortError"));
    };
    options.signal?.addEventListener("abort", abort, { once: true });
    worker.once("message", (message: ExperimentResponse) => {
      if (completed) return;
      completed = true;
      cleanup();
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
    worker.once("error", (error) => {
      completed = true;
      cleanup();
      reject(error);
    });
    worker.once("exit", (code) => {
      cleanup();
      if (!completed)
        reject(Error("Worker encerrou sem resultado (" + code + ")."));
    });
  });
}
