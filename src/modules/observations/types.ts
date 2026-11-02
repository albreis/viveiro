export const DAILY_LIMIT = 12000;
export const DAILY_TICKS = 100;
export interface DailyPoint {
  tick: number;
  modelVersion: string;
  population: number;
  brood: number;
  eggs: number;
  larvae: number;
  pupae: number;
  colonies: number;
  food: number;
  airTemperatureC: number | null;
  soilTemperatureC: number | null;
  oxygenPercent: number | null;
  carbonDioxidePercent: number | null;
}
export interface DailySeries {
  version: 1;
  startedTick: number;
  discarded: number;
  points: DailyPoint[];
}
export interface ObservationWorld {
  tick: number;
  seed: string;
  ants: unknown[];
  brood: { age: number }[];
  food: number;
  colony: { reproductiveFood?: number };
  params: { temperatureC?: number };
  microclimate?: { temperature: number[] };
  gases?: { cells: { volume: number; oxygen: number; carbon: number }[] };
  colonies?: ObservationWorld[];
  dailyObservations?: DailySeries;
}
