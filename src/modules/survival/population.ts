import type { FamilyWorld } from "../colonies/types.ts";
import { allAnts } from "../colonies/types.ts";
/** Combined renderer views already contain daughter bodies; count each physical ID once. */
export function survivalPopulation(w: FamilyWorld) {
  return [...new Map(allAnts(w).map((a) => [a.id, a])).values()].filter(
    (a) => a.life,
  );
}
