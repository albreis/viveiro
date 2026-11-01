import type { Landscape, Plant } from "../landscape/types.ts";
import type { NestState } from "../navigation/types.ts";
export interface SoilClimate {
  version: 1;
  width: number;
  layers: number;
  rows: number;
  depth: number;
  capacity: number;
  surface: number[];
  water: number[];
  temperature: number[];
  initialWater: number;
  rainIn: number;
  pondIn: number;
  evaporated: number;
  plantUptake: number;
  initialHeat: number;
  boundaryHeat: number;
  evaporativeHeat: number;
  steps: number;
}
export interface ClimateWorld {
  seed: string;
  tick: number;
  params: {
    humidity: number;
    light: number;
    temperatureC?: number;
    soilWaterInitial?: number;
  };
  nest: NestState;
  landscape: Landscape;
  plants: Plant[];
  microclimate?: SoilClimate;
}
