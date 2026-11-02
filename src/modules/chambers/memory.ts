import { modelMath } from "../../libs/model-math.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import { CHAMBER_PARAMETERS as p } from "./types.ts";
import { chamberQuality } from "./score.ts";
export const localChambers = (w: ColonyWorld) =>
  resolveBiologicalProfile(w.biologicalProfile).chamberModel === "local-demo";
/** A worker records only the room physically occupied; distant rooms are never sampled. */
export function rememberRoomClimate(w: ColonyWorld, a: ColonyAgent): void {
  if (!localChambers(w) || a.kind !== "worker" || a.node === null) return;
  const node = w.nest.nodes[a.node];
  if (
    !node ||
    (node.colonyId ?? 1) !== (a.colonyId ?? 1) ||
    ["entrance", "front", "waste"].includes(node.type) ||
    modelMath.hypot(a.x - node.x, (a.y ?? 0) - node.y, a.z - node.z) >
      node.r + 0.15
  )
    return;
  const r = sampleClimate(w.microclimate, { x: a.x, y: a.y ?? 0, z: a.z });
  if (!r) return;
  const memory = (a.roomMemory ??= { version: 1, rooms: [] });
  memory.rooms = memory.rooms.filter(
    (v) => v.node !== a.node && w.tick - v.tick <= p.memoryTicks,
  );
  memory.rooms.push({
    node: a.node,
    tick: w.tick,
    reading: { water: r.water, temperature: r.temperature },
  });
  memory.rooms = memory.rooms.slice(-p.memoryLimit);
}
export function knownBroodRoom(w: ColonyWorld, a: ColonyAgent): number | null {
  let best: null | number = null,
    score = -Infinity;
  for (const m of a.roomMemory?.rooms ?? []) {
    const n = w.nest.nodes[m.node];
    if (
      !n ||
      ["entrance", "front", "waste"].includes(n.type) ||
      w.tick - m.tick > p.memoryTicks ||
      (n.colonyId ?? 1) !== (a.colonyId ?? 1)
    )
      continue;
    const utility = chamberQuality(m.reading, "brood");
    if (utility > score + 0.02) {
      score = utility;
      best = m.node;
    }
  }
  return best;
}
