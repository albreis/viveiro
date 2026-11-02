import type { Vec3 } from "../navigation/types.ts";
export interface ClimateReading {
  water: number;
  temperature: number;
}
export interface ChamberSample extends ClimateReading {
  point: Vec3;
  quality: number;
}
export interface SiteSurvey {
  version: 1;
  mode: "explore" | "return" | "done";
  steps: number;
  since: number;
  heading: number;
  samples: number;
  origin: Vec3;
  best: ChamberSample;
  last: ClimateReading;
}
export interface RoomMemory {
  version: 1;
  rooms: { node: number; tick: number; reading: ClimateReading }[];
}
export const CHAMBER_PARAMETERS = Object.freeze({
  sensorRadius: 0.22,
  probeDepth: 0.12,
  exploreTicks: 160,
  returnLimit: 240,
  roamRadius: 1.8,
  extraCost: 0.0003,
  broodWater: 0.65,
  queenWater: 0.55,
  temperature: 25,
  memoryTicks: 400,
  memoryLimit: 8,
});
