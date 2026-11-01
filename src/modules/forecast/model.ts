import { World } from "../simulation/world.js";
import { hashSeed } from "../simulation/seed.ts";
import { allAnts } from "../colonies/types.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import type { ForecastSnapshot, ForecastResult } from "./types.ts";
export interface ForecastWorld {
  step(): void;
  population(): number;
}
export function createForecastWorld(
  snapshot: ForecastSnapshot,
  run: number,
): ForecastWorld {
  const w = World.restore(snapshot);
  w.rng = hashSeed(snapshot.seed + ":forecast:" + snapshot.tick + ":" + run);
  w.params.humidity = Math.max(
    0,
    Math.min(100, w.params.humidity + w.range(-3, 3)),
  );
  w.params.light = Math.max(0, Math.min(100, w.params.light + w.range(-3, 3)));
  return {
    step: () => w.step(),
    population: () => allAnts(w as FamilyWorld).length,
  };
}
export function summarizeForecast(
  values: number[],
  days: number,
  tick: number,
): ForecastResult | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b),
    runs = sorted.length;
  return {
    low: sorted[Math.floor((runs - 1) * 0.1)],
    high: sorted[Math.ceil((runs - 1) * 0.9)],
    median: sorted[Math.floor(runs / 2)],
    runs,
    days,
    tick,
    values: sorted,
  };
}
