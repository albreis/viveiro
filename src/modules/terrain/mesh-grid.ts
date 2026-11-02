import type { NestState } from "../navigation/types.ts";
import { sampleSoil } from "./field.ts";
import { meshAxes } from "./mesh-axes.ts";
export interface MeshGrid {
  nx: number;
  ny: number;
  nz: number;
  x: number[];
  y: number[];
  z: number[];
  values: Float32Array;
  normals: Float32Array;
}
export function buildMeshGrid(nest: NestState): MeshGrid {
  const axes = meshAxes(nest),
    nx = axes.x.length - 1,
    ny = axes.y.length - 1,
    nz = axes.z.length - 1,
    count = (nx + 1) * (ny + 1) * (nz + 1);
  const grid: MeshGrid = {
    nx,
    ny,
    nz,
    ...axes,
    values: new Float32Array(count),
    normals: new Float32Array(count * 3),
  };
  let i = 0;
  for (const y of axes.y)
    for (const z of axes.z)
      for (const x of axes.x) {
        const f = sampleSoil(nest, { x, y, z });
        grid.values[i] = f.distance;
        grid.normals[i * 3] = f.x;
        grid.normals[i * 3 + 1] = f.y;
        grid.normals[i * 3 + 2] = f.z;
        i++;
      }
  return grid;
}
