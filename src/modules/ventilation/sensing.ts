import { modelMath } from "../../libs/model-math.ts";
import { ATMOSPHERE, type GasWorld, type GasState } from "./types.ts";
import type { AgentState, NavigationWorld } from "../navigation/types.ts";
import { agentGasCell } from "./respiration.ts";
export const gasFractions = (s: GasState | undefined, i: number | null) => {
  const cell = i == null ? undefined : s?.cells[i];
  return cell
    ? { oxygen: cell.oxygen / cell.volume, carbon: cell.carbon / cell.volume }
    : ATMOSPHERE;
};
/** Illustrative stress curve; thresholds require species-specific experimental data. */
export const airStress = (air: { oxygen: number; carbon: number }) =>
  Math.min(
    1,
    Math.max(0, (0.16 - air.oxygen) / 0.12, (air.carbon - 0.02) / 0.08),
  );
export function adjacentAirComfort(
  w: NavigationWorld & { gases?: GasState },
  ant: AgentState,
  id: number,
) {
  const a = ant.node == null ? undefined : w.nest.nodes[ant.node],
    b = w.nest.nodes[id];
  if (!a || !b || modelMath.hypot(a.x - b.x, a.y - b.y, a.z - b.z) > 1.2)
    return 1;
  return 1 - 0.95 * airStress(gasFractions(w.gases, id));
}
export function airEnergyCost(
  w: GasWorld,
  ant: import("../colony/types.ts").ColonyAgent,
) {
  return 0.05 * airStress(gasFractions(w.gases, agentGasCell(w, ant)));
}
export function gasBudget(s: GasState) {
  return {
    oxygen:
      s.initialOxygen +
      s.geometryOxygen +
      s.boundaryOxygen -
      s.consumed -
      s.cells.reduce((n, c) => n + c.oxygen, 0),
    carbon:
      s.initialCarbon +
      s.geometryCarbon +
      s.boundaryCarbon +
      s.produced -
      s.cells.reduce((n, c) => n + c.carbon, 0),
  };
}
