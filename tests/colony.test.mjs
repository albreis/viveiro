import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { shareCrop, feedFromStock } from "../src/modules/colony/nutrition.ts";
import {
  makeBrood,
  broodStage,
  broodPosition,
} from "../src/modules/colony/brood.ts";

test("contact transfers conserve social food and storage feeding withdraws the same amount", () => {
  const w = new World("nutrition");
  const a = w.makeAnt("worker", 0, 0),
    b = w.makeAnt("worker", 0.2, 0);
  a.crop = 0.6;
  b.crop = 0;
  assert.equal(shareCrop(a, b), 0.3);
  assert.equal(a.crop + b.crop, 0.6);
  w.food = 2;
  const before = w.food + a.crop;
  feedFromStock(w, a);
  assert.ok(Math.abs(w.food + a.crop - before) < 1e-12);
  for (let i = 0; i < 1000; i++) {
    shareCrop(a, b);
    shareCrop(b, a);
  }
  assert.ok(Math.abs(a.crop + b.crop - 0.9) < 1e-10);
});

test("individual traits reproduce by seed and differ between ants", () => {
  const a = new World("traits"),
    b = new World("traits");
  const one = a.makeAnt("worker", 0, 0),
    copy = b.makeAnt("worker", 0, 0),
    two = a.makeAnt("worker", 0, 0);
  assert.deepEqual(one.traits, copy.traits);
  assert.notDeepEqual(one.traits, two.traits);
  assert.ok(one.bodyScale >= 0.8 && one.bodyScale <= 1.3);
  assert.equal(broodStage(0.1), "egg");
  assert.equal(broodStage(0.5), "larva");
  assert.equal(broodStage(1), "pupa");
});

test("a nurse physically carries brood to the nursery", () => {
  const w = new World("nurse");
  w.predators = [];
  w.food = 100;
  w.lastLaying = Infinity;
  const brood = makeBrood(w, w.nextId++);
  w.brood = [brood];
  const nurse = w.makeAnt("worker", brood.x, brood.z);
  Object.assign(nurse, {
    y: brood.y - 0.025,
    node: 2,
    route: [],
    age: 0,
    role: "nurse",
    nextTaskChoice: 10000,
    caste: "minor",
    crop: 0.3,
    traits: { activity: 1, courage: 0.5, exploration: 0.1 },
    tunnelY: w.nest.nodes[2].y,
    tunnelCenter: {
      x: w.nest.nodes[2].x,
      y: w.nest.nodes[2].y,
      z: w.nest.nodes[2].z,
    },
  });
  w.ants = [nurse];
  for (let i = 0; i < 4; i++) {
    const a = w.makeAnt("worker", -8, -5 + i * 0.3);
    a.rest = 10000;
    w.ants.push(a);
  }
  let carried = false;
  for (
    let i = 0;
    i < 800 && (brood.node !== 3 || brood.carrier !== undefined);
    i++
  ) {
    const p = { x: nurse.x, y: nurse.y, z: nurse.z };
    w.step();
    carried ||= brood.carrier === nurse.id;
    assert.ok(
      Math.hypot(nurse.x - p.x, nurse.y - p.y, nurse.z - p.z) <=
        nurse.speed * 1.2 + 0.002,
    );
  }
  assert.ok(carried);
  assert.equal(brood.node, 3);
  assert.equal(brood.carrier, undefined);
  assert.equal(nurse.carryingBrood, 0);
});

test("a cleaner carries a corpse to the waste chamber instead of erasing it", () => {
  const w = new World("cleaner");
  w.predators = [];
  w.food = 100;
  w.brood = [];
  const support = broodPosition(w, 999, 2),
    ant = w.makeAnt("worker", support.point.x, support.point.z);
  Object.assign(ant, support.point, {
    normal: support.normal,
    node: 2,
    route: [],
    age: 2,
    role: "cleaner",
    nextTaskChoice: 10000,
    caste: "minor",
    traits: { activity: 1, courage: 0.5, exploration: 1 },
    tunnelY: w.nest.nodes[2].y,
    tunnelCenter: {
      x: w.nest.nodes[2].x,
      y: w.nest.nodes[2].y,
      z: w.nest.nodes[2].z,
    },
  });
  const item = {
    id: w.nextId++,
    kind: "corpse",
    mass: 0.04,
    stored: false,
    x: ant.x,
    y: ant.y + 0.02,
    z: ant.z,
  };
  w.colony.waste = [item];
  w.ants = [ant];
  for (let i = 0; i < 1400 && !item.stored; i++) w.step();
  assert.ok(item.stored);
  assert.equal(item.carrier, undefined);
  assert.equal(w.colony.cemeteryMass, 0.04);
  assert.equal(ant.carryingWaste, 0);
});

test("biological tasks and nutrition survive a snapshot with identical future", () => {
  const w = new World("colony-snapshot");
  w.step(700);
  const restored = World.restore(w.snapshot());
  w.step(250);
  restored.step(250);
  assert.deepEqual(w.snapshot(), restored.snapshot());
  assert.ok(w.ants.every((a) => a.crop >= -1e-10 && a.crop <= 0.6 + 1e-10));
});
