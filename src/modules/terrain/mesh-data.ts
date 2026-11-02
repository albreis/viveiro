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
  innerCount: number;
}
export function soilMeshData(
  nest: NestState,
  detail: "full" | "light" = "full",
): SoilMeshData {
  // Analytic plugs are rendered separately as the same annular solid used by collision.
  if (nest.plugs?.length) nest = { ...nest, plugs: [] };
  // Moving aggregates are rendered as instances; their collision still uses the same spherical field.
  if (nest.rubble?.some((p) => p.mobile))
    nest = { ...nest, rubble: nest.rubble.filter((p) => !p.mobile) };
  const { walls, top, inner } = polygonize(buildMeshGrid(nest, detail), (v) =>
    projectSoilVertex(nest, v),
  );
  return {
    positions: new Float32Array([
      ...walls.positions,
      ...top.positions,
      ...inner.positions,
    ]),
    normals: new Float32Array([
      ...walls.normals,
      ...top.normals,
      ...inner.normals,
    ]),
    uvs: new Float32Array([...walls.uvs, ...top.uvs, ...inner.uvs]),
    colors: new Float32Array([...walls.colors, ...top.colors, ...inner.colors]),
    wallCount: walls.positions.length / 3,
    topCount: top.positions.length / 3,
    innerCount: inner.positions.length / 3,
  };
}
