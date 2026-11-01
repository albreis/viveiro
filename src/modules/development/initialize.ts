import type { Brood, ColonyWorld } from "../colony/types.ts";
import { thermalDevelopment, broodEnvironment } from "./sensing.ts";
import { hashSeed } from "../simulation/seed.ts";
import { geneValue } from "../genetics/genome.ts";
export function initializeBroodDevelopment(w: ColonyWorld, b: Brood): void {
  if (!thermalDevelopment(w)) return;
  const { temperature, water } = broodEnvironment(w, b),
    individual = hashSeed(w.seed + ":development:" + b.id) / 4294967296;
  const genetic = b.genome ? geneValue(b.genome, "efficiency") : 0.5;
  b.development = {
    version: 1,
    growthFactor: (0.9 + 0.2 * individual) * (0.95 + 0.1 * genetic),
    stress: 0,
    lastTemperature: temperature,
    lastSoilWater: water,
    lastRate: 0,
  };
}
