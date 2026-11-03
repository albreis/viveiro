import type { ExperimentResult } from "../experiments/result.ts";
import { normalizeSweep, type SweepPlan } from "./plan.ts";
import {
  sweepArithmetic,
  sweepVersion,
  sweepId,
  sha256,
  type SweepJob,
} from "./jobs.ts";
export interface SweepRecord {
  id: string;
  result: ExperimentResult;
}
export interface SweepCheckpoint {
  schema: "viveiro-sweep-checkpoint-v1";
  modelVersion: string;
  arithmetic: string;
  id: string;
  plan: SweepPlan;
  results: SweepRecord[];
}
export async function emptyCheckpoint(
  value: unknown,
): Promise<SweepCheckpoint> {
  const plan = normalizeSweep(value);
  return {
    schema: "viveiro-sweep-checkpoint-v1",
    modelVersion: sweepVersion,
    arithmetic: sweepArithmetic,
    id: await sweepId(plan),
    plan,
    results: [],
  };
}
export async function validateRecord(
  value: unknown,
  job: Pick<SweepJob, "id" | "plan">,
): Promise<SweepRecord> {
  const r = value as Partial<SweepRecord> | null;
  const csv = r?.result?.csv,
    manifest = r?.result?.manifest;
  if (
    r?.id !== job.id ||
    typeof csv !== "string" ||
    typeof manifest !== "string" ||
    csv.length > 512 * 1024 ||
    manifest.length > 32768
  )
    throw Error("Resultado inválido: " + job.id);
  const m = JSON.parse(manifest);
  if (
    m.schema !== "viveiro-run-v1" ||
    m.modelVersion !== sweepVersion ||
    m.arithmetic !== sweepArithmetic ||
    m.calibrated !== false ||
    JSON.stringify(m.plan) !== JSON.stringify(job.plan) ||
    m.clock?.startTick !== 0 ||
    m.clock?.endTick !== job.plan.days * 100 ||
    m.csv?.file !== "dados.csv" ||
    m.csv?.bytes !== new TextEncoder().encode(csv).length ||
    m.csv?.sha256 !== (await sha256(csv))
  )
    throw Error("Resultado incompatível ou hash inválido: " + job.id);
  return { id: job.id, result: { csv, manifest } };
}
export async function validateCheckpoint(
  value: unknown,
  plan: SweepPlan,
  jobs: SweepJob[],
): Promise<SweepCheckpoint> {
  const c = value as Partial<SweepCheckpoint> | null;
  if (
    c?.schema !== "viveiro-sweep-checkpoint-v1" ||
    c.modelVersion !== sweepVersion ||
    c.arithmetic !== sweepArithmetic ||
    c.id !== (await sweepId(plan)) ||
    JSON.stringify(normalizeSweep(c.plan)) !== JSON.stringify(plan) ||
    !Array.isArray(c.results) ||
    c.results.length > jobs.length
  )
    throw Error(
      "Retomada pertence a outro plano, versão ou contrato numérico.",
    );
  const byId = new Map(jobs.map((j) => [j.id, j])),
    seen = new Set<string>(),
    results: SweepRecord[] = [];
  for (const r of c.results) {
    if (!r || typeof r.id !== "string" || seen.has(r.id) || !byId.has(r.id))
      throw Error("Execução desconhecida ou duplicada na retomada.");
    seen.add(r.id);
    results.push(await validateRecord(r, byId.get(r.id)!));
  }
  const order = new Map(jobs.map((j, i) => [j.id, i]));
  results.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  return { ...(await emptyCheckpoint(plan)), results };
}
export const checkpointJson = (c: SweepCheckpoint) =>
  JSON.stringify(c, null, 2) + "\n";
