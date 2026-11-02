import { addStock } from "../stores/ledger.ts";
import type { FoundingState, ReserveUse } from "../founding/types.ts";
import type { ColonyAgent, ColonyWorld } from "../colony/types.ts";
/** Collected food is separate from the original maternal tissue ledger. */
export function withdrawForaged(
  f: FoundingState,
  use: ReserveUse,
  requested: number,
): number {
  const s = f.foraging;
  if (!s || (use === "maintenance" && s.phase !== "nursing")) return 0;
  const amount = Math.min(s.pantry, requested);
  s.pantry -= amount;
  s.consumed += amount;
  return amount;
}
export function exportFoundressPantry(w: ColonyWorld): void {
  const s = w.founding?.foraging;
  if (!s) return;
  addStock(w, s.pantry, "foundress");
  s.exported += s.pantry;
  s.pantry = 0;
}
export function loseFoundressLoad(w: ColonyWorld, queen: ColonyAgent): void {
  const s = w.founding?.foraging;
  if (!s || queen.kind !== "queen") return;
  s.lost += s.load;
  s.load = 0;
  queen.carrying = 0;
}
export function foragingBalance(s: NonNullable<FoundingState["foraging"]>) {
  return {
    collection: s.collected - s.load - s.delivered - s.lost,
    pantry: s.delivered - s.pantry - s.consumed - s.exported,
  };
}
