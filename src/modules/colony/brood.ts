import { inheritGenome } from "../genetics/reproduction.ts";
import type { Brood, ColonyWorld } from "./types.ts";
import { hashSeed } from "../simulation/seed.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
export const broodStage = (age: number) =>
  age < 0.35 ? "egg" : age < 0.9 ? "larva" : "pupa";
export function broodPosition(world: ColonyWorld, id: number, nodeId: number) {
  const node = world.nest.nodes[nodeId];
  const angle =
    (hashSeed(world.seed + ":brood:" + id) / 4294967296) * Math.PI * 2;
  const radius = 0.08 + (id % 5) * 0.025;
  return projectSupport(world.nest, {
    x: node.x + Math.cos(angle) * radius,
    y: node.y - node.r * 0.92,
    z: Math.max(-6.3, Math.min(6.3, node.z + Math.sin(angle) * radius)),
  });
}
export function makeBrood(world: ColonyWorld, id: number, node = 2): Brood {
  const support = broodPosition(world, id, node);
  const genome = world.genetics ? inheritGenome(world, id) : undefined;
  if (genome && world.genetics) {
    world.genetics.embryos++;
    world.genetics.mutationEvents += genome.mutations.length;
  }
  return {
    id,
    age: 0,
    node,
    ...support.point,
    y: support.point.y + 0.025,
    genome,
  };
}
export function migrateBrood(world: ColonyWorld) {
  for (const brood of world.brood)
    if (brood.node === undefined || !Number.isFinite(brood.y)) {
      const age = brood.age,
        id = brood.id;
      Object.assign(brood, makeBrood(world, id, 3), { age });
    }
}
