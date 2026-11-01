import type { GranularBody } from "./types.ts";
import { grainRadius } from "./types.ts";
/** A spatial cell broad phase; each candidate pair is emitted once. */
export function grainPairs(
  bodies: GranularBody[],
): [GranularBody, GranularBody][] {
  const size = Math.max(0.12, ...bodies.map((g) => grainRadius(g) * 2.1)),
    cells = new Map<string, number[]>(),
    pairs: [GranularBody, GranularBody][] = [];
  const key = (x: number, y: number, z: number) => x + ":" + y + ":" + z;
  bodies.forEach((g, i) => {
    const x = Math.floor(g.x / size),
      y = Math.floor(g.y / size),
      z = Math.floor(g.z / size);
    for (let dz = -1; dz <= 1; dz++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++)
          for (const j of cells.get(key(x + dx, y + dy, z + dz)) || [])
            pairs.push([bodies[j], g]);
    const k = key(x, y, z);
    if (!cells.has(k)) cells.set(k, []);
    cells.get(k)!.push(i);
  });
  return pairs;
}
