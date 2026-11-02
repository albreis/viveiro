/// <reference lib="webworker" />
import { runExperiment } from "../modules/experiments/run.ts";
import type { ExperimentResult } from "../modules/experiments/result.ts";
export type ExperimentResponse =
  | { type: "progress"; tick: number; total: number }
  | { type: "result"; result: ExperimentResult }
  | { type: "error"; message: string };
self.onmessage = async (event: MessageEvent<unknown>) => {
  try {
    const result = await runExperiment(event.data, {
      progress(tick, total) {
        self.postMessage({ type: "progress", tick, total });
      },
      pause: () => new Promise<void>((r) => setTimeout(r, 0)),
    });
    self.postMessage({ type: "result", result });
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
