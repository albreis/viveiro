export interface BroodDevelopment {
  version: 1;
  growthFactor: number;
  stress: number;
  lastTemperature: number;
  lastSoilWater: number;
  lastRate: number;
}
export const DEVELOPMENT_PARAMETERS = Object.freeze({
  waterDry: 0.12,
  waterComfortDry: 0.37,
  waterComfortWet: 0.8,
  waterWet: 0.98,
  minimum: 10,
  optimum: 25,
  maximum: 38,
  eggDays: 0.5,
  larvaDays: 0.8,
  pupaDays: 0.6,
  stressPerTick: 0.003,
  recoveryPerTick: 0.0005,
});

export const COCOON_COST = 0.02;
