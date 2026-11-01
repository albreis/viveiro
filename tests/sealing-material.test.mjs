import { test } from "node:test";
import assert from "node:assert/strict";
import { sealFixture } from "./fixtures/seal.mjs";
import {
  reclaimSpoil,
  fillPlug,
  removePlug,
} from "../src/modules/sealing/material.ts";
import { sampleSoil } from "../src/modules/terrain/field.ts";
import { plugField } from "../src/modules/sealing/field.ts";
import { depositSoil, soilBalance } from "../src/modules/soil/ledger.ts";
import { solidVolume } from "../src/modules/structure/release.ts";
import { edgePassable } from "../src/modules/sealing/passage.ts";
import { requestRoute } from "../src/modules/navigation/local-routing.ts";
import { airNetwork } from "../src/modules/ventilation/network.ts";
import { syncGases } from "../src/modules/ventilation/state.ts";
import { updateVentilation } from "../src/modules/ventilation/update.ts";
import { gasBudget } from "../src/modules/ventilation/sensing.ts";
import { World } from "../src/modules/simulation/world.js";
const near = (a, b = 0) => assert.ok(Math.abs(a - b) < 1e-8, a + " != " + b);
function close(f) {
  reclaimSpoil(f.w, f.q, f.p.capacity);
  fillPlug(f.w, f.q, f.p, 1);
}
test("local spoil moves into an attached plug and back to the surface without duplicating source material", () => {
  const f = sealFixture(),
    { w, q, p } = f;
  assert.equal(fillPlug(w, q, p, 10), 0);
  assert.equal(reclaimSpoil(w, { ...q, x: 8 }, 1), 0);
  close(f);
  near(p.mass, p.capacity);
  near(soilBalance(w).error);
  assert.equal(p.innerRadius, 0);
  assert.ok(sampleSoil(w.nest, p).distance < 0);
  for (let i = 0; i < 100 && p.mass > 0; i++) {
    removePlug(w, q, p, 0.003);
    depositSoil(w, q);
    near(soilBalance(w).error);
  }
  near(p.mass);
  near(p.innerRadius, p.radius);
  near(w.soil.deposits[0].mass, 1);
  near(w.soil.removed, 1);
  near(soilBalance(w).surfaceStock, 1);
  assert.ok(sampleSoil(w.nest, p).distance > 0);
});
test("a filled cap covers the pre-existing air cross section; later roof release never counts transported plug material as newly eroded compact soil", () => {
  const f = sealFixture(),
    { w, p } = f;
  const bare = { ...w.nest, plugs: [] };
  close(f);
  const u = { x: 0, y: 0, z: 1 },
    v = { x: -p.axis.y, y: p.axis.x, z: 0 };
  let air = 0;
  for (let r = 0; r < 0.7; r += 0.035)
    for (let k = 0; k < 32; k++) {
      const t = (k * 2 * Math.PI) / 32,
        point = {
          x: p.x + v.x * r * Math.cos(t),
          y: p.y + v.y * r * Math.cos(t),
          z: p.z + u.z * r * Math.sin(t),
        };
      if (sampleSoil(bare, point).distance > 0.002) {
        air++;
        assert.ok(sampleSoil(w.nest, point).distance <= 0.002);
      }
    }
  assert.ok(air > 200);
  near(solidVolume(w, p, 0.07));
  for (const point of [p, { ...p, x: p.x + 1 }, { ...p, y: p.y + 1 }]) {
    const field = plugField(p, point);
    assert.ok(Object.values(field).every(Number.isFinite));
  }
});
test("the local route and an already planned segment both respect a closed plug, and reopen only after physical clearance exists", () => {
  const f = sealFixture(),
    { w, q, p } = f;
  close(f);
  q.kind = "worker";
  q.bodyScale = 0.72;
  q.node = 1;
  q.route = [];
  assert.equal(edgePassable(w.nest, 1, 0, q), false);
  requestRoute(w, q, 0);
  assert.deepEqual(q.route, []);
  q.route = [0];
  const before = { x: q.x, y: q.y, z: q.z };
  w.moveInNest(q);
  assert.deepEqual({ x: q.x, y: q.y, z: q.z }, before);
  assert.deepEqual(q.route, []);
  removePlug(w, q, p, p.mass);
  assert.equal(edgePassable(w.nest, 1, 0, q), true);
});
test("a closed porous plug reduces gas exchange and displaces air with an explicit geometry budget", () => {
  const f = sealFixture(),
    { w, p } = f,
    open = airNetwork(w);
  syncGases(w, open);
  close(f);
  const shut = airNetwork(w);
  near(shut.edges[0].diffusion / open.edges[0].diffusion, 0.08);
  near(shut.edges[0].conductance / open.edges[0].conductance, 0.002);
  near(
    open.volume.reduce((a, b) => a + b, 0) -
      shut.volume.reduce((a, b) => a + b, 0),
    p.mass,
  );
  syncGases(w, shut);
  for (let i = 1; i <= 40; i++) {
    w.tick = i * 10;
    updateVentilation(w);
  }
  near(gasBudget(w.gases).oxygen);
  near(gasBudget(w.gases).carbon);
});
test("corrupt geometry, inconsistent radius, incompatible revisions and fabricated reclaimed material are rejected on reconstruction", () => {
  const f = sealFixture();
  close(f);
  for (const mutate of [
    (s) => (s.nest.plugs[0].mass = -1),
    (s) => (s.nest.plugs[0].innerRadius = 0.4),
    (s) => (s.nest.plugs[0].shells[0] += 1),
    (s) => (s.nest.plugs[0].axis.y = 3),
    (s) => (s.soil.reclaimed = 10),
    (s) => (s.biologicalProfile.version = 2),
  ]) {
    const raw = f.w.snapshot();
    mutate(raw);
    assert.throws(() => World.restore(raw), /tampão|terra recuperada/);
  }
});

test("the global material ledger rejects invented plug stock and counts carriers in daughter colonies only once", () => {
  const f = sealFixture();
  close(f);
  const corrupt = f.w.snapshot();
  corrupt.soil.removed += 0.02;
  assert.throws(() => World.restore(corrupt), /Balanço de terra/);
  const raw = f.w.snapshot(),
    child = structuredClone(raw),
    ant = f.w.makeAnt("worker", 1, 1);
  ant.carryingSoil = 0.02;
  ant.colonyId = 2;
  raw.soil.removed += 0.02;
  child.ants = [ant];
  child.colonies = [];
  child.colonyId = 2;
  delete child.founding;
  child.biologicalProfile = { schema: 1, id: "generic-demo", version: 1 };
  child.soil = raw.soil;
  child.nest = raw.nest;
  raw.colonies = [child];
  const restored = World.restore(raw);
  near(soilBalance(restored).error);
  assert.equal(restored.soil, restored.colonies[0].soil);
});
