import metadata from "../../../package.json" with { type: "json" };
import type { ExperimentPlan } from "../experiments/plan.ts";
import { normalizeSweep, type SweepPlan } from "./plan.ts";
export const sweepVersion = metadata.version;
export const sweepArithmetic = "stdlib-f64-v1";
export interface SweepJob {
  id: string;
  value: number;
  replicate: number;
  plan: ExperimentPlan;
}
export async function sha256(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return [...new Uint8Array(bytes)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}
export async function sweepId(plan: SweepPlan): Promise<string> {
  return sha256(
    JSON.stringify([
      "viveiro-sweep-v1",
      sweepVersion,
      sweepArithmetic,
      normalizeSweep(plan),
    ]),
  );
}
export async function sweepJobs(value: unknown): Promise<SweepJob[]> {
  const p = normalizeSweep(value),
    seeds = await Promise.all(
      Array.from({ length: p.replicates }, (_, i) =>
        sha256(JSON.stringify(["sweep-replica-v1", p.base.seed, i + 1])),
      ),
    );
  return p.values.flatMap((n, v) =>
    seeds.map((seed, r) => ({
      id: `v${String(v + 1).padStart(3, "0")}-r${String(r + 1).padStart(3, "0")}`,
      value: n,
      replicate: r + 1,
      plan: {
        ...p.base,
        seed: "SWEEP-" + seed,
        parameters: { ...p.base.parameters, [p.parameter]: n },
      },
    })),
  );
}
