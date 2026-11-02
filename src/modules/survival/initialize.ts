import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { hashSeed } from "../simulation/seed.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { DEATH_CAUSES } from "./types.ts";
import { ageHazard } from "./curves.ts";
interface Context {
  seed: string;
  biologicalProfile?: unknown;
  tick?: number;
}
export function survivalEnabled(w: { biologicalProfile?: unknown }) {
  return (
    resolveBiologicalProfile(w.biologicalProfile).survivalModel === "risk-demo"
  );
}
export function initializeLife(w: Context, a: ColonyAgent): void {
  if (!survivalEnabled(w) || a.life) return;
  const budget = (key: string) =>
    -Math.log1p(
      -(hashSeed(w.seed + ":" + a.id + ":survival:" + key) + 0.5) / 4294967296,
    );
  a.health ??= 100;
  a.life = {
    version: 1,
    lastTick: w.tick ?? 0,
    lastAge: a.age,
    ageHazard: ageHazard(a.age, a.kind),
    ageBudget: budget("age"),
    infection: 0,
    diseaseHazard: 0,
    diseaseBudget: budget("disease"),
    repairFood: 0,
  };
}
export function initializeSurvival(w: ColonyWorld & { deaths: number }): void {
  if (!survivalEnabled(w)) return;
  w.colony.survival ??= {
    version: 1,
    initialDeaths: w.deaths,
    causes: Object.fromEntries(DEATH_CAUSES.map((k) => [k, 0])) as Record<
      (typeof DEATH_CAUSES)[number],
      number
    >,
    challenges: 0,
  };
  for (const a of w.ants) initializeLife(w, a);
}
