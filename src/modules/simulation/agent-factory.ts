import { referenceFounderScale } from "../biology/founder-reference.ts";
import {
  applyReferenceWorker,
  clampWorkerScale,
  workerReference,
} from "../biology/worker-reference.ts";
import { initializeLife } from "../survival/initialize.ts";
import { genomeForAgent } from "../genetics/reproduction.ts";
import { expressGenome } from "../genetics/phenotype.ts";
import type { Genome } from "../genetics/genome.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { individualTraits } from "../colony/individual.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
type FactoryWorld = Pick<
  ColonyWorld,
  | "biologicalProfile"
  | "tick"
  | "nextId"
  | "seed"
  | "nest"
  | "genetics"
  | "ants"
  | "brood"
  | "range"
  | "colonyId"
>;
export function createAgent(
  world: FactoryWorld,
  kind: string,
  x: number,
  z: number,
  suppliedGenome?: Genome,
): ColonyAgent {
  const id = world.nextId++;
  const ant: ColonyAgent & {
    thresholds: NonNullable<ColonyAgent["thresholds"]>;
  } = {
    id,
    kind,
    colonyId: world.colonyId || 1,
    x,
    y: surfaceHeight(world.nest?.relief, x, z) + 0.008,
    z,
    distanceWalked: 0,
    angle: world.range(0, Math.PI * 2),
    energy: 100,
    age: 0,
    carrying: 0,
    speed: world.range(0.07, 0.105),
    state: kind === "queen" ? "Fundando o ninho" : "Explorando",
    rest: 0,
    route: [],
    node: null,
    ...individualTraits(world.seed, id, kind),
  };
  const reference = workerReference(world, ant);
  if (reference) applyReferenceWorker(reference, world.seed, ant);
  if (world.genetics) {
    ant.genome = genomeForAgent(world, id, kind, suppliedGenome);
    expressGenome(ant, ant.genome);
  }
  if (reference) ant.bodyScale = clampWorkerScale(reference, ant.bodyScale);
  ant.bodyScale = referenceFounderScale(world, ant) ?? ant.bodyScale;
  initializeLife(world, ant);
  return ant;
}
