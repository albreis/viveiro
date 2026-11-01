import { World } from "../simulation/world.js";
import { hashSeed } from "../simulation/seed.ts";
import { allAnts } from "../colonies/types.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import type { ForecastSnapshot } from "./types.ts";
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
export { summarizeForecast } from "./statistics.ts";
