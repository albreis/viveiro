import type { SessionState } from "../modules/persistence/types.ts";
import type {
  AdvanceOptions,
  AdvanceResponse,
  AdvanceOutcome,
  AdvanceProgress,
} from "../modules/time/advance-types.ts";
export interface AdvancePort {
  postMessage(value: unknown): void;
  terminate(): void;
  onmessage: ((e: MessageEvent<AdvanceResponse>) => void) | null;
  onerror: ((e: ErrorEvent) => void) | null;
}
export class AdvanceClient {
  private id = 0;
  private port?: AdvancePort;
  private factory: () => AdvancePort;
  private changed: (progress?: AdvanceProgress, error?: string) => void;
  private complete: (outcome: AdvanceOutcome) => void;
  constructor(
    factory: () => AdvancePort,
    changed: (p?: AdvanceProgress, error?: string) => void,
    complete: (o: AdvanceOutcome) => void,
  ) {
    this.factory = factory;
    this.changed = changed;
    this.complete = complete;
  }
  start(session: SessionState, options: AdvanceOptions) {
    this.cancel();
    const id = ++this.id;
    try {
      const port = (this.port = this.factory());
      port.onmessage = ({ data }) => {
        if (data.id !== this.id) return;
        if (data.type === "progress") {
          this.changed(data.progress);
          return;
        }
        this.cancel();
        if (data.type === "error") this.changed(undefined, data.error);
        else this.complete(data.outcome);
      };
      port.onerror = () => {
        if (id !== this.id) return;
        this.cancel();
        this.changed(
          undefined,
          "O navegador interrompeu o avanço; o estado anterior está preservado.",
        );
      };
      port.postMessage({ id, session, options });
    } catch (error) {
      this.cancel();
      this.changed(
        undefined,
        error instanceof Error ? error.message : "Avanço indisponível.",
      );
    }
  }
  cancel() {
    ++this.id;
    this.port?.terminate();
    this.port = undefined;
  }
}
