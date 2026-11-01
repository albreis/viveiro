import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { roomNode } from "../colony/rooms.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import { broodPosition } from "../colony/brood.ts";
import { startSupportedMotion } from "../navigation/support-motion.ts";
export function arriveMimic(w: ColonyWorld, a: ColonyAgent, node: number) {
  const m = w.ecology?.mimics.find(
    (m) => m.id === a.carryingMimic && m.carrier === a.id,
  );
  if (!m) return false;
  m.destination ??= roomNode(w.nest, "nursery", 0, a.colonyId || 1);
  if (node !== m.destination) {
    requestRoute(w, a, m.destination);
    return true;
  }
  if (m.placing) return true;
  a.route = [];
  m.placing = true;
  const s = broodPosition(w, m.id, node);
  startSupportedMotion(w, a, s.point, s.normal, w.nest.nodes[node]);
  return true;
}
