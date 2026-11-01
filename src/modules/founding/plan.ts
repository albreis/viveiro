import type { FoundingState } from "./types.ts";
import type { NestState } from "../navigation/types.ts";
export function foundingPlan(
  nest: NestState,
  humidity: number,
  tick = 0,
  reserves = 8,
): FoundingState {
  const site = { ...nest.nodes[0] },
    chamber = { ...nest.nodes[2] };
  const dx = chamber.x - site.x,
    dz = chamber.z - site.z,
    d = Math.hypot(dx, dz) || 1,
    reach = Math.min(d, 0.8 + Math.abs(chamber.y) * 0.15);
  chamber.x = site.x + (dx * reach) / d;
  chamber.z = site.z + (dz * reach) / d;
  chamber.y = site.y - 0.85 - Math.abs(chamber.y) * 0.1;
  return {
    version: 1,
    phase: "weather",
    since: tick,
    lastRain: humidity >= 45 ? tick : tick - 1000,
    site,
    chamber,
    initialReserves: reserves,
    reserves,
    spent: { maintenance: 0, eggs: 0, larvae: 0, excavation: 0 },
    firstClutch: false,
    nanitics: 0,
    discardedWings: [],
    digMode: "bite",
    trips: 0,
  };
}
