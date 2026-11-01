import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { seasonFactors } from "./update.ts";
import { roomNode } from "../colony/rooms.ts";
import { enterForSoil } from "../soil/routing.ts";
import { requestRoute } from "../navigation/local-routing.ts";
/** Gradual activity cadence; loaded workers finish deliveries before resting. */
export function seasonalShelter(w: ColonyWorld, a: ColonyAgent): boolean {
  const factor = seasonFactors(w).activity;
  if (factor >= 1) return false;
  if (
    a.carrying ||
    a.carryingBrood ||
    a.carryingWaste ||
    (a.carryingSoil || 0) > 0
  )
    return false;
  if ((w.tick + a.id) % 5 >= Math.max(1, Math.ceil(factor * 5))) {
    a.state = "Em repouso sazonal";
    return true;
  }
  if (w.colony.season?.phase === "resuming") return false;
  const royal = roomNode(w.nest, "royal", 0, w.colonyId || 1);
  if (royal < 0) return false;
  if (a.node === null) enterForSoil(w, a, royal);
  else {
    requestRoute(w, a, royal);
    if (a.route.length) w.moveInNest(a);
  }
  a.state =
    a.node === royal && !a.route.length
      ? "Em repouso sazonal"
      : "Voltando ao abrigo para repouso";
  return true;
}
