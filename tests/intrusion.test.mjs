import { createNestOdors } from "../src/modules/chemistry/nest-odors.ts";
import { invalidateNeighbors } from "../src/modules/navigation/sensors.ts";
import { sampleSupport } from "../src/modules/terrain/field.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { chemicalFamily } from "./fixtures/chemical-family.mjs";
import { prepareSocialChemistry } from "../src/modules/social-chemistry/profile.ts";
import { arriveIntruder } from "../src/modules/social-chemistry/intrusion-arrival.ts";
import { updateIntrusion } from "../src/modules/social-chemistry/intrusion.ts";
import { applyOdorPulse } from "../src/modules/social-chemistry/intervention.ts";
import { projectSupport } from "../src/modules/terrain/surface-queries.ts";
import { bindNeighbors } from "../src/modules/colonies/shared.ts";
function stockFixture() {
  const f = chemicalFamily(),
    { w, child, a } = f;
  w.nest.nodes = [
    {
      x: 0,
      y: -1.4,
      z: 0,
      r: 0.7,
      type: "storage",
      name: "Stock",
      colonyId: 2,
    },
    {
      x: 0,
      y: 0.03,
      z: 0,
      r: 0.36,
      type: "entrance",
      name: "Entry",
      colonyId: 2,
    },
  ];
  w.nest.links = [[0, 1]];
  w.nest.revision++;
  const s = projectSupport(w.nest, { x: 0.1, y: -2.05, z: 0 });
  Object.assign(a, s.point, {
    node: 0,
    normal: s.normal,
    intrusion: {
      owner: 2,
      entry: 1,
      phase: "search",
      until: w.tick + 500,
      home: { node: 77, x: 4, z: 4 },
    },
  });
  w.food = 1;
  child.food = 5;
  bindNeighbors(w);
  return f;
}
test("an intruder only transfers existing food after physically reaching a foreign stock", () => {
  const { w, child, a } = stockFixture(),
    before = w.food + child.food + a.carrying;
  assert.equal(arriveIntruder(w, a, 0), true);
  assert.equal(w.food, 1);
  assert.ok(child.food < 5);
  assert.ok(a.carrying > 0);
  assert.ok(Math.abs(before - w.food - child.food - a.carrying) < 1e-10);
  assert.equal(a.intrusion.phase, "exit");
  const carried = a.carrying;
  arriveIntruder(w, a, 0);
  assert.equal(a.carrying, carried);
  assert.equal(a.routeIntent.owner, 2);
});
test("a logical stock label cannot steal food through distant soil, and exit restores home memory", () => {
  const { w, child, a } = stockFixture();
  a.x = 4;
  arriveIntruder(w, a, 0);
  assert.equal(child.food, 5);
  assert.equal(a.carrying, 0);
  assert.ok(a.supportMotion);
  a.intrusion.phase = "exit";
  a.node = 1;
  assert.equal(arriveIntruder(w, a, 1), false);
  assert.equal(a.intrusion, undefined);
  assert.deepEqual(a.lastEntrance, { node: 77, x: 4, z: 4 });
});
test("soil masking is triggered by a nearby foreign entrance and consumes time and energy", () => {
  const { w, a } = stockFixture();
  a.intrusion = undefined;
  a.node = null;
  a.x = 0.55;
  a.y = 0.008;
  a.z = 0;
  a.energy = 30;
  a.crop = 0;
  a.traits.exploration = 1;
  w.random = () => 0;
  for (let i = 0; i < 21; i++) {
    w.tick++;
    prepareSocialChemistry(w);
    assert.equal(updateIntrusion(w, a), true);
  }
  assert.ok(a.odorMask.strength > 0.9);
  assert.equal(a.intrusion.owner, 2);
  assert.ok(a.energy < 30);
  assert.equal(a.intrusion.phase, "search");
});
test("an external odor treatment changes only a nearby surface body and is bounded in time", () => {
  const { w, a, b } = chemicalFamily(),
    genes = structuredClone(a.genome);
  assert.equal(applyOdorPulse(w, 0, 0), true);
  assert.equal(a.odorMask.strength, 1);
  assert.equal(a.odorMask.until, w.tick + 200);
  assert.deepEqual(a.genome, genes);
  assert.equal(b.odorMask, undefined);
  assert.equal(applyOdorPulse(w, 8, -5), false);
});

test("a disguised worker walks into a foreign stock and exits with its load, without teleporting", () => {
  const { w, child, a } = stockFixture();
  child.ants = [];
  w.nest.nodes.push({
    x: 5,
    y: 0.03,
    z: 0,
    r: 0.36,
    type: "entrance",
    name: "Home",
    colonyId: 1,
  });
  w.nest.revision++;
  w.nestOdors = createNestOdors(w.nest);
  child.nestOdors = w.nestOdors;
  bindNeighbors(w);
  a.intrusion = undefined;
  a.node = null;
  a.route = [];
  a.tunnelCenter = null;
  a.x = 0.55;
  a.y = 0.008;
  a.z = 0;
  a.normal = { x: 0, y: 1, z: 0 };
  a.energy = 30;
  a.crop = 0;
  a.traits.exploration = 1;
  a.lastEntrance = { node: 2, x: 5, z: 0 };
  w.random = () => 0;
  let entered = false,
    maxStep = 0;
  for (let i = 0; i < 1400; i++) {
    const p = { x: a.x, y: a.y, z: a.z };
    w.tick++;
    invalidateNeighbors(w);
    prepareSocialChemistry(w);
    const active = updateIntrusion(w, a);
    maxStep = Math.max(maxStep, Math.hypot(a.x - p.x, a.y - p.y, a.z - p.z));
    if (a.node === 0) entered = true;
    if (!active && entered && a.carrying > 0) break;
  }
  assert.ok(entered);
  assert.equal(a.node, null);
  assert.equal(a.intrusion, undefined);
  assert.ok(a.carrying > 0);
  assert.ok(child.food < 5);
  assert.ok(maxStep < a.speed * 1.2 + 0.002);
  assert.ok(Math.abs(sampleSupport(w.nest, a).distance - 0.008) < 0.025);
  assert.equal(a.lastEntrance.node, 2);
});
