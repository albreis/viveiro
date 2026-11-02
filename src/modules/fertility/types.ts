import type { Genome } from "../genetics/genome.ts";
export interface SpermPool {
  maleId: number;
  genome: Genome;
  tick: number;
  origin: "contact" | "scenario";
  received: number;
  viable: number;
  used: number;
  lost: number;
}
export interface FertilityState {
  version: 1;
  lastTick: number;
  pools: SpermPool[];
  femaleAttempts: number;
  fertilized: number;
  failed: number;
  intentionalMales: number;
}
export interface Fertilization {
  version: 1;
  requested: "worker" | "gyne" | "male";
  tick: number;
  sireId?: number;
}
export const FERTILITY_PARAMETERS = Object.freeze({
  creditsPerMating: 80,
  usePerFemale: 1,
  decayPerDay: 0.0005,
  maxMates: 8,
});
