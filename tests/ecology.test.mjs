import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { ecologyFixture } from "./fixtures/ecology.mjs";
import { ensureEcology } from "../src/modules/ecology/initialize.ts";
import { updateAphids } from "../src/modules/ecology/aphids.ts";
import { visitAphids } from "../src/modules/ecology/aphid-worker.ts";
import { aphidPrey } from "../src/modules/ecology/predation.ts";
import { updatePredators } from "../src/modules/simulation/predator-step.js";
test("ecological hosts and initial larvae reproduce by seed without advancing the ant RNG", () => {
  const a = new World("ecology-seed"),
    b = new World("ecology-seed"),
    c = new World("other-ecology"),
    rng = a.rng;
  assert.deepEqual(ensureEcology(a), ensureEcology(b));
  assert.equal(a.rng, rng);
  assert.notDeepEqual(ensureEcology(a), ensureEcology(c));
  assert.ok(a.ecology.aphids.length > 0);
  assert.ok(a.ecology.mimics.length > 0);
  assert.ok(
    a.ecology.mimics.every(
      (m) => Math.abs(m.profile.reduce((a, b) => a + b, 0) - 1) < 1e-12,
    ),
  );
});
test("plant consumption, aphid assimilation, honey production, collection and losses balance", () => {
  const { w, a, e } = ecologyFixture(),
    initial = w.plants[0].biomass;
  for (let i = 0; i < 350; i++) {
    w.tick++;
    updateAphids(w);
    if (i % 30 === 0) {
      a.carrying = 0;
      a.crop = 0;
      visitAphids(w, a);
    }
  }
  assert.ok(e.honeyCollected > 0);
  assert.ok(e.sap > 0);
  assert.ok(Math.abs((initial - w.plants[0].biomass) * 25 - e.sap) < 1e-9);
  assert.ok(Math.abs(e.sap - e.assimilated - e.honeyProduced) < 1e-9);
  assert.ok(
    Math.abs(
      e.honeyProduced -
        e.honeyCollected -
        e.honeyLost -
        e.aphids.reduce((n, a) => n + a.honey, 0),
    ) < 1e-9,
  );
  const before = e.honeyProduced;
  w.plants[0].health = 0;
  for (let i = 0; i < 20; i++) updateAphids(w);
  assert.equal(e.honeyProduced, before);
});
test("honey collection is local and transfers exactly into crop plus visible cargo", () => {
  const { w, a, e } = ecologyFixture();
  e.aphids[0].honey = 0.5;
  const before = a.crop + a.carrying + e.aphids[0].honey;
  a.x = 4;
  assert.equal(visitAphids(w, a), false);
  assert.equal(e.honeyCollected, 0);
  a.x = 0;
  assert.equal(visitAphids(w, a), true);
  assert.equal(a.state, "Coletando melaço");
  assert.ok(a.crop > 0);
  assert.ok(a.carrying > 0);
  assert.ok(Math.abs(before - a.crop - a.carrying - e.aphids[0].honey) < 1e-12);
});
test("local protection costs energy and temporarily prevents a predator from eating aphids", () => {
  const { w, a, e } = ecologyFixture();
  const p = {
    id: 998,
    x: 0.25,
    z: 0,
    y: 0.008,
    energy: 60,
    angle: 0,
    cooldown: 0,
    prey: 0,
  };
  w.predators = [p];
  w.random = () => 0;
  const before = e.aphids[0].count;
  assert.ok(aphidPrey(w, p));
  assert.equal(e.aphids[0].count, before - 1);
  p.cooldown = 0;
  a.traits.courage = 1;
  const energy = a.energy;
  assert.equal(visitAphids(w, a), true);
  assert.ok(a.energy < energy);
  assert.ok(p.repelledUntil > w.tick);
  assert.equal(aphidPrey(w, p), null);
  const count = e.aphids[0].count;
  updatePredators(w, new Set());
  assert.equal(e.aphids[0].count, count);
  assert.ok(e.protected > 0);
});
test("ecological snapshots restore shared state and exactly reproduce the future", () => {
  const w = new World("ecology-save");
  w.step(180);
  const restored = World.restore(w.snapshot());
  w.step(60);
  restored.step(60);
  assert.deepEqual(restored.snapshot(), w.snapshot());
  assert.ok(w.ecology.sap > 0);
});

test("aphid populations cannot grow on an exhausted host even in favorable climate", () => {
  const { w, e } = ecologyFixture();
  w.plants[0].biomass = 0.05;
  e.aphids[0].count = 1;
  const before = e.aphids[0].count;
  for (let i = 0; i < 40; i++) updateAphids(w);
  assert.equal(e.sap, 0);
  assert.equal(e.honeyProduced, 0);
  assert.ok(e.aphids[0].count < before);
});
