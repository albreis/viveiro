import { seededRandom } from "../../libs/seeded-random.ts";
export const GENES = [
  "locomotion",
  "size",
  "antennae",
  "mandibles",
  "efficiency",
  "activity",
  "courage",
  "exploration",
  "care",
  "cleaning",
  "digging",
] as const;
export type Gene = (typeof GENES)[number];
export interface Mutation {
  locus: Gene;
  copy: number;
  before: number;
  after: number;
}
export interface Genome {
  ploidy: 1 | 2;
  haplotypes: number[][];
  generation: number;
  motherId?: number;
  fatherId?: number;
  origin: "founder" | "inherited" | "legacy-inferred";
  mutations: Mutation[];
}
export function founderGenome(seed: string, id: number, kind: string): Genome {
  const { range } = seededRandom(seed + ":founder:" + id + ":" + kind),
    ploidy = kind === "male" ? 1 : 2;
  return {
    ploidy,
    haplotypes: Array.from({ length: ploidy }, () =>
      GENES.map(() => range(0.2, 0.8)),
    ),
    generation: 0,
    origin: "founder",
    mutations: [],
  };
}
export function geneValue(genome: Genome, gene: Gene) {
  const i = GENES.indexOf(gene);
  return (
    genome.haplotypes.reduce(
      (n, copy) => n + (Number.isFinite(copy[i]) ? copy[i] : 0.5),
      0,
    ) / genome.ploidy
  );
}
/** Haplodiploid toy genome: maternal recombination, paternal haploid copy, bounded mutation. */
export function offspringGenome(
  mother: Genome,
  father: Genome | undefined,
  seed: string,
  parents: { motherId?: number; fatherId?: number },
  options: { mutationRate?: number; mutationSize?: number } = {},
): Genome {
  const { random, range } = seededRandom(seed),
    mutations: Mutation[] = [];
  let phase = Math.floor(random() * mother.ploidy);
  const maternal = GENES.map((_, i) => {
    if (i && random() < 0.18) phase = (phase + 1) % mother.ploidy;
    return mother.haplotypes[phase][i];
  });
  const haplotypes = father
    ? [maternal, [...father.haplotypes[0]]]
    : [maternal];
  haplotypes.forEach((copy, index) =>
    copy.forEach((before, i) => {
      if (random() < (options.mutationRate ?? 0.015)) {
        const change = range(
          -(options.mutationSize ?? 0.05),
          options.mutationSize ?? 0.05,
        );
        const after = Math.max(0, Math.min(1, before + change));
        copy[i] = after;
        if (after !== before)
          mutations.push({ locus: GENES[i], copy: index, before, after });
      }
    }),
  );
  return {
    ploidy: father ? 2 : 1,
    haplotypes,
    generation: mother.generation + 1,
    ...parents,
    fatherId: father ? parents.fatherId : undefined,
    origin: "inherited",
    mutations,
  };
}
