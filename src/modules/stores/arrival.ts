import type { NavigationWorld, AgentState } from "../navigation/types.ts";
import { physicalStockVisit } from "./local.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import { startSupportedMotion } from "../navigation/support-motion.ts";
/** Logical route arrival is not permission to deposit through distant soil. */
export function settleStockArrival(
  w: NavigationWorld,
  a: AgentState,
  node: number,
): boolean {
  if (!w.colony?.stores || physicalStockVisit(w, a, node)) return false;
  const room = w.nest.nodes[node],
    s = projectSupport(w.nest, {
      x: room.x - 0.12,
      y: room.y - room.r * 0.9,
      z: room.z,
    });
  a.route = [node];
  startSupportedMotion(w, a, s.point, s.normal, room);
  a.state = "Chegando ao local de estoque";
  return true;
}
