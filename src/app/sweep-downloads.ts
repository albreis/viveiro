import {
  checkpointJson,
  type SweepCheckpoint,
} from "../modules/sweeps/checkpoint.ts";
import { sweepSummary } from "../modules/sweeps/summary.ts";
export class SweepDownloads {
  private urls: string[] = [];
  private revision = 0;
  clear() {
    this.revision++;
    this.urls.forEach((u) => URL.revokeObjectURL(u));
    this.urls = [];
    document.getElementById("sweep-downloads")!.hidden = true;
  }
  async update(c: SweepCheckpoint) {
    const revision = ++this.revision;
    const summary = await sweepSummary(c);
    if (revision !== this.revision) return;
    this.urls.forEach((u) => URL.revokeObjectURL(u));
    this.urls = [];
    for (const [id, text, type] of [
      ["sweep-checkpoint", checkpointJson(c), "application/json"],
      ["sweep-summary", summary, "text/csv;charset=utf-8"],
    ]) {
      const url = URL.createObjectURL(new Blob([text], { type }));
      this.urls.push(url);
      (document.getElementById(id) as HTMLAnchorElement).href = url;
    }
    document.getElementById("sweep-downloads")!.hidden = false;
  }
}
