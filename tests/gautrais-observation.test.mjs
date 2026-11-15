import { readFileSync } from "node:fs";
import { normalizeWorldObservationPlan } from "../src/modules/benchmarks/gautrais/observation/world-plan.ts";
import assert from "node:assert/strict";
import { test } from "node:test";
import { World } from "../src/modules/simulation/world.js";
import { observePhysicalNetwork } from "../src/modules/benchmarks/gautrais/observation/measure.ts";
import {
  maskTopology,
  roundedLift,
} from "../src/modules/benchmarks/gautrais/observation/mask.ts";
import { thinMask } from "../src/modules/benchmarks/gautrais/observation/thin.ts";
import { suppressSubdivisions } from "../src/modules/benchmarks/gautrais/observation/normalize.ts";
import {
  observeWorldSection,
  sampleWorldSection,
} from "../src/modules/benchmarks/gautrais/observation/world-section.ts";
import { parseGautraisGraph } from "../src/modules/benchmarks/gautrais/graph.ts";
import { graphTopology } from "../src/modules/benchmarks/gautrais/topology.ts";
const mask = (rows) => ({
  width: rows[0].length,
  height: rows.length,
  cells: Uint8Array.from(rows.join(""), (s) => Number(s)),
  pitch: 1,
  originX: 0,
  originY: 0,
});
const section = { y: -2, minX: -3, maxX: 3, minZ: -2, maxZ: 2, pitch: 0.2 };
const nest = () => ({
  nodes: [
    { x: -1.5, y: -2, z: 0, r: 0.7, name: "a", type: "chamber" },
    { x: 1.5, y: -2, z: 0, r: 0.7, name: "b", type: "chamber" },
  ],
  links: [[0, 1]],
  linkWidths: [0.3],
  revision: 0,
});

test("all 512 local masks retain physical connectivity and holes through the observation operator", () => {
  for (let bits = 0; bits < 512; bits++) {
    const input = {
      ...mask(["000", "000", "000"]),
      cells: Uint8Array.from({ length: 9 }, (_, i) => (bits >> i) & 1),
    };
    const result = observePhysicalNetwork(input),
      expected = maskTopology(input);
    assert.deepEqual(result.physicalTopology, expected, "mask " + bits);
    assert.equal(
      result.metrics.components,
      expected.components,
      "components " + bits,
    );
    assert.equal(result.metrics.cycleRank, expected.holes, "holes " + bits);
  }
});

test("known rings, branches, separated and point-touching voids have the expected topology", () => {
  const ring = observePhysicalNetwork(
    mask(["11111", "10001", "10001", "10001", "11111"]),
  );
  assert.equal(ring.metrics.components, 1);
  assert.equal(ring.metrics.cycleRank, 1);
  assert.equal(ring.metrics.parallelEdges, 1);
  const diagonal = observePhysicalNetwork(mask(["10", "01"]));
  assert.equal(diagonal.metrics.components, 2);
  const branch = observePhysicalNetwork(
    mask(["00100", "00100", "11111", "00100", "00100"]),
  );
  assert.equal(branch.metrics.cycleRank, 0);
  assert.equal(branch.metrics.deadEnds, 4);
  assert.equal(branch.metrics.branchingNodes, 1);
  const two = observePhysicalNetwork(mask(["1110111", "1010101", "1110111"]));
  assert.equal(two.metrics.components, 2);
  assert.equal(two.metrics.cycleRank, 2);
});

test("degree-2 chamber suppression is shared, idempotent and preserves parallel cycles", () => {
  const text =
    "noeud 1 peripheral 0 0 1\nnoeud 2 interne 1 0 1\nnoeud 3 front 2 0 1\narc 1 2 1\narc 2 3 1";
  const graph = parseGautraisGraph(text),
    copy = structuredClone(graph),
    normalized = suppressSubdivisions(graph);
  assert.deepEqual(graph, copy);
  assert.equal(normalized.nodes.length, 2);
  assert.equal(normalized.edges.length, 1);
  assert.deepEqual(suppressSubdivisions(normalized), normalized);
  const loop = parseGautraisGraph(
    "noeud 1 interne 0 0 1\nnoeud 2 interne 1 0 1\narc 1 2 1\narc 1 2 1",
  );
  assert.equal(graphTopology(suppressSubdivisions(loop)).cycleRank, 1);
});

