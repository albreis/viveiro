import { test } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { seasonFixture } from "./fixtures/season.mjs";
import { advanceSeason, phaseFactors } from "../src/modules/seasons/machine.ts";
import { updateSeason, seasonFactors } from "../src/modules/seasons/update.ts";
import { updateBroodLifecycle } from "../src/modules/colony/lifecycle.ts";
import { advanceBroodDevelopment } from "../src/modules/development/update.ts";
import { World } from "../src/modules/simulation/world.js";
import { airNetwork } from "../src/modules/ventilation/network.ts";
import { syncGases } from "../src/modules/ventilation/state.ts";
import { respire } from "../src/modules/ventilation/respiration.ts";
import { gasBudget } from "../src/modules/ventilation/sensing.ts";
import { initializeSeason } from "../src/modules/seasons/update.ts";
const near = (a, b = 0) => assert.ok(Math.abs(a - b) < 1e-8, a + " != " + b);
test("warm long days cannot prevent endogenous reproductive dormancy or instantly reactivate it", () => {
  const { w } = seasonFixture(),
    s = w.colony.season;
  for (let tick = 1; tick <= 4500; tick++) advanceSeason(s, tick, 25, 18, true);
  assert.equal(s.phase, "dormant");
  assert.equal(s.chillTicks, 0);
  assert.equal(phaseFactors(s, 4500).laying, 0);
  for (let tick = 4501; tick <= 5500; tick++)
    advanceSeason(s, tick, 30, 18, true);
  assert.equal(s.phase, "dormant");
  assert.equal(s.cycles, 0);
});
test("persistent cold triggers preparation, accumulates chilling and permits only a gradual warm reactivation", () => {
  const { w } = seasonFixture(),
    s = w.colony.season;
  let tick = 0;
  while (s.phase !== "dormant" && tick < 1000)
    advanceSeason(s, ++tick, 8, 8, true);
  assert.equal(s.phase, "dormant");
  const entered = tick;
  for (let i = 0; i < 500; i++) advanceSeason(s, ++tick, 8, 8, true);
  assert.equal(s.chillTicks, 500);
  for (let i = 0; i < 99; i++) advanceSeason(s, ++tick, 25, 14, true);
  assert.equal(s.phase, "dormant");
  advanceSeason(s, ++tick, 25, 14, true);
  assert.equal(s.phase, "resuming");
  const start = tick;
  assert.equal(phaseFactors(s, tick).growth, 0);
  for (let i = 0; i < 100; i++) advanceSeason(s, ++tick, 25, 14, true);
  near(phaseFactors(s, tick).growth, 0.5);
  for (let i = 0; i < 100; i++) advanceSeason(s, ++tick, 25, 14, true);
  assert.equal(s.phase, "active");
  assert.equal(s.cycles, 1);
  assert.equal(s.activeTicks, 0);
  assert.ok(start > entered);
});
test("colder than the selected chilling window is not credited, and founding does not exhaust the post-foundation active timer", () => {
  const { w } = seasonFixture(),
    s = w.colony.season;
  for (let tick = 1; tick <= 5000; tick++)
    advanceSeason(s, tick, 25, 12, false);
  assert.equal(s.phase, "active");
  assert.equal(s.activeTicks, 0);
  s.phase = "dormant";
  s.since = 5000;
  for (let tick = 5001; tick <= 6000; tick++)
    advanceSeason(s, tick, 0, 8, true);
  assert.equal(s.chillTicks, 0);
});
test("dormant larvae remain arrested in warm conditions, pay reduced upkeep and survive the selected cold window while eggs are not protected by larval dormancy", () => {
  const { w, b, soil } = seasonFixture();
  w.colony.season.phase = "dormant";
  w.colony.season.since = 0;
  b.age = 0.4;
  w.food = 1;
  updateBroodLifecycle(w, 1);
  near(b.age, 0.4);
  near(w.food, 1 - 0.00012);
  assert.equal(w.brood.length, 1);
  soil.temperature.fill(8);
  for (let i = 0; i < 400; i++)
    assert.equal(advanceBroodDevelopment(w, b, 1), true);
  assert.equal(b.development.stress, 0);
  near(b.age, 0.4);
  b.age = 0;
  let alive = true;
  for (let i = 0; i < 400 && alive; i++)
    alive = advanceBroodDevelopment(w, b, 1);
  assert.equal(alive, false);
});
test("seasonal physiology scales oxygen demand with explicit gas budgets rather than creating gas or nutrient credits", () => {
  const active = seasonFixture(),
    sleeping = seasonFixture();
  sleeping.w.colony.season.phase = "dormant";
  const run = (f) => {
    const s = syncGases(f.w, airNetwork(f.w));
    respire(f.w, s, 10);
    near(gasBudget(s).oxygen);
    near(gasBudget(s).carbon);
    return s.consumed;
  };
  near(run(sleeping) / run(active), 0.2);
  near(seasonFactors(sleeping.w).larvalDemand, 0.1);
});
test("memory is restored exactly, interventions persist and impossible or incompatible memories are rejected", () => {
  const { w } = seasonFixture();
  w.brood = [];
  w.colony.season.phase = "dormant";
  w.colony.season.chillTicks = 300;
  w.intervene("photoperiodHours", 0, 0, 8);
  w.step(25);
  const raw = w.snapshot(),
    r = World.restore(raw);
  w.step(60);
  r.step(60);
  assert.ok(isDeepStrictEqual(w.snapshot(), r.snapshot()));
  assert.equal(r.params.photoperiodHours, 8);
  for (const mutate of [
    (s) => delete s.colony.season,
    (s) => (s.colony.season.chillTicks = -1),
    (s) => (s.colony.season.phase = "spring"),
    (s) => (s.biologicalProfile.version = 4),
  ]) {
    const bad = structuredClone(raw);
    mutate(bad);
    assert.throws(() => World.restore(bad), /sazonal/);
  }
  const cold = seasonFixture();
  cold.soil.temperature.fill(8);
  for (let i = 0; i < 200; i++) {
    cold.w.tick++;
    updateSeason(cold.w);
  }
  assert.equal(cold.w.colony.season.phase, "preparing");
});

test("unloaded workers physically return toward the nest under seasonal rest without a position snap", async () => {
  const { surfaceHeight } = await import("../src/modules/landscape/queries.ts");
  const { w } = seasonFixture(),
    entry = w.nest.nodes[0],
    a = w.makeAnt("worker", entry.x + 0.8, entry.z);
  a.y = surfaceHeight(w.nest.relief, a.x, a.z) + 0.008;
  a.node = null;
  a.route = [];
  a.lastEntrance = { node: 0, x: entry.x, z: entry.z };
  a.crop = 0.3;
  w.ants = w.ants.filter((x) => x.kind === "queen");
  w.ants.push(a);
  w.brood = [];
  w.colony.season.phase = "dormant";
  w.colony.season.since = 0;
  let maxStep = 0;
  for (let i = 0; i < 400; i++) {
    const before = { x: a.x, y: a.y, z: a.z };
    w.step();
    maxStep = Math.max(
      maxStep,
      Math.hypot(a.x - before.x, a.y - before.y, a.z - before.z),
    );
  }
  assert.ok(a.node !== null);
  assert.ok((a.distanceWalked || 0) > 0.2);
  assert.ok(maxStep < 0.13);
  assert.equal(w.colony.season.phase, "dormant");
});
