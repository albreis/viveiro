import { runAdvance } from "../modules/time/run-advance.ts";
import type {
  AdvanceRequest,
  AdvanceResponse,
} from "../modules/time/advance-types.ts";
const post = (message: AdvanceResponse) => self.postMessage(message);
self.onmessage = async ({ data }: MessageEvent<AdvanceRequest>) => {
  self.onmessage = null;
  try {
    const outcome = await runAdvance(data.session, data.options, {
      cancelled: () => false,
      progress: (progress) => post({ id: data.id, type: "progress", progress }),
    });
    post({ id: data.id, type: "result", outcome });
  } catch (error) {
    post({
      id: data.id,
      type: "error",
      error: error instanceof Error ? error.message : "Avanço indisponível.",
    });
  }
};
