import type { ClimateWorld, SoilClimate } from "./types.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { seededRandom } from "../../libs/seeded-random.ts";
export function ensureSoilClimate(w: ClimateWorld): SoilClimate {
  if (w.microclimate) return w.microclimate;
  const width = 20,
    layers = 8,
    rows = 13,
    depth = 4.2,
    capacity = (((((20 / width) * 13) / rows) * depth) / layers) * 0.4,
    surface: number[] = [],
    water: number[] = [],
    temperature: number[] = [],
    { random } = seededRandom(w.seed + ":soil-climate");
  const initial =
    w.params.soilWaterInitial ??
    { woodland: 55, meadow: 43, scrub: 23 }[w.landscape.biome];
  for (let z = 0; z < rows; z++)
    for (let x = 0; x < width; x++)
      surface.push(
        surfaceHeight(
          w.nest.relief,
          ((x + 0.5) / width) * 20 - 10,
          ((z + 0.5) / rows) * 13 - 6.5,
        ),
      );
  for (let y = 0; y < layers; y++)
    for (let z = 0; z < rows; z++)
      for (let x = 0; x < width; x++) {
        water.push(
          Math.max(
            0,
            Math.min(
              1,
              initial / 100 + (y / layers) * 0.08 + (random() - 0.5) * 0.025,
            ),
          ) * capacity,
        );
        temperature.push((w.params.temperatureC ?? 24) - (y / layers) * 2);
      }
  return (w.microclimate = {
    version: 1,
    width,
    layers,
    rows,
    depth,
    capacity,
    surface,
    water,
    temperature,
    initialWater: water.reduce((a, b) => a + b, 0),
    rainIn: 0,
    pondIn: 0,
    evaporated: 0,
    plantUptake: 0,
    initialHeat: temperature.reduce((a, b) => a + b, 0),
    boundaryHeat: 0,
    evaporativeHeat: 0,
    steps: 0,
  });
}
