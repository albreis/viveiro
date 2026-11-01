import { requestRoute } from "../navigation/local-routing.ts";
import type { ColonyWorld } from "./types.ts";
import { LIMIT } from "../simulation/constants.js";
import { projectSupport } from "../terrain/surface-queries.ts";
import { makeBrood, broodStage } from "./brood.ts";

export function updateBroodLifecycle(world: ColonyWorld, suitability: number) {
  const queen = world.ants.find((a) => a.kind === "queen");
  const larvae = world.brood.filter((b) => broodStage(b.age) === "larva");
  const consumption = larvae.length * 0.0012;
  const fed = world.food >= consumption;
  world.food = Math.max(0, world.food - consumption);
  if (queen) {
    queen.state =
      world.tick < 40 ? "Preparando a primeira postura" : "Cuidando da colônia";
    if (
      world.tick >= 25 &&
      world.tick - world.lastLaying >= 65 &&
      world.food > 2 &&
      world.queenHealth > 20 &&
      world.population + world.brood.length < LIMIT
    ) {
      const eggs = Math.min(
        4 + Math.floor(world.random() * 3),
        LIMIT - world.population - world.brood.length,
      );
      for (let i = 0; i < eggs; i++)
        world.brood.push(makeBrood(world, world.nextId++));
      world.food = Math.max(0, world.food - eggs * 0.21);
      world.lastLaying = world.tick;
      world.log("A rainha colocou " + eggs + " ovos.", "birth");
    }
  }
  const remaining = [];
  let hatched = 0;
  for (const brood of world.brood) {
    if (fed || broodStage(brood.age) !== "larva")
      brood.age += 0.006 + suitability * 0.004;
    if (
      brood.age >= 1.3 &&
      brood.carrier === undefined &&
      world.population < LIMIT
    ) {
      const ant = world.makeAnt("worker", brood.x, brood.z);
      const support = projectSupport(world.nest, {
        x: brood.x,
        y: brood.y - 0.025,
        z: brood.z,
      });
      Object.assign(ant, support.point, {
        normal: support.normal,
        node: brood.node,
        tunnelY: world.nest.nodes[brood.node].y,
        tunnelCenter: {
          x: world.nest.nodes[brood.node].x,
          y: world.nest.nodes[brood.node].y,
          z: world.nest.nodes[brood.node].z,
        },
      });
      const nurse =
        world.ants.filter(
          (a) =>
            a.kind === "worker" &&
            Math.hypot(a.x - ant.x, (a.y || 0) - (ant.y || 0), a.z - ant.z) <
              1.2,
        ).length >= 4 && ant.traits.exploration < 0.5;
      requestRoute(world, ant, nurse ? 2 : ant.id % 2 ? 0 : 6);
      world.ants.push(ant);
      world.born++;
      hatched++;
    } else remaining.push(brood);
  }
  world.brood = remaining;
  if (hatched) world.log(hatched + " operária(s) nasceram.", "birth");
}
