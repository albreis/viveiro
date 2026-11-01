import { ForecastRunner } from "../services/forecast-runner.ts";
import type { ForecastRequest } from "../modules/forecast/types.ts";
const runner = new ForecastRunner((message) => self.postMessage(message));
self.onmessage = ({ data }: MessageEvent<ForecastRequest>) =>
  runner.receive(data);
