import { modelMath } from "../../libs/model-math.ts";
import { fertilizeEgg } from "../fertility/egg.ts";
import { initializeCocoon } from "../development/cocoon.ts";
import { initializeBroodDevelopment } from "../development/initialize.ts";
import { DEMO_BROOD_STAGES } from "../biology/demo-constants.ts";
import { roomNode } from "./rooms.ts";
import { inheritGenome } from "../genetics/reproduction.ts";
import type { Brood, ColonyWorld } from "./types.ts";
import { hashSeed } from "../simulation/seed.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
export const broodStage = (age: number) =>
  age < DEMO_BROOD_STAGES.larva
    ? "egg"
    : age < DEMO_BROOD_STAGES.pupa
      ? "larva"
      : "pupa";
export function broodPosition(world: ColonyWorld, id: number, nodeId: number) {
  const node = world.nest.nodes[nodeId];
  const angle =
    (hashSeed(world.seed + ":brood:" + id) / 4294967296) * Math.PI * 2;
  const radius = 0.08 + (id % 5) * 0.025;
  return projectSupport(world.nest, {
    x: node.x + modelMath.cos(angle) * radius,
    y: node.y - node.r * 0.92,
    z: Math.max(-6.3, Math.min(6.3, node.z + modelMath.sin(angle) * radius)),
  });
}
export function makeBrood(
  world: ColonyWorld,
  id: number,
  node = roomNode(world.nest, "royal", 0, world.colonyId || 1),
  kind: "worker" | "gyne" | "male" = "worker",
): Brood {
  const support = broodPosition(world, id, node);
  const result = fertilizeEgg(world, id, kind);
  kind = result.kind;
  const genome = world.genetics
    ? inheritGenome(world, id, kind === "male", result.sire)
    : undefined;
  if (genome && world.genetics) {
    world.genetics.embryos++;
    world.genetics.mutationEvents += genome.mutations.length;
  }
  const brood: Brood = {
    id,
    age: 0,
    node,
    ...support.point,
    y: support.point.y + 0.025,
    genome,
    kind,
    ...(result.record ? { fertilization: result.record } : {}),
  };
  initializeBroodDevelopment(world, brood);
  initializeCocoon(world, brood);
  return brood;
}
export function migrateBrood(world: ColonyWorld) {
  for (const brood of world.brood)
    if (brood.node === undefined || !Number.isFinite(brood.y)) {
      const age = brood.age,
        id = brood.id;
      Object.assign(brood, makeBrood(world, id, 3), { age });
    }
}
