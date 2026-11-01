import type { NestState } from "../navigation/types.ts";
import { buildMeshGrid } from "./mesh-grid.ts";
import { polygonize } from "./polygonize.ts";
import { projectSoilVertex } from "./field.ts";

export interface SoilMeshData {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  colors: Float32Array;
  wallCount: number;
  topCount: number;
}
export function soilMeshData(nest: NestState): SoilMeshData {
  const { walls, top } = polygonize(buildMeshGrid(nest), (v) =>
    projectSoilVertex(nest, v),
  );
  return {
    positions: new Float32Array([...walls.positions, ...top.positions]),
    normals: new Float32Array([...walls.normals, ...top.normals]),
    uvs: new Float32Array([...walls.uvs, ...top.uvs]),
    colors: new Float32Array([...walls.colors, ...top.colors]),
    wallCount: walls.positions.length / 3,
    topCount: top.positions.length / 3,
  };
}
