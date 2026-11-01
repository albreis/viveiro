import type { FamilyWorld } from "../colonies/types.ts";
import type { AgentState } from "../navigation/types.ts";
/** The shared predator loop must inspect the actual colony of each queen. */
export function exposedFoundress(w: FamilyWorld, a: AgentState): boolean {
  if (a.kind !== "queen" || a.node !== null) return false;
  const owner =
    (a.colonyId ?? 1) === (w.colonyId ?? 1)
      ? w
      : w.colonies?.find((c) => c.colonyId === a.colonyId);
  const s = owner?.founding?.foraging;
  return !!s && s.phase !== "nursing";
}
