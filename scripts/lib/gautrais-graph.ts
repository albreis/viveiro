type Edge = readonly [number, number];

const nodeKinds = new Set([
  "peripheral",
  "front",
  "interne",
  "lateral",
  "externe",
  "bifurcation",
]);
const id = (value: string) =>
  /^\d+$/.test(value) && Number.isSafeInteger(Number(value));
const positive = (value: string) =>
  Number.isFinite(Number(value)) && Number(value) > 0;

function connectivity(vertices: ReadonlySet<number>, edges: readonly Edge[]) {
  const parent = new Map(Array.from(vertices, (v) => [v, v]));
  const root = (start: number) => {
    let current = start;
    while (parent.get(current) !== current) {
      parent.set(current, parent.get(parent.get(current)!)!);
      current = parent.get(current)!;
    }
    return current;
  };
  let components = vertices.size;
  for (const [a, b] of edges) {
    if (!vertices.has(a) || !vertices.has(b) || a === b)
      throw Error("O túnel deve ligar dois nós existentes e distintos.");
    const x = root(a);
    const y = root(b);
    if (x !== y) {
      parent.set(x, y);
      components--;
    }
  }
  return components;
}

/** Count topology without assuming a physical unit for coordinates or widths. */
export function summarizeGautraisGraph(text: string) {
  const vertices = new Set<number>();
  const edges: Edge[] = [];
  for (const [index, row] of text.split(/\r?\n/).entries()) {
    if (!row.trim()) continue;
    const [tag, a, b, c, d, e, ...extra] = row.trim().split(/\s+/);
    if (tag === "noeud") {
      if (
        e === undefined ||
        extra.length ||
        !id(a) ||
        !nodeKinds.has(b) ||
        !Number.isFinite(Number(c)) ||
        !Number.isFinite(Number(d)) ||
        !positive(e) ||
        vertices.has(Number(a))
      )
        throw Error("Nó inválido na linha " + (index + 1) + ".");
      vertices.add(Number(a));
    } else if (tag === "arc") {
      if (
        c === undefined ||
        d !== undefined ||
        !id(a) ||
        !id(b) ||
        !positive(c)
      )
        throw Error("Túnel inválido na linha " + (index + 1) + ".");
      edges.push([Number(a), Number(b)]);
    } else throw Error("Registro inválido na linha " + (index + 1) + ".");
  }
  const components = connectivity(vertices, edges);
  const distinct = new Set(
    edges.map(([a, b]) => Math.min(a, b) + "/" + Math.max(a, b)),
  );
  return {
    nodes: vertices.size,
    edges: edges.length,
    components,
    cycleRank: edges.length - vertices.size + components,
    parallelEdges: edges.length - distinct.size,
  };
}
