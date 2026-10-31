import * as THREE from "three";
import { buildMeshGrid } from "./mesh-grid.ts";
import { polygonize } from "./polygonize.ts";
import { projectSoilVertex } from "./field.ts";

export function createSoilGeometry(nest) {
  const { walls, top } = polygonize(buildMeshGrid(nest), (v) =>
    projectSoilVertex(nest, v),
  );
  const geometry = new THREE.BufferGeometry();
  for (const [name, key, size] of [
    ["position", "positions", 3],
    ["normal", "normals", 3],
    ["uv", "uvs", 2],
    ["color", "colors", 3],
  ]) {
    geometry.setAttribute(
      name,
      new THREE.Float32BufferAttribute([...walls[key], ...top[key]], size),
    );
  }
  const wallCount = walls.positions.length / 3;
  geometry.addGroup(0, wallCount, 0);
  geometry.addGroup(wallCount, top.positions.length / 3, 1);
  geometry.computeBoundingSphere();
  return geometry;
}
