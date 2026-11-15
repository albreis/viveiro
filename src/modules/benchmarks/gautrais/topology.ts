import type { ObservedGraph } from "./types.ts";

/** Undirected multigraph measures; no connectedness or planarity assumption. */
export function graphTopology(graph: ObservedGraph) {
  const parents = new Map<number, number>(),
    degrees = new Map<number, number>();
  for (const node of graph.nodes) {
    if (!Number.isSafeInteger(node.id) || node.id < 0 || parents.has(node.id))
      throw Error("Identificador de nó inválido ou duplicado.");
    parents.set(node.id, node.id);
    degrees.set(node.id, 0);
  }
  const root = (id: number): number => {
    let current = id;
    while (parents.get(current) !== current) {
      parents.set(current, parents.get(parents.get(current)!)!);
      current = parents.get(current)!;
    }
    return current;
  };
  let components = graph.nodes.length;
  const pairs = new Set<string>();
  for (const { from, to } of graph.edges) {
    if (from === to || !parents.has(from) || !parents.has(to))
      throw Error("O túnel deve ligar dois nós existentes e distintos.");
    degrees.set(from, degrees.get(from)! + 1);
    degrees.set(to, degrees.get(to)! + 1);
    const a = root(from),
      b = root(to);
    if (a !== b) {
      parents.set(a, b);
      components--;
    }
    pairs.add(Math.min(from, to) + "/" + Math.max(from, to));
  }
  const values = [...degrees.values()],
    nodes = graph.nodes.length,
    edges = graph.edges.length;
  return {
    nodes,
    edges,
    components,
    cycleRank: edges - nodes + components,
    parallelEdges: edges - pairs.size,
    meanDegree: nodes ? (2 * edges) / nodes : null,
    branchingNodes: values.filter((d) => d >= 3).length,
    deadEnds: values.filter((d) => d === 1).length,
    isolatedNodes: values.filter((d) => d === 0).length,
  };
}
export type GraphTopology = ReturnType<typeof graphTopology>;
