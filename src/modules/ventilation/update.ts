import { airNetwork } from "./network.ts";
import { syncGases } from "./state.ts";
import { solveAirPressure } from "./pressure.ts";
import { transportGases } from "./transport.ts";
import { respire } from "./respiration.ts";
import type { GasWorld } from "./types.ts";
export function updateVentilation(w: GasWorld) {
  if (w.tick % 10) return;
  const network = airNetwork(w),
    state = syncGases(w, network),
    inlets = solveAirPressure(w, network, state);
  respire(w, state, 10);
  transportGases(state, network, inlets, 10);
  state.steps++;
}
