import { csvCell } from "../observations/csv.ts";
import { sweepJobs } from "./jobs.ts";
import type { SweepCheckpoint } from "./checkpoint.ts";
export async function sweepSummary(c: SweepCheckpoint): Promise<string> {
  const jobs = await sweepJobs(c.plan),
    records = new Map(c.results.map((r) => [r.id, r]));
  const rows: (string | number)[][] = [
    ["execucao", "parametro", "valor", "replica", "semente", "csv_sha256"],
  ];
  for (const job of jobs) {
    const r = records.get(job.id);
    if (!r) continue;
    rows.push([
      job.id,
      c.plan.parameter,
      job.value,
      job.replicate,
      job.plan.seed,
      JSON.parse(r.result.manifest).csv.sha256,
    ]);
  }
  return (
    "\ufeff" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n"
  );
}
