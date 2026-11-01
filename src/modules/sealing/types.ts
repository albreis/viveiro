import type { Vec3 } from "../navigation/types.ts";
export interface EntrancePlug extends Vec3 {
  version: 1;
  id: number;
  owner: number;
  edge: number;
  axis: Vec3;
  radius: number;
  depth: number;
  capacity: number;
  mass: number;
  innerRadius: number;
  // Air volume in concentric shells, sampled before construction.
  shells: number[];
}
export interface SealTask {
  version: 1;
  plugId: number;
  phase:
    "collect" | "return" | "build" | "closed" | "remove" | "haul" | "opened";
  queenPoint: Vec3;
  workerPoint: Vec3;
  workerId?: number;
  closedTick?: number;
  openedTick?: number;
  trips: number;
}
export const SEAL_PARAMETERS = Object.freeze({
  depth: 0.24,
  bite: 0.004,
  maxLoad: 0.3,
  diffusionPorosity: 0.08,
  flowPorosity: 0.002,
});
