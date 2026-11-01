import type { SoilClimate } from "./types.ts";
import type { Vec3 } from "../navigation/types.ts";
export const cellIndex = (s: SoilClimate, x: number, y: number, z: number) =>
  (y * s.rows + z) * s.width + x;
export function climateCell(s: SoilClimate, p: Vec3) {
  const x = Math.max(
      0,
      Math.min(s.width - 1, Math.floor(((p.x + 10) / 20) * s.width)),
    ),
    z = Math.max(
      0,
      Math.min(s.rows - 1, Math.floor(((p.z + 6.5) / 13) * s.rows)),
    ),
    depth = s.surface[z * s.width + x] - p.y,
    y = Math.max(
      0,
      Math.min(s.layers - 1, Math.floor((depth / s.depth) * s.layers)),
    );
  return cellIndex(s, x, y, z);
}
export function sampleClimate(s: SoilClimate | undefined, p: Vec3) {
  if (!s) return null;
  const i = climateCell(s, p);
  return {
    cell: i,
    water: s.water[i] / s.capacity,
    temperature: s.temperature[i],
  };
}
export function cellHeight(s: SoilClimate, i: number) {
  const layer = Math.floor(i / (s.width * s.rows)),
    column = i % (s.width * s.rows);
  return s.surface[column] - ((layer + 0.5) * s.depth) / s.layers;
}
const cache = new WeakMap<SoilClimate, [number, number, number][]>();
export function climatePairs(s: SoilClimate) {
  let pairs = cache.get(s);
  if (pairs) return pairs;
  pairs = [];
  for (let y = 0; y < s.layers; y++)
    for (let z = 0; z < s.rows; z++)
      for (let x = 0; x < s.width; x++) {
        const a = cellIndex(s, x, y, z);
        if (x + 1 < s.width)
          pairs.push([a, cellIndex(s, x + 1, y, z), 20 / s.width]);
        if (z + 1 < s.rows)
          pairs.push([a, cellIndex(s, x, y, z + 1), 13 / s.rows]);
        if (y + 1 < s.layers)
          pairs.push([a, cellIndex(s, x, y + 1, z), s.depth / s.layers]);
      }
  cache.set(s, pairs);
  return pairs;
}
