import type { SessionState } from "../persistence/types.ts";
export interface AdvancePlan {
  version: 1;
  startTick: number;
  targetTick: number;
}
export interface AdvanceOptions {
  days: number;
  budgetMs: number;
}
export interface AdvanceProgress {
  doneTicks: number;
  totalTicks: number;
  tick: number;
  activeMs: number;
  elapsedMs: number;
  maxSliceMs: number;
}
export interface AdvanceOutcome {
  session: SessionState;
  complete: boolean;
  progress: AdvanceProgress;
}
export type AdvanceResponse =
  | { id: number; type: "progress"; progress: AdvanceProgress }
  | { id: number; type: "result"; outcome: AdvanceOutcome }
  | { id: number; type: "error"; error: string };
export interface AdvanceRequest {
  id: number;
  session: SessionState;
  options: AdvanceOptions;
}
export function validateAdvancePlan(
  value: unknown,
  tick: number,
): AdvancePlan | undefined {
  if (value === undefined) return;
  const p = value as Partial<AdvancePlan> | null;
  if (
    !p ||
    p.version !== 1 ||
    !Number.isSafeInteger(p.startTick) ||
    !Number.isSafeInteger(p.targetTick) ||
    p.startTick! < 0 ||
    p.startTick! > tick ||
    p.targetTick! <= tick ||
    p.targetTick! - p.startTick! > 36500
  )
    throw Error("Plano de avanço inválido.");
  return { version: 1, startTick: p.startTick!, targetTick: p.targetTick! };
}
export function validateAdvanceOptions(o: AdvanceOptions) {
  if (
    !o ||
    !Number.isInteger(o.days) ||
    o.days < 1 ||
    o.days > 365 ||
    ![10000, 30000, 120000].includes(o.budgetMs)
  )
    throw Error("Avanço: escolha de1 a365 dias e um orçamento permitido.");
}
