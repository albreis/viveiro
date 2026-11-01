import { initializeFoundressForaging } from "../semiclaustral/initialize.ts";
import { initializeMaternalReserves } from "../maternal/initialize.ts";
import { foundingPlan } from "./plan.ts";
import type { FoundingWorld } from "./types.ts";
import { surfaceHeight } from "../landscape/queries.ts";
/** Keep only a potential site, never pre-cut galleries for a new foundress. */
export function initializeFounding(world: FoundingWorld) {
  world.founding = foundingPlan(world.nest, world.params.humidity);
  initializeMaternalReserves(world);
  initializeFoundressForaging(world);
  const site = world.founding.site;
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
