import type { AgentState, NestState } from "../navigation/types.ts";
import { SEAL_PARAMETERS } from "./types.ts";
export function edgePassable(
  nest: NestState,
  a: number,
  b: number,
  ant: AgentState,
): boolean {
  return !(nest.plugs || []).some((p) => {
    const pair = nest.links[p.edge];
    return (
      pair &&
      ((pair[0] === a && pair[1] === b) || (pair[1] === a && pair[0] === b)) &&
      p.mass > 1e-10 &&
      p.innerRadius <
        (ant.kind === "queen" ? 0.25 : 0.14) * (ant.bodyScale || 1) + 0.03
    );
  });
}
/** Porous solid limits diffusion and pressure flow differently; never assumes an airtight cap. */
export function plugTransport(nest: NestState, edge: number) {
  let diffusion = 1,
    flow = 1;
  for (const p of nest.plugs || [])
    if (p.edge === edge && p.mass > 1e-10) {
      const open = Math.max(0, Math.min(1, 1 - p.mass / p.capacity));
      diffusion *= open + (1 - open) * SEAL_PARAMETERS.diffusionPorosity;
      flow *= open * open + (1 - open * open) * SEAL_PARAMETERS.flowPorosity;
    }
  return { diffusion, flow };
}
