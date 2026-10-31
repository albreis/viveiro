import type { NestState } from "../navigation/types.ts";
export { generateNest as createNest } from "./nest-generator.ts";

export function nestPath(
  nest: NestState,
  start: number,
  end: number | undefined,
  blocked: [number, number] | null = null,
): number[] {
  const queue = [[start]],
    visited = new Set([start]);
  while (queue.length) {
    const path = queue.shift()!,
      node = path.at(-1)!;
    if (node === end) return path.slice(1);
    for (const edge of nest.links) {
      if (
        blocked &&
        ((edge[0] === blocked[0] && edge[1] === blocked[1]) ||
          (edge[0] === blocked[1] && edge[1] === blocked[0]))
      )
        continue;
      const next =
        edge[0] === node ? edge[1] : edge[1] === node ? edge[0] : null;
      if (next !== null && !visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return [];
}
