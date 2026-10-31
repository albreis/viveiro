import * as THREE from "three";
import { soilMeshData } from "./mesh-data.ts";

export function geometryFromSoilData(data) {
  const geometry = new THREE.BufferGeometry();
  for (const [name, key, size] of [
    ["position", "positions", 3],
    ["normal", "normals", 3],
    ["uv", "uvs", 2],
    ["color", "colors", 3],
  ])
    geometry.setAttribute(name, new THREE.BufferAttribute(data[key], size));
  geometry.addGroup(0, data.wallCount, 0);
  geometry.addGroup(data.wallCount, data.topCount, 1);
  geometry.addGroup(data.wallCount + data.topCount, data.innerCount, 2);
  geometry.computeBoundingSphere();
  return geometry;
}
export function createSoilGeometry(nest) {
  return geometryFromSoilData(soilMeshData(nest));
}
