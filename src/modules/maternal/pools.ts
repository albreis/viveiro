import { MATERNAL_PARAMETERS as parameters } from "./types.ts";
import type { MaternalState, MaternalUse, ReserveStores } from "./types.ts";
export const reserveTotal = (stores: ReserveStores) =>
  stores.lipid + stores.protein + stores.muscle;
export function createMaternalState(total: number): MaternalState {
  if (!Number.isFinite(total) || total < 0)
    throw new Error("Reserva materna inválida.");
  const stores = {
    lipid: total * parameters.lipidFraction,
    protein: total * parameters.proteinFraction,
    muscle: total * parameters.muscleFraction,
  };
  return {
    version: 1,
    initial: { ...stores },
    stores,
    converted: 0,
    consumed: { lipid: 0, protein: 0 },
    unmet: { maintenance: 0, eggs: 0, larvae: 0, excavation: 0 },
  };
}
export function accessibleReserve(
  state: MaternalState,
  use: MaternalUse,
): number {
  return (
    state.stores.protein +
    (["maintenance", "excavation"].includes(use) ? state.stores.lipid : 0)
  );
}
export function withdrawMaternal(
  state: MaternalState,
  use: MaternalUse,
  requested: number,
): number {
  if (!(requested > 0) || !Number.isFinite(requested)) return 0;
  let remaining = requested;
  const order: ("lipid" | "protein")[] =
    use === "eggs" || use === "larvae" ? ["protein"] : ["lipid", "protein"];
  for (const key of order) {
    const paid = Math.min(state.stores[key], remaining);
    state.stores[key] -= paid;
    state.consumed[key] += paid;
    remaining -= paid;
  }
  state.unmet[use] += remaining;
  return requested - remaining;
}
// A unit-preserving transfer; no additional energy is created by labelling tissue as food.
export function histolyzeMuscle(state: MaternalState, dt = 1): number {
  if (!(dt > 0) || !Number.isFinite(dt)) return 0;
  const amount = Math.min(
    state.stores.muscle,
    parameters.histolysisPerTick * dt,
  );
  state.stores.muscle -= amount;
  state.stores.protein += amount;
  state.converted += amount;
  return amount;
}
export function maternalBalance(state: MaternalState) {
  const initial = reserveTotal(state.initial),
    remaining = reserveTotal(state.stores),
    consumed = state.consumed.lipid + state.consumed.protein;
  return {
    initial,
    remaining,
    consumed,
    converted: state.converted,
    error: initial - remaining - consumed,
  };
}
