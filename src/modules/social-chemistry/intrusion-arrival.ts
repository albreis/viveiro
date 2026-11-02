import { takeStock, hasStockBin } from "../stores/ledger.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { ownerWorld } from "../colonies/shared.ts";
import { isStock } from "../colony/rooms.ts";
import { requestIntrusionRoute } from "./intrusion-route.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import { startSupportedMotion } from "../navigation/support-motion.ts";
export function arriveIntruder(
  w: ColonyWorld,
  a: ColonyAgent,
  node: number,
): boolean {
  const t = a.intrusion;
  if (!t) return false;
  if (t.phase === "exit" && node === t.entry) {
    a.lastEntrance = t.home;
    delete a.intrusion;
    return false;
  }
  if (t.phase !== "search") return true;
  const room = w.nest.nodes[node],
    victim = ownerWorld(w, t.owner);
  if ((room.colonyId || 1) !== t.owner) return true;
  if (
    !(victim && hasStockBin(victim, node)) &&
    !isStock(w.nest, node, t.owner)
  ) {
    t.goal = "storage";
    requestIntrusionRoute(w, a, t);
    return true;
  }
  if (
    Math.hypot(a.x - room.x, (a.y || 0) - room.y, a.z - room.z) >
    room.r + 0.25
  ) {
    const s = projectSupport(w.nest, {
      x: room.x - 0.1,
      y: room.y - room.r * 0.9,
      z: room.z,
    });
    startSupportedMotion(w, a, s.point, s.normal, room);
    return true;
  }
  const amount = victim
    ? takeStock(
        victim,
        Math.min(0.35, Math.max(0, victim.food - 0.2)),
        "stolen",
        node,
        !!victim.colony.stores,
      )
    : 0;
  if (victim) {
    a.carrying += amount;
    if (w.socialChemistry) w.socialChemistry.stolen += amount;
  }
  t.phase = "exit";
  a.route = [];
  requestIntrusionRoute(w, a, t);
  a.state = amount
    ? "Levando alimento de outro ninho"
    : "Saindo sem encontrar estoque";
  return true;
}
