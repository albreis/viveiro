import type { Vec3 } from "../navigation/types.ts";
export interface GranularBody extends Vec3 {
  id: number;
  mass: number;
  edge?: number;
  mobile?: boolean;
  velocity?: Vec3;
  quiet?: number;
}
export interface GranularState {
  version: 1;
  friction: number;
  gravity: number;
  steps: number;
  moving: number;
  kinetic: number;
  contacts: number;
  terrainRevision: number;
}
export const createGranularState = (): GranularState => ({
  version: 1,
  friction: 0.72,
  gravity: 0.0016,
  steps: 0,
  moving: 0,
  kinetic: 0,
  contacts: 0,
  terrainRevision: -1,
});
export const grainRadius = (g: GranularBody) =>
  Math.cbrt((Math.max(0, g.mass) * 3) / (4 * Math.PI));
