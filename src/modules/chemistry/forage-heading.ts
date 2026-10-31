import type { ColonyAgent, ColonyWorld } from "../colony/types.ts";
import { sampleACO } from "./aco.ts";
interface TrailWorld extends ColonyWorld {
  params: ColonyWorld["params"] & { randomness: number };
  pheromones: number[];
  pheromoneIndex(x: number, z: number): number;
}
export function chooseForagingHeading(
  world: TrailWorld,
  ant: ColonyAgent,
  heading: number,
) {
  const angles = [heading - 0.7, heading, heading + 0.7];
  const signal = angles.map(
    (a) =>
      world.pheromones[
        world.pheromoneIndex(
          ant.x + Math.cos(a) * 0.7,
          ant.z + Math.sin(a) * 0.7,
        )
      ],
  );
  const heuristic = angles.map(
    (a, i) =>
      (world.inPond(ant.x + Math.cos(a) * 0.7, ant.z + Math.sin(a) * 0.7)
        ? 0.1
        : 1) * (i === 1 ? 1 : 0.85),
  );
  const index = sampleACO(signal, heuristic, () => world.random(), {
    exploration:
      0.03 + (world.params.randomness / 100) * ant.traits.exploration * 0.35,
  });
  return (
    angles[index] +
    world.range(-0.12, 0.12) * (0.2 + world.params.randomness / 100)
  );
}
