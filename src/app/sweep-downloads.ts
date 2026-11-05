import {
  checkpointJson,
  type SweepCheckpoint,
} from "../modules/sweeps/checkpoint.ts";
import { bindSpreadsheetCsv } from "./spreadsheet-csv.ts";
import { sweepSummary } from "../modules/sweeps/summary.ts";
export class SweepDownloads {
  private checkpointUrl: string | undefined;
  private revision = 0;
  private readonly setSummary = bindSpreadsheetCsv(
    document.querySelector<HTMLAnchorElement>("#sweep-summary")!,
    "resumo",
  );
  clear() {
    this.revision++;
    if (this.checkpointUrl) URL.revokeObjectURL(this.checkpointUrl);
    this.checkpointUrl = undefined;
    this.setSummary(null);
    document.getElementById("sweep-downloads")!.hidden = true;
  }
  async update(c: SweepCheckpoint) {
    const revision = ++this.revision;
    const summary = await sweepSummary(c);
    if (revision !== this.revision) return;
    if (this.checkpointUrl) URL.revokeObjectURL(this.checkpointUrl);
    this.checkpointUrl = URL.createObjectURL(
      new Blob([checkpointJson(c)], { type: "application/json" }),
    );
    document.querySelector<HTMLAnchorElement>("#sweep-checkpoint")!.href =
      this.checkpointUrl;
    this.setSummary(summary);
    document.getElementById("sweep-downloads")!.hidden = false;
  }
}
