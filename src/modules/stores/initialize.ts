import type { StockWorld } from "./types.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
export function initializeRoomStores(w: StockWorld): void {
  if (
    resolveBiologicalProfile(w.biologicalProfile).stockModel !== "rooms-demo" ||
    !w.colony ||
    w.colony.stores
  )
    return;
  const q = w.ants?.find((a) => a.kind === "queen"),
    node = q?.node ?? -1,
    n = w.nest?.nodes[node];
  if (w.food > 0 && !n) throw new Error("Reserva inicial sem câmara.");
  w.colony.stores = {
    version: 1,
    initial: w.food,
    incoming: 0,
    outgoing: 0,
    flows: {},
    bins:
      w.food > 0
        ? [
            {
              node,
              amount: w.food,
              point: { x: n!.x, y: n!.y - n!.r * 0.9, z: n!.z },
            },
          ]
        : [],
  };
}
