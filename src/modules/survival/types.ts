export const DEATH_CAUSES = [
  "age",
  "disease",
  "starvation",
  "combat",
  "predation",
  "reproduction",
  "unknown",
] as const;
export type DeathCause = (typeof DEATH_CAUSES)[number];
export interface LifeState {
  version: 1;
  lastTick: number;
  lastAge: number;
  ageHazard: number;
  ageBudget: number;
  infection: number;
  diseaseHazard: number;
  diseaseBudget: number;
  repairFood: number;
  deathRecorded?: boolean;
}
export interface SurvivalStats {
  version: 1;
  initialDeaths: number;
  causes: Record<DeathCause, number>;
  challenges: number;
}
export const SURVIVAL_PARAMETERS = Object.freeze({
  queenScaleDays: 2000,
  workerScaleDays: 120,
  maleScaleDays: 30,
  ageShape: 2,
  wasteExposurePerDay: 0.08,
  contactExposurePerDay: 0.3,
  clearancePerDay: 0.08,
  diseaseHazardPerDay: 0.3,
  woundHazardMultiplier: 1,
  repairHpPerDay: 2,
  repairFoodPerHp: 0.005,
  challengeDose: 0.5,
});
