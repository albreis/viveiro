import type { Checkpoint } from "../../modules/persistence/types.ts";
import type { SaveOutcome } from "./results.ts";
interface Pending {
  record: Checkpoint;
  resolve: (result: SaveOutcome) => void;
}
export class SerialCheckpointQueue {
  private writer: (record: Checkpoint) => Promise<SaveOutcome>;
  private pending: Pending[] = [];
  private draining = false;
  private listeners: (() => void)[] = [];
  constructor(writer: (record: Checkpoint) => Promise<SaveOutcome>) {
    this.writer = writer;
  }
  enqueue(record: Checkpoint): Promise<SaveOutcome> {
    return new Promise((resolve) => {
      const tail = this.pending.at(-1);
      if (record.kind === "auto" && tail?.record.kind === "auto") {
        this.pending.pop();
        tail.resolve({ ok: false, superseded: true });
      }
      this.pending.push({ record, resolve });
      void this.drain();
    });
  }
  private async drain() {
    if (this.draining) return;
    this.draining = true;
    while (this.pending.length) {
      const job = this.pending.shift()!;
      try {
        job.resolve(await this.writer(job.record));
      } catch {
        job.resolve({ ok: false, message: "A gravação não pôde terminar." });
      }
    }
    this.draining = false;
    for (const resolve of this.listeners.splice(0)) resolve();
  }
  async flush() {
    if (!this.draining && !this.pending.length) return;
    await new Promise<void>((resolve) => this.listeners.push(resolve));
  }
}
