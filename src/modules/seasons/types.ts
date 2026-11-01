export type SeasonPhase = "active" | "preparing" | "dormant" | "resuming";
export interface SeasonState {
  version: 1;
  phase: SeasonPhase;
  since: number;
  activeTicks: number;
  coldCue: number;
  chillTicks: number;
  warmTicks: number;
  cycles: number;
  lastTemperature: number;
  lastPhotoperiod: number;
}
export const SEASON_PARAMETERS = Object.freeze({
  activeDays: 40,
  preparationDays: 2,
  coldCueDays: 2,
  chillDays: 5,
  minimumDormantDays: 5,
  warmCueDays: 1,
  resumeDays: 2,
  coldMinimum: 5,
  coldMaximum: 12,
  warmMinimum: 18,
  shortDayHours: 10,
  dormantActivity: 0.2,
  larvalMaintenance: 0.1,
});
