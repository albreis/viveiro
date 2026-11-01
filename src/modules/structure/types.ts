import type { Vec3 } from "../navigation/types.ts";
export interface RoofGeometry {
  key: string;
  edge: number;
  center: Vec3;
  roof: Vec3;
  span: number;
  thickness: number;
  depth: number;
  abutment: number;
}
export interface RoofPatch extends RoofGeometry {
  water: number;
  load: number;
  capacity: number;
  safety: number;
  damage: number;
}
export interface StructureState {
  version: 1;
  revision: number;
  steps: number;
  patches: RoofPatch[];
  failures: number;
  lastFailure: number[];
  released: number;
}
