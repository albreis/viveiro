import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import {
  generateLandscape,
  legacyLandscape,
} from "../src/modules/landscape/generate.ts";
import { updateLandscape } from "../src/modules/landscape/dynamics.ts";
import {
  waterLevel,
  timberLevel,
  surfaceHeight,
} from "../src/modules/landscape/queries.ts";
import { sampleSupport, sampleSoil } from "../src/modules/terrain/field.ts";
import { proposeDig, digBite } from "../src/modules/soil/projects.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
test("seed reproduces the whole landscape; other seeds change water, flora, timber and nest topology", () => {
  const a = new World("land-a"),
    b = new World("land-a"),
    c = new World("land-b");
  assert.deepEqual(a.snapshot(), b.snapshot());
  for (const key of ["ponds", "logs", "rocks", "relief"])
    assert.notDeepEqual(a.landscape[key], c.landscape[key]);
  assert.notDeepEqual(a.plants, c.plants);
  assert.notDeepEqual(a.nest.nodes, c.nest.nodes);
  const topologies = new Set();
  for (let i = 0; i < 20; i++) {
    const w = new World("topology-" + i);
    topologies.add(JSON.stringify(w.nest.links));
  }
  assert.ok(topologies.size >= 4);
});
test("new layouts are connected, have multiple physical viewing faces and unobstructed mouths", () => {
  const faces = new Set();
  for (let i = 0; i < 25; i++) {
    const w = new World("geography-" + i),
      seen = new Set([0]);
    while (true) {
      const size = seen.size;
      for (const [a, b] of w.nest.links) {
        if (seen.has(a)) seen.add(b);
        if (seen.has(b)) seen.add(a);
      }
      if (seen.size === size) break;
    }
    assert.equal(seen.size, w.nest.nodes.length);
    const panes = new Set();
    for (const n of w.nest.nodes) {
      assert.ok(Math.abs(n.x) <= 9.83 && Math.abs(n.z) <= 6.33 && n.y >= -3.5);
      if (n.z + n.r > 6.5) panes.add("front");
      if (n.z - n.r < -6.5) panes.add("back");
      if (n.x + n.r > 10) panes.add("right");
      if (n.x - n.r < -10) panes.add("left");
      if (n.type === "entrance") {
        assert.ok(waterLevel(w.landscape, n.x, n.z, true) > 2);
        assert.ok(timberLevel(w.landscape, n.x, n.z) > 2);
      }
    }
    assert.ok(panes.size >= 2);
    for (const f of panes) faces.add(f);
  }
  assert.equal(faces.size, 4);
});
test("species respond differently to drought and shade; water evaporates and rainfall restores it", () => {
  const dry = new World("plants", { humidity: 5, light: 95 }),
    wet = new World("plants", { humidity: 90, light: 35 });
  const specimen = (species) => ({
    id: 100,
    x: 0,
    z: 0,
    kind: 0,
    species,
    biomass: 0.6,
    health: 1,
    hydration: 0.5,
    vigor: 1,
  });
  dry.plants = ["cactus", "fern"].map(specimen);
  wet.plants = structuredClone(dry.plants);
  dry.patches = [];
  wet.patches = [];
  const volume = dry.landscape.ponds[0].volume,
    integrity = wet.landscape.logs[0].integrity;
  for (let i = 0; i < 2500; i++) {
    updateLandscape(dry);
    updateLandscape(wet);
  }
  assert.ok(dry.plants[0].health > dry.plants[1].health);
  assert.ok(wet.plants[1].health > wet.plants[0].health);
  assert.ok(dry.landscape.ponds[0].volume < volume);
  assert.ok(wet.landscape.logs[0].integrity < integrity);
  const before = dry.landscape.ponds[0].volume;
  dry.intervene("rain");
  assert.ok(dry.landscape.ponds[0].volume > before);
  assert.ok(wet.landscape.rocks[0].wetness > dry.landscape.rocks[0].wetness);
});
test("surface movement follows the same seeded relief used by the soil field", () => {
  const w = new World("relief"),
    ant = w.makeAnt("worker", 0, 0);
  w.ants = [ant];
  for (let i = 0; i < 100; i++) {
    w.tick++;
    w.moveSurface(ant, 0.35, ant.speed);
    assert.ok(Math.abs(sampleSupport(w.nest, ant).distance - 0.008) < 0.015);
    assert.ok(
      Math.abs(ant.y - surfaceHeight(w.nest.relief, ant.x, ant.z) - 0.008) <
        0.001,
    );
  }
});
test("dig directions cover 3D, curve over time and conserve removed soil", () => {
  const directions = [];
  for (let i = 0; i < 30; i++) {
    const w = new World("dig-3d-" + i);
    w.ants = [];
    const project = proposeDig(w, 3);
    if (!project) continue;
    const from = w.nest.nodes[3];
    directions.push({
      x: project.goal.x - from.x,
      y: project.goal.y - from.y,
      z: project.goal.z - from.z,
    });
    const ant = w.makeAnt("worker", from.x, from.z);
    w.ants = [ant];
    const initial = project.front;
    for (let j = 0; j < 180 && !project.completed; j++)
      digBite(w, ant, project);
    assert.ok(
      project.front > initial,
      "a project must retain completed segments while growing a new front",
    );
    assert.ok(Math.abs(soilBalance(w).error) < 1e-9);
  }
  assert.ok(directions.length > 15);
  for (const key of ["x", "y", "z"]) {
    assert.ok(directions.some((d) => d[key] > 0.1));
    assert.ok(directions.some((d) => d[key] < -0.1));
  }
});
test("an advancing cavity exposes a new opening only after reaching the glass", () => {
  const w = new World("glass-exposure");
  w.ants = [];
  w.nest = {
    nodes: [
      { x: 7.8, y: -1.8, z: 0, r: 0.35, type: "chamber", name: "Start" },
      { x: 8.2, y: -1.8, z: 0, r: 0.28, type: "front", name: "Front" },
    ],
    links: [[0, 1]],
    linkWidths: [0.28],
    revision: 2,
  };
  const project = {
    id: 1,
    from: 0,
    front: 1,
    goal: { x: 9.82, y: -1.8, z: 0 },
    remainingSegments: 0,
    completed: false,
    excavated: 0,
  };
  const ant = w.makeAnt("worker", 7.8, 0);
  w.ants = [ant];
  const glass = { x: 9.999, y: -1.8, z: 0 };
  assert.ok(sampleSoil(w.nest, glass).distance < 0);
  for (let i = 0; i < 200 && !project.completed; i++) digBite(w, ant, project);
  assert.ok(sampleSoil(w.nest, glass).distance > 0);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-9);
});
test("old saved terrariums preserve their nest and receive compatible legacy obstacles", () => {
  const w = new World("old");
  delete w.landscape;
  delete w.nest.relief;
  const snapshot = w.snapshot(),
    restored = World.restore(snapshot);
  assert.deepEqual(restored.nest, snapshot.nest);
  assert.deepEqual(restored.landscape, legacyLandscape());
});

test("spider interpolation starts at its previous supported height", async () => {
  const { updatePredators } =
    await import("../src/modules/simulation/predator-step.js");
  const w = new World("spider-relief");
  w.ants = [];
  const p = w.predators[0];
  for (let i = 0; i < 100; i++) {
    const y = p.y;
    updatePredators(w, new Set());
    assert.equal(p.previousY, y);
    assert.ok(Math.abs(p.y - y) < 0.01);
  }
});