test("physical field sees a blockage and a geometric connection absent from the logical graph", () => {
  const state = nest(),
    before = JSON.stringify(state);
  assert.equal(observeWorldSection(state, section).metrics.components, 1);
  assert.equal(JSON.stringify(state), before);
  state.rubble = [{ x: 0, y: -2, z: 0, mass: (4 * Math.PI * 0.512) / 3 }];
  assert.equal(state.links.length, 1);
  assert.equal(observeWorldSection(state, section).metrics.components, 2);
  const joined = nest();
  joined.links = [];
  joined.erosionCuts = [{ x: 0, y: -2, z: 0, r: 1.3 }];
  assert.equal(observeWorldSection(joined, section).metrics.components, 1);
});

test("real World observation is readonly and refuses an invented physical time or outside-air section", () => {
  const world = new World("GAUTRAIS-G2-READONLY", {}, { founding: false }),
    before = JSON.stringify(world.snapshot());
  const result = observeWorldSection(world.nest, {
    y: -2,
    minX: -10,
    maxX: 10,
    minZ: -6.5,
    maxZ: 6.5,
    pitch: 0.5,
  });
  assert.equal(result.buhlComparable, false);
  assert.equal(result.lengthUnit, "model-unit");
  assert.equal(JSON.stringify(world.snapshot()), before);
  for (const extra of [{ y: 1 }, { minX: -11 }, { pitch: 0.123 }, { pitch: 0 }])
    assert.throws(() =>
      sampleWorldSection(world.nest, { ...section, ...extra }),
    );
});

test("larger irregular masks retain topology without replacing holes by junction artifacts", () => {
  let state = 14327;
  for (let sample = 0; sample < 1500; sample++) {
    const input = {
      width: 6,
      height: 6,
      pitch: 1,
      originX: 0,
      originY: 0,
      cells: new Uint8Array(36),
    };
    for (let i = 0; i < 36; i++) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      input.cells[i] = Number(state / 4294967296 < ((sample % 3) + 1) / 4);
    }
    const expected = maskTopology(input),
      observed = observePhysicalNetwork(input);
    assert.equal(
      observed.metrics.components,
      expected.components,
      "components " + sample,
    );
    assert.equal(observed.metrics.cycleRank, expected.holes, "holes " + sample);
  }
});

test("actual fixed pilot plan is accepted independently of key order; invalid plans fail", () => {
  const raw = JSON.parse(
    readFileSync("docs/validacoes/gautrais-g2-piloto-plano.json"),
  );
  assert.deepEqual(
    normalizeWorldObservationPlan(raw),
    normalizeWorldObservationPlan(
      Object.fromEntries(Object.entries(raw).reverse()),
    ),
  );
  for (const change of [
    { ticks: 0 },
    { ticks: 100000 },
    { groups: [50, 50] },
    { sectionsY: [1] },
    { pitches: [0.1] },
    { unexpected: true },
    { ticks: "120" },
  ])
    assert.throws(() => normalizeWorldObservationPlan({ ...raw, ...change }));
});

test("diagonal disambiguation never cuts notches in a solid straight wall", () => {
  for (const rows of [["111111", "111111"], ["1"], ["111", "111", "111"]]) {
    const input = mask(rows),
      lifted = roundedLift(input);
    assert.ok(lifted.cells.every((value) => value === 1));
    assert.deepEqual(maskTopology(lifted, true), { components: 1, holes: 0 });
  }
  const diagonal = roundedLift(mask(["10", "01"]));
  assert.deepEqual(maskTopology(diagonal, true), { components: 2, holes: 0 });
});
