import type { ColonyWorld, Brood } from "./types.ts";
import { addWaste } from "./waste.ts";
export function loseBrood(w: ColonyWorld, b: Brood): void {
  const carrier = w.ants.find((a) => a.id === b.carrier);
  if (carrier) {
    delete carrier.carryingBrood;
    if (carrier.bioTask?.item === b.id) delete carrier.bioTask;
  }
  w.colony.broodLosses = (w.colony.broodLosses || 0) + 1;
  addWaste(w, {
    x: carrier?.x ?? b.x,
    y: carrier?.y ?? b.y,
    z: carrier?.z ?? b.z,
    mass: 0.01,
    kind: "corpse",
    stored: false,
  });
}
