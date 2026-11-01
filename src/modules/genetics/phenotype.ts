import type { Genome } from "./genome.ts";
import { geneValue } from "./genome.ts";
interface Phenotype {
  speed: number;
  bodyScale: number;
  headScale: number;
  traits: { activity: number; courage: number; exploration: number };
  thresholds: Record<string, number>;
  pheromoneGain?: number;
  metabolicCost?: number;
  digPower?: number;
}
/** Small bounded effects keep physiology distinct from caste and environmental plasticity. */
export function expressGenome(ant: Phenotype, genome: Genome) {
  ant.speed *= 0.94 + geneValue(genome, "locomotion") * 0.12;
  ant.bodyScale *= 0.96 + geneValue(genome, "size") * 0.08;
  ant.headScale *= 0.94 + geneValue(genome, "mandibles") * 0.12;
  for (const key of ["activity", "courage", "exploration"] as const)
    ant.traits[key] = ant.traits[key] * 0.8 + geneValue(genome, key) * 0.2;
  for (const [task, locus] of [
    ["nurse", "care"],
    ["cleaner", "cleaning"],
    ["excavator", "digging"],
  ] as const)
    ant.thresholds[task] *= 1.1 - geneValue(genome, locus) * 0.2;
  ant.pheromoneGain = 0.8 + geneValue(genome, "antennae") * 0.4;
  ant.metabolicCost = 1.1 - geneValue(genome, "efficiency") * 0.2;
  ant.digPower = 0.9 + geneValue(genome, "mandibles") * 0.2;
}
