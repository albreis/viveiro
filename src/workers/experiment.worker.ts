/// <reference lib="webworker" />
import { runPortableExperiment } from "../modules/experiments/portable-run.ts";
self.onmessage = async (event: MessageEvent<unknown>) => {
  try {
    const result = await runPortableExperiment(event.data, {
      progress(tick, total) {
        self.postMessage({ type: "progress", tick, total });
      },
    });
    self.postMessage({ type: "result", result });
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
