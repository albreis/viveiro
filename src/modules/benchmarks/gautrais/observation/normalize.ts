import type { ObservedGraph, GraphNode, GraphEdge } from "../types.ts";
import { graphTopology } from "../topology.ts";

/** Suppress degree-2 subdivision vertices equally in observed and model graphs.
 * Pure cycles/self-returning chains use two parallel edges, never a self-loop.
 */
export function suppressSubdivisions(input: ObservedGraph): ObservedGraph {
  const before = graphTopology(input),
    byId = new Map(input.nodes.map((n) => [n.id, n]));
  const incident = new Map(input.nodes.map((n) => [n.id, [] as number[]]));
  input.edges.forEach((edge, i) => {
    incident.get(edge.from)!.push(i);
    incident.get(edge.to)!.push(i);
  });
  const nodes: GraphNode[] = [],
    edges: GraphEdge[] = [],
    mapped = new Map<number, number>(),
    seen = new Set<number>();
  const add = (id: number) => {
    if (!mapped.has(id)) {
      mapped.set(id, nodes.length);
      nodes.push({ ...byId.get(id)!, id: nodes.length });
    }
    return mapped.get(id)!;
  };
  for (const n of input.nodes) if (incident.get(n.id)!.length !== 2) add(n.id);
  const trace = (start: number, edgeIndex: number) => {
    if (seen.has(edgeIndex)) return;
    let at = start,
      current = edgeIndex,
      width = Infinity;
    const chain: number[] = [start];
    while (true) {
      if (seen.has(current)) throw Error("Inconsistent graph chain");
      seen.add(current);
      const edge = input.edges[current];
      width = Math.min(width, edge.width);
      at = edge.from === at ? edge.to : edge.from;
      chain.push(at);
      if (mapped.has(at)) break;
      const ids = incident.get(at)!;
      if (ids.length !== 2) throw Error("Missing branch vertex");
      current = ids[0] === current ? ids[1] : ids[0];
    }
    const from = add(start),
      to = add(at);
    if (from !== to) edges.push({ from, to, width });
    else {
      const mid = chain[Math.floor((chain.length - 1) / 2)];
      const other = nodes.length;
      nodes.push({ ...byId.get(mid)!, id: other });
      edges.push({ from, to: other, width }, { from: other, to: from, width });
    }
  };
  // Snapshot keys: trace may add the representative of an all-degree-2 cycle.
  for (const id of [...mapped.keys()])
    for (const edge of incident.get(id)!) trace(id, edge);
  input.edges.forEach((edge, i) => {
    if (!seen.has(i)) {
      add(edge.from);
      trace(edge.from, i);
    }
  });
  const result = { nodes, edges },
    after = graphTopology(result);
  if (
    before.components !== after.components ||
    before.cycleRank !== after.cycleRank
  )
    throw Error("Graph normalization changed topology");
  return result;
}
