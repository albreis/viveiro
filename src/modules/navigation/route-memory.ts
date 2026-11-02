import { modelMath } from "../../libs/model-math.ts";
import type { AgentState, NavigationWorld } from "./types.ts";
export type LearnedEdge = [number, number, number];
export function knownRoute(
  edges: readonly LearnedEdge[],
  start: number,
  goal: number,
  blocked: [number, number] | null = null,
): number[] {
  const open = [{ node: start, path: [] as number[], cost: 0 }],
    costs = new Map([[start, 0]]);
  while (open.length) {
    open.sort((a, b) => a.cost - b.cost);
    const current = open.shift()!;
    if (current.node === goal) return current.path;
    for (const [a, b, cost] of edges) {
      if (
        blocked &&
        ((a === blocked[0] && b === blocked[1]) ||
          (b === blocked[0] && a === blocked[1]))
      )
        continue;
      const next = a === current.node ? b : b === current.node ? a : -1;
      if (next < 0) continue;
      const total = current.cost + cost;
      if (total >= (costs.get(next) ?? Infinity)) continue;
      costs.set(next, total);
      open.push({ node: next, path: [...current.path, next], cost: total });
    }
  }
  return [];
}
export function rememberSegment(
  world: NavigationWorld,
  ant: AgentState,
  from: number,
  to: number,
) {
  if (
    from === to ||
    !world.nest.links.some(
      ([a, b]) => (a === from && b === to) || (a === to && b === from),
    )
  )
    return;
  const a = world.nest.nodes[from],
    b = world.nest.nodes[to];
  const walked =
    (ant.distanceWalked || 0) -
    (ant.lastNodeDistance ?? ant.distanceWalked ?? 0);
  const cost = Math.max(
    0.05,
    walked || modelMath.hypot(a.x - b.x, a.y - b.y, a.z - b.z),
  );
  ant.knownEdges ??= [];
  const old = ant.knownEdges.find(
    ([a, b]) => (a === from && b === to) || (a === to && b === from),
  );
  if (old) old[2] = old[2] * 0.7 + cost * 0.3;
  else {
    ant.knownEdges.push([from, to, cost]);
    if (ant.knownEdges.length > 64) ant.knownEdges.shift();
  }
  ant.recentNodes = [...(ant.recentNodes || []), from].slice(-8);
  ant.lastNodeDistance = ant.distanceWalked || 0;
}
