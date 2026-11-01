import { runForecast, ForecastCancelled } from "../modules/forecast/run.ts";
import type {
  ForecastRequest,
  ForecastResponse,
} from "../modules/forecast/types.ts";
type Job = Extract<ForecastRequest, { type: "start" }>;
// Only one model runs; incoming requests replace the pending request until the old slice yields.
export class ForecastRunner {
  private generation = 0;
  private pending?: Job;
  private busy = false;
  private post: (message: ForecastResponse) => void;
  private execute: typeof runForecast;
  constructor(
    post: (message: ForecastResponse) => void,
    execute = runForecast,
  ) {
    this.post = post;
    this.execute = execute;
  }
  receive(message: ForecastRequest): void {
    this.generation++;
    this.pending = message.type === "start" ? message : undefined;
    void this.pump();
  }
  private async pump(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      while (this.pending) {
        const job = this.pending,
          generation = this.generation;
        this.pending = undefined;
        const current = () => generation === this.generation;
        try {
          const outcome = await this.execute(job.snapshot, job.options, {
            cancelled: () => !current(),
            progress: (progress) => {
              if (current())
                this.post({ id: job.id, type: "progress", progress });
            },
          });
          if (current()) this.post({ id: job.id, type: "result", outcome });
        } catch (error) {
          if (current() && !(error instanceof ForecastCancelled))
            this.post({
              id: job.id,
              type: "error",
              error:
                error instanceof Error
                  ? error.message
                  : "Previsão indisponível.",
            });
        }
      }
    } finally {
      this.busy = false;
    }
  }
}
