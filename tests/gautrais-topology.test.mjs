import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGautraisGraph } from "../src/modules/benchmarks/gautrais/graph.ts";
import { graphTopology } from "../src/modules/benchmarks/gautrais/topology.ts";
const nodes = (n) =>
  Array.from(
    { length: n },
    (_, i) => "noeud " + i + " interne " + i + " 0 1",
  ).join("\n") + "\n";
const measure = (n, edges) =>
  graphTopology(
    parseGautraisGraph(
      nodes(n) + edges.map(([a, b]) => "arc " + a + " " + b + " 1").join("\n"),
    ),
  );

test("known tree, disconnected cycle and multigraph keep distinct topological meanings", () => {
  assert.deepEqual(
    measure(4, [
      [0, 1],
      [0, 2],
      [0, 3],
    ]),
    {
      nodes: 4,
      edges: 3,
      components: 1,
      cycleRank: 0,
      parallelEdges: 0,
      meanDegree: 1.5,
      branchingNodes: 1,
      deadEnds: 3,
      isolatedNodes: 0,
    },
  );
  const disconnected = measure(5, [
    [0, 1],
    [1, 2],
    [2, 0],
    [3, 4],
  ]);
  assert.equal(disconnected.components, 2);
  assert.equal(disconnected.cycleRank, 1);
  assert.equal(disconnected.meanDegree, 1.6);
  const parallel = measure(3, [
    [0, 1],
    [1, 0],
  ]);
  assert.equal(parallel.parallelEdges, 1);
  assert.equal(parallel.cycleRank, 1);
  assert.equal(parallel.isolatedNodes, 1);
  assert.equal(parallel.deadEnds, 0);
  assert.equal(measure(0, []).meanDegree, null);
  assert.equal(measure(2, []).components, 2);
});

test("graph identity, edge direction and file order do not alter undirected measures", () => {
  const a = measure(4, [
    [0, 1],
    [1, 2],
    [2, 0],
    [2, 3],
  ]);
  const b = parseGautraisGraph(
    "arc 12 10 0.2\nnoeud 13 front 4 2 1\nnoeud 12 lateral 3 1 1\nnoeud 11 interne 2 0 1\nnoeud 10 peripheral 1 0 1\narc 13 12 1\narc 11 10 1\narc 12 11 1",
  );
  assert.deepEqual(graphTopology(b), a);
});

test("malformed numbers, loops, unknown node types and oversized graphs are rejected", () => {
  for (const text of [
    "noeud 1 front NaN 0 1",
    "noeud -1 front 0 0 1",
    "noeud 1 invented 0 0 1",
    "noeud 1 front 0 0 0",
    nodes(2) + "arc 0 0 1",
    nodes(2) + "arc 0 9 1",
    nodes(2) + "arc 0 1 Infinity",
    nodes(2) + "arc 0 1 1 extra",
    " ".repeat(128 * 1024 + 1),
  ])
    assert.throws(() => parseGautraisGraph(text));
  const graph = parseGautraisGraph(nodes(1));
  assert.throws(
    () => graphTopology({ ...graph, nodes: [...graph.nodes, ...graph.nodes] }),
    /duplicado/,
  );
});
