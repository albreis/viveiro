import { seasonFactors } from "../seasons/update.ts";
import type { GasState, GasWorld } from "./types.ts";
import type { ColonyAgent } from "../colony/types.ts";
export function agentGasCell(w: GasWorld, a: ColonyAgent) {
  if (a.node === null || a.node === undefined || a.airborne) return null;
  const from = w.nest.nodes[a.node],
    head = a.route?.[0],
    to = head === undefined ? undefined : w.nest.nodes[head];
  if (!from) return null;
  if (
    to &&
    Math.hypot(a.x - to.x, (a.y ?? 0) - to.y, a.z - to.z) <
      Math.hypot(a.x - from.x, (a.y ?? 0) - from.y, a.z - from.z)
  )
    return head;
  return a.node;
}
export function respire(w: GasWorld, s: GasState, dt: number) {
  const demand = new Float64Array(s.cells.length);
  for (const c of [w, ...(w.colonies || [])]) {
    const factor = seasonFactors(c).activity;
    for (const a of c.ants) {
      const i = agentGasCell(w, a);
      if (i != null)
        demand[i] +=
          0.000002 * (a.bodyScale ?? 1) ** 3 * (a.metabolicCost ?? 1) * factor;
    }
    for (const b of c.brood) {
      const carrier =
        b.carrier === undefined
          ? undefined
          : c.ants.find((a) => a.id === b.carrier);
      const i = carrier ? agentGasCell(w, carrier) : b.node;
      if (i != null && s.cells[i]) demand[i] += 0.0000003 * factor;
    }
  }
  demand.forEach((rate, i) => {
    const cell = s.cells[i],
      amount = Math.min(cell.oxygen, rate * dt);
    cell.oxygen -= amount;
    cell.carbon += amount * 0.8;
    s.consumed += amount;
    s.produced += amount * 0.8;
  });
}
