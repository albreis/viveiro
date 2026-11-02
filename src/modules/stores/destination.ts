import type { ColonyAgent, ColonyWorld } from "../colony/types.ts";
import { CHAMBER_PARAMETERS } from "../chambers/types.ts";
import { STORE_PARAMETERS } from "./types.ts";
/** No remote climate read: use only this worker's unexpired visits. */
export function knownStorageRoom(
  w: ColonyWorld,
  a: ColonyAgent,
): number | null {
  let target: number | null = null,
    best = -Infinity;
  for (const m of a.roomMemory?.rooms ?? []) {
    const n = w.nest.nodes[m.node];
    if (
      !n ||
      ["entrance", "front", "waste"].includes(n.type) ||
      (n.colonyId ?? 1) !== (a.colonyId ?? 1) ||
      w.tick - m.tick > CHAMBER_PARAMETERS.memoryTicks
    )
      continue;
    const score =
      1 -
      Math.abs(m.reading.water - STORE_PARAMETERS.preferredWater) / 0.65 -
      Math.abs(m.reading.temperature - 25) / 25;
    if (score > best + 0.02) {
      best = score;
      target = m.node;
    }
  }
  return target;
}
export function storageDestination(
  w: ColonyWorld,
  a: ColonyAgent,
  fallback: number,
): number {
  if (!w.colony.stores) return fallback;
  const goal = knownStorageRoom(w, a);
  if (goal !== null) a.stockGoal = goal;
  return goal ?? fallback;
}
