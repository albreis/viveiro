import type { FoundingWorld } from "./types.ts";
import { surfaceHeight } from "../landscape/queries.ts";
/** Keep only a potential site, never pre-cut galleries for a new foundress. */
export function initializeFounding(world: FoundingWorld) {
  const site = { ...world.nest.nodes[0] },
    chamber = { ...world.nest.nodes[2] };
  const dx = chamber.x - site.x,
    dz = chamber.z - site.z,
    d = Math.hypot(dx, dz) || 1;
  const reach = Math.min(d, 0.8 + Math.abs(chamber.y) * 0.15);
  chamber.x = site.x + (dx * reach) / d;
  chamber.z = site.z + (dz * reach) / d;
  chamber.y = site.y - 0.85 - Math.abs(chamber.y) * 0.1;
  world.founding = {
    version: 1,
    phase: "weather",
    since: 0,
    lastRain: world.params.humidity >= 45 ? 0 : -1000,
    site,
    chamber,
    initialReserves: 8,
    reserves: 8,
    spent: { maintenance: 0, eggs: 0, larvae: 0, excavation: 0 },
    firstClutch: false,
    nanitics: 0,
    discardedWings: [],
    digMode: "bite",
    trips: 0,
  };
  world.food = 0;
  world.nest = {
    nodes: [],
    links: [],
    linkWidths: [],
    revision: 2,
    relief: world.nest.relief,
  };
  for (const ant of world.ants) {
    ant.x = site.x + (ant.kind === "queen" ? 0.65 : -0.65);
    ant.z = site.z;
    ant.y = surfaceHeight(world.nest.relief, ant.x, ant.z) + 0.008;
    ant.node = null;
    ant.route = [];
    ant.tunnelY = 0;
    delete ant.tunnelCenter;
    ant.normal = { x: 0, y: 1, z: 0 };
    ant.winged = true;
    ant.crop = 0;
    ant.state = "Aguardando condições de voo";
  }
  world.log(
    "Dois alados e solo intacto. A fundação começa após condições úmidas e quentes.",
    "birth",
  );
}
