import { modelMath } from "../../libs/model-math.ts";
import { DAUGHTER_RESERVE } from "../colonies/sexual-brood.ts";
import type { ColonyWorld, Brood } from "./types.ts";
import { roomNode } from "./rooms.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import { requestRoute } from "../navigation/local-routing.ts";
export function hatchWorker(world: ColonyWorld, brood: Brood) {
  const ant = world.makeAnt(
      brood.kind || "worker",
      brood.x,
      brood.z,
      brood.genome,
    ),
    node = world.nest.nodes[brood.node];
  const support = projectSupport(world.nest, {
    x: brood.x,
    y: brood.y - 0.025,
    z: brood.z,
  });
  Object.assign(ant, support.point, {
    normal: support.normal,
    node: brood.node,
    tunnelY: node.y,
    tunnelCenter: { x: node.x, y: node.y, z: node.z },
  });
  if (brood.kind === "gyne" || brood.kind === "male") {
    ant.sexual = true;
    ant.winged = true;
    ant.role = "nurse";
    ant.state = "Alado em maturação";
    if (brood.kind === "gyne") ant.foundressBudget = DAUGHTER_RESERVE;
    world.ants.push(ant);
    world.born++;
    return ant;
  }
  if (brood.nanitic) {
    ant.nanitic = true;
    ant.bodyScale *= 0.72;
    ant.headScale = 1;
    ant.caste = "minor";
    if (world.founding) world.founding.nanitics++;
  }
  const nurse =
    world.ants.filter(
      (a) =>
        a.kind === "worker" &&
        modelMath.hypot(a.x - ant.x, (a.y || 0) - (ant.y || 0), a.z - ant.z) <
          1.2,
    ).length >= 4 && ant.traits.exploration < 0.5;
  requestRoute(
    world,
    ant,
    roomNode(
      world.nest,
      nurse ? "royal" : "entrance",
      ant.id % 2,
      world.colonyId || 1,
    ),
  );
  world.ants.push(ant);
  world.born++;
  return ant;
}
