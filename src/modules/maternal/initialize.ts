import type { FoundingWorld } from "../founding/types.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { createMaternalState, histolyzeMuscle, reserveTotal } from "./pools.ts";
export function initializeMaternalReserves(
  world: FoundingWorld & { biologicalProfile?: unknown },
): void {
  const founding = world.founding;
  if (
    !founding ||
    founding.maternal ||
    resolveBiologicalProfile(world.biologicalProfile).maternalModel !== "pools"
  )
    return;
  founding.maternal = createMaternalState(founding.reserves);
}
export function advanceMaternalReserves(world: FoundingWorld): void {
  const f = world.founding;
  if (!f?.maternal) return;
  const q = world.ants.find((a) => a.kind === "queen");
  if (q && !q.winged && ["digging", "claustral"].includes(f.phase))
    histolyzeMuscle(f.maternal);
  f.reserves = reserveTotal(f.maternal.stores);
}
