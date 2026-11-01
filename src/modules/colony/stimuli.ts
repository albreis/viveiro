import { roomNode } from "./rooms.ts";
import { neighborsOf } from "../navigation/sensors.ts";
import type { ColonyAgent, ColonyWorld, Role } from "./types.ts";
import { distance3 } from "../soil/ledger.ts";
export type TaskStimuli = Record<Role, number>;
export function senseTaskStimuli(
  world: ColonyWorld,
  ant: ColonyAgent,
): TaskStimuli {
  const crowd = Math.max(0, neighborsOf(world, ant, 0.9).length - 3);
  const here = { x: ant.x, y: ant.y || 0, z: ant.z };
  const queen = world.ants.find(
    (a) =>
      a.kind === "queen" &&
      distance3(here, { x: a.x, y: a.y || 0, z: a.z }) < 0.9,
  );
  if (queen)
    ant.taskMemory = {
      queenNeed: Math.max(0, 0.3 - queen.crop) * 3,
      until: world.tick + 400,
    };
  const queenNeed =
    ant.taskMemory && ant.taskMemory.until > world.tick
      ? ant.taskMemory.queenNeed
      : 0;
  const brood = world.brood.filter(
    (b) =>
      !b.carrier &&
      b.node !== roomNode(world.nest, "nursery", 0, ant.colonyId || 1) &&
      distance3(here, b) < 0.9,
  ).length;
  const waste = world.colony.waste
    .filter((w) => !w.stored && !w.carrier && distance3(here, w) < 0.9)
    .reduce((n, w) => n + w.mass, 0);
  const rubble = (world.nest.rubble || [])
    .filter((p) => distance3(here, p) < 1)
    .reduce((n, p) => n + p.mass, 0);
  const front = world.soil.projects.some(
    (p) =>
      !p.completed &&
      (distance3(here, world.nest.nodes[p.front]) < 1 ||
        distance3(here, world.nest.nodes[p.from]) < 1),
  );
  const danger = world.predators.some(
    (p) => Math.hypot(p.x - ant.x, p.z - ant.z) < 1.2,
  );
  const entrance = world.nest.nodes.some(
    (n) => n.type === "entrance" && distance3(here, n) < 1.2,
  );
  return {
    forager:
      0.3 + Math.max(0, (85 - ant.energy) / 50) + ant.traits.exploration * 0.2,
    nurse:
      queenNeed +
      Math.min(2, brood * 0.4) +
      (ant.age < 1.5 &&
      ["royal", "nursery"].includes(world.nest.nodes[ant.node ?? -1]?.type)
        ? 0.2
        : 0),
    cleaner: waste / 0.04,
    excavator: rubble / 0.03 + (front ? 0.55 : 0) + crowd * 0.15,
    defender:
      (danger ? 1.5 : entrance && ant.caste === "major" ? 0.2 : 0) *
      (0.2 + ant.traits.courage * 1.8),
  };
}
