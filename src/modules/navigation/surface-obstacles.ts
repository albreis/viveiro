import type { Landscape } from "../landscape/types.ts";
import { timberLevel, waterLevel } from "../landscape/queries.ts";
export const logLevel = (x: number, z: number, land?: Landscape) =>
  timberLevel(land, x, z);
export const hitsLog = (x: number, z: number, land?: Landscape) =>
  logLevel(x, z, land) < 1;
export const pondLevel = (x: number, z: number, land?: Landscape) =>
  waterLevel(land, x, z);
export function blocksObstacle(next: number, current: number) {
  return next < 1 && (current >= 1 || next <= current + 0.00001);
}
