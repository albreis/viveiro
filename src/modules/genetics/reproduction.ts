import { founderGenome, offspringGenome, type Genome } from "./genome.ts";
import type { ColonyAgent, Brood } from "../colony/types.ts";
export interface GeneticsState {
  version: number;
  queen: { id?: number; genome: Genome };
  sire: { id?: number; genome: Genome };
  embryos: number;
  mutationEvents: number;
}
interface GeneticWorld {
  seed: string;
  genetics?: GeneticsState;
  ants: ColonyAgent[];
  brood: Brood[];
}
export function createGenetics(seed: string): GeneticsState {
  return {
    version: 1,
    queen: { id: 1, genome: founderGenome(seed, 1, "queen") },
    sire: { id: 2, genome: founderGenome(seed, 2, "male") },
    embryos: 0,
    mutationEvents: 0,
  };
}
export function inheritGenome(world: GeneticWorld, id: number, male = false) {
  const state = world.genetics!;
  const mother = world.ants.find((a) => a.id === state.queen.id);
  return offspringGenome(
    mother?.genome ?? state.queen.genome,
    male ? undefined : state.sire.genome,
    world.seed + ":embryo:" + id,
    { motherId: state.queen.id, fatherId: state.sire.id },
  );
}
export function genomeForAgent(
  world: GeneticWorld,
  id: number,
  kind: string,
  supplied?: Genome,
) {
  if (supplied) return supplied;
  if (kind === "queen") return world.genetics!.queen.genome;
  if (kind === "male") return world.genetics!.sire.genome;
  return inheritGenome(world, id);
}
export function migrateGenetics(world: GeneticWorld) {
  if (world.genetics) return;
  const queen = world.ants.find((a) => a.kind === "queen"),
    male = world.ants.find((a) => a.kind === "male");
  const infer = (id: number, kind: string): Genome => ({
    ...founderGenome(world.seed + ":legacy", id, kind),
    origin: "legacy-inferred",
  });
  world.genetics = {
    version: 1,
    queen: { id: queen?.id, genome: infer(queen?.id ?? 0, "queen") },
    sire: { id: male?.id, genome: infer(male?.id ?? 0, "male") },
    embryos: 0,
    mutationEvents: 0,
  };
  for (const ant of world.ants)
    ant.genome =
      ant.kind === "queen"
        ? world.genetics.queen.genome
        : ant.kind === "male"
          ? world.genetics.sire.genome
          : infer(ant.id, ant.kind || "worker");
  for (const brood of world.brood)
    brood.genome = {
      ...inheritGenome(world, brood.id),
      origin: "legacy-inferred",
      motherId: undefined,
      fatherId: undefined,
    };
  // Existing bodies, speeds and personality stay intact; no historical parentage is invented.
}
