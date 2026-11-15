import type { ObservedGraph, GraphNode, GraphEdge } from "../types.ts";
import { graphTopology } from "../topology.ts";
import { suppressSubdivisions } from "./normalize.ts";
import type { PlanarMask } from "./mask.ts";

function contractJunctionTrees(graph: ObservedGraph): ObservedGraph {
  const adjacent = new Map(graph.nodes.map((n) => [n.id, [] as number[]]));
  for (const e of graph.edges) {
    adjacent.get(e.from)!.push(e.to);
    adjacent.get(e.to)!.push(e.from);
  }
  const mapped = new Map<number, number>(),
    nodes: GraphNode[] = [];
  const add = (members: number[]) => {
    const id = nodes.length;
    nodes.push({ ...graph.nodes[members[0]], id });
    for (const m of members) mapped.set(m, id);
  };
  for (const n of graph.nodes) {
    if (mapped.has(n.id)) continue;
    if (adjacent.get(n.id)!.length < 3) {
      add([n.id]);
      continue;
    }
    const members = [n.id],
      seen = new Set(members);
    for (let i = 0; i < members.length; i++)
      for (const other of adjacent.get(members[i])!)
        if (adjacent.get(other)!.length >= 3 && !seen.has(other)) {
          seen.add(other);
          members.push(other);
        }
    const count =
      members.reduce(
        (sum, id) =>
          sum + adjacent.get(id)!.filter((other) => seen.has(other)).length,
        0,
      ) / 2;
    if (count === members.length - 1) add(members);
    else for (const id of members) if (!mapped.has(id)) add([id]);
  }
  const edges = graph.edges.flatMap((e) => {
    const from = mapped.get(e.from)!,
      to = mapped.get(e.to)!;
    return from === to ? [] : [{ ...e, from, to }];
  });
  const result = { nodes, edges },
    a = graphTopology(graph),
    b = graphTopology(result);
  if (a.components !== b.components || a.cycleRank !== b.cycleRank)
    throw Error("Junction contraction changed topology");
  return result;
}

/** Diagonal links only where no cardinal two-step connection already exists. */
export function skeletonGraph(mask: PlanarMask): ObservedGraph {
  const { width, height, cells, pitch, originX, originY } = mask;
  const ids = new Int32Array(cells.length).fill(-1),
    nodes: GraphNode[] = [],
    edges: GraphEdge[] = [];
  for (let i = 0; i < cells.length; i++)
    if (cells[i]) {
      ids[i] = nodes.length;
      nodes.push({
        id: nodes.length,
        kind: "interne",
        x: originX + ((i % width) + 0.5) * pitch,
        y: originY + (Math.floor(i / width) + 0.5) * pitch,
        radius: pitch / 2,
      });
    }
  for (let at = 0; at < cells.length; at++)
    if (cells[at]) {
      const x = at % width,
        y = Math.floor(at / width);
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, 1],
      ]) {
        const nx = x + dx,
          ny = y + dy,
          other = ny * width + nx;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height || !cells[other])
          continue;
        // A filled 2x2 pixel face is area, not a real gallery cycle.
        // Remove its bottom horizontal edge; the upper route stays connected.
        if (
          dy === 0 &&
          y > 0 &&
          cells[(y - 1) * width + x] &&
          cells[(y - 1) * width + nx]
        )
          continue;
        if (dx && dy && (cells[y * width + nx] || cells[ny * width + x]))
          continue;
        edges.push({ from: ids[at], to: ids[other], width: pitch });
      }
    }
  return suppressSubdivisions(contractJunctionTrees({ nodes, edges }));
}
