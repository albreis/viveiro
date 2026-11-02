import type { ExperimentPlan } from "../modules/experiments/plan.ts";
import type { ExperimentResult } from "../modules/experiments/result.ts";
import type { ExperimentResponse } from "../modules/experiments/messages.ts";
export function browserExperiment(
  plan: ExperimentPlan,
  signal: AbortSignal,
): Promise<ExperimentResult> {
  if (signal.aborted)
    return Promise.reject(
      new DOMException("Execução cancelada.", "AbortError"),
    );
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../workers/experiment.worker.ts", import.meta.url),
      { type: "module" },
    );
    const cleanup = () => {
      signal.removeEventListener("abort", abort);
      worker.terminate();
    };
    const abort = () => {
      cleanup();
      reject(new DOMException("Execução cancelada.", "AbortError"));
    };
    signal.addEventListener("abort", abort, { once: true });
    worker.onmessage = (e: MessageEvent<ExperimentResponse>) => {
      const m = e.data;
      if (m.type === "progress") return;
      cleanup();
      if (m.type === "result") resolve(m.result);
      else reject(Error(m.message));
    };
    worker.onerror = () => {
      cleanup();
      reject(
        Error("Worker de varredura falhou; resultados anteriores preservados."),
      );
    };
    worker.postMessage(plan);
  });
}
