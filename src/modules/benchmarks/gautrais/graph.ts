import type { GraphEdge, GraphNode, ObservedGraph } from "./types.ts";
const kinds = new Set([
  "peripheral",
  "front",
  "interne",
  "lateral",
  "externe",
  "bifurcation",
]);
const validId = (s: string) =>
  /^\d+$/.test(s) && Number.isSafeInteger(Number(s));
const positive = (s: string) => Number.isFinite(Number(s)) && Number(s) > 0;

/** Read Data S1 without inventing units or deduplicating observed tunnels. */
export function parseGautraisGraph(text: string): ObservedGraph {
  if (text.length > 128 * 1024) throw Error("Grafo grande demais.");
  const nodes: GraphNode[] = [],
    edges: GraphEdge[] = [],
    ids = new Set<number>();
  for (const [i, row] of text.split(/\r?\n/).entries()) {
    if (!row.trim()) continue;
    const fields = row.trim().split(/\s+/),
      [tag, a, b, c, d, e] = fields;
    if (tag === "noeud") {
      if (
        fields.length !== 6 ||
        !validId(a) ||
        !kinds.has(b) ||
        !Number.isFinite(Number(c)) ||
        !Number.isFinite(Number(d)) ||
        !positive(e) ||
        ids.has(Number(a))
      )
        throw Error("Nó inválido na linha " + (i + 1) + ".");
      ids.add(Number(a));
      nodes.push({
        id: Number(a),
        kind: b,
        x: Number(c),
        y: Number(d),
        radius: Number(e),
      });
    } else if (tag === "arc") {
      if (fields.length !== 4 || !validId(a) || !validId(b) || !positive(c))
        throw Error("Túnel inválido na linha " + (i + 1) + ".");
      edges.push({ from: Number(a), to: Number(b), width: Number(c) });
    } else throw Error("Registro inválido na linha " + (i + 1) + ".");
  }
  for (const edge of edges)
    if (edge.from === edge.to || !ids.has(edge.from) || !ids.has(edge.to))
      throw Error("O túnel deve ligar dois nós existentes e distintos.");
  return { nodes, edges };
}
