import type { NestState } from "../navigation/types.ts";
import { sampleSoil } from "./field.ts";

export interface MeshGrid {
  nx: number;
  ny: number;
  nz: number;
  sx: number;
  sy: number;
  sz: number;
  minX: number;
  minY: number;
  minZ: number;
  values: Float32Array;
  normals: Float32Array;
}

export function buildMeshGrid(nest: NestState): MeshGrid {
  const nx = 96,
    ny = 34,
    nz = 64;
  const count = (nx + 1) * (ny + 1) * (nz + 1);
  const grid: MeshGrid = {
    nx,
    ny,
    nz,
    sx: 20.8 / nx,
    sy: 4.8 / ny,
    sz: 13.8 / nz,
    minX: -10.4,
    minY: -4.5,
    minZ: -6.9,
    values: new Float32Array(count),
    normals: new Float32Array(count * 3),
  };
  let i = 0;
  for (let y = 0; y <= ny; y++)
    for (let z = 0; z <= nz; z++)
      for (let x = 0; x <= nx; x++) {
        const field = sampleSoil(nest, {
          x: grid.minX + x * grid.sx,
          y: grid.minY + y * grid.sy,
          z: grid.minZ + z * grid.sz,
        });
        grid.values[i] = field.distance;
        grid.normals[i * 3] = field.x;
        grid.normals[i * 3 + 1] = field.y;
        grid.normals[i * 3 + 2] = field.z;
        i++;
      }
  return grid;
}
