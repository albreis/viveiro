import { defaultForecastOptions } from "../modules/forecast/types.ts";
import type {
  ForecastOptions,
  ForecastSnapshot,
  ForecastState,
  ForecastResponse,
} from "../modules/forecast/types.ts";
export interface ForecastPort {
  postMessage(message: unknown): void;
  terminate(): void;
  onmessage: ((event: MessageEvent<ForecastResponse>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
}
export class ForecastClient {
  state: ForecastState = { status: "idle" };
  options: ForecastOptions = { ...defaultForecastOptions };
  private id = 0;
  private port?: ForecastPort;
  private changed: () => void;
  private factory: () => ForecastPort;
  private finishedAt = 0;
  constructor(changed: () => void, factory: () => ForecastPort) {
    this.changed = changed;
    this.factory = factory;
  }
  consider(
    snapshot: () => ForecastSnapshot,
    scenario: string,
    tick: number,
  ): void {
    if (
      this.state.status === "idle" ||
      (this.state.status === "complete" &&
        tick - (this.state.tick ?? tick) > 100 &&
        performance.now() - this.finishedAt > 30000)
    )
      this.request(snapshot(), scenario);
  }
  request(snapshot: ForecastSnapshot, scenario: string): void {
    const id = ++this.id;
    this.state = { status: "running", scenario, tick: snapshot.tick };
    try {
      this.port ??= this.factory();
      this.port.onmessage = ({ data }) => this.receive(data);
      this.port.onerror = () => {
        this.port?.terminate();
        this.port = undefined;
        this.state = {
          ...this.state,
          status: "error",
          error: "Este navegador não disponibilizou a previsão.",
        };
        this.id++;
        this.changed();
      };
      this.port.postMessage({
        type: "start",
        id,
        snapshot,
        options: { ...this.options },
      });
    } catch (error) {
      this.state = {
        ...this.state,
        status: "error",
        error:
          error instanceof Error ? error.message : "Previsão indisponível.",
      };
    }
    this.changed();
  }
  cancel(): void {
    this.port?.postMessage({ type: "cancel", id: ++this.id });
    this.state = { ...this.state, status: "cancelled" };
    this.changed();
  }
  invalidate(): void {
    this.port?.postMessage({ type: "cancel", id: ++this.id });
    this.state = { status: "idle" };
    this.changed();
  }
  dispose(): void {
    this.id++;
    this.port?.terminate();
    this.port = undefined;
  }
  private receive(data: ForecastResponse): void {
    if (data.id !== this.id) return;
    if (data.type === "progress")
      this.state = { ...this.state, progress: data.progress };
    else if (data.type === "error")
      this.state = { ...this.state, status: "error", error: data.error };
    else {
      this.finishedAt = performance.now();
      this.state = {
        ...this.state,
        status: data.outcome.complete ? "complete" : "budget",
        result: data.outcome.result,
        progress: data.outcome.progress,
      };
    }
    this.changed();
  }
}
