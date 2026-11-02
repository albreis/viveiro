import { sampleSoil } from "../src/modules/terrain/field.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { updateNutrition } from "../src/modules/colony/nutrition.ts";
import { diseaseExposure } from "../src/modules/survival/disease.ts";
import { validateSurvival } from "../src/modules/survival/validation.ts";
import { survivalWorld, worker } from "./fixtures/survival.mjs";
test("queen consumes only physically accessible stock and pays for her crop", () => {
  const w = survivalWorld(),
    q = w.ants.find((a) => a.kind === "queen");
  q.crop = 0;
  w.queenHealth = 30;
  const food = w.food;
  updateNutrition(w);
  assert.ok(Math.abs(food - w.food - 0.3) < 1e-10);
  assert.ok(Math.abs(q.crop - 0.2994) < 1e-10);
  assert.ok(w.queenHealth > 30);
  const remote = survivalWorld(),
    r = remote.ants.find((a) => a.kind === "queen"),
    entry = remote.nest.nodes[0];
  Object.assign(r, { node: 0, x: entry.x, y: entry.y, z: entry.z, crop: 0 });
  remote.queenHealth = 30;
  const before = remote.food;
  updateNutrition(remote);
  assert.equal(remote.food, before);
  assert.equal(r.crop, 0);
  assert.ok(remote.queenHealth < 30);
});
test("local disease sampling uses one unchanged snapshot and cannot read distant infection", () => {
  const w = survivalWorld();
  w.nest.nodes = [];
  w.nest.links = [];
  w.nest.relief = [];
  const a = worker(w, 0, 0),
    b = worker(w, 0.2, 0),
    far = worker(w, 2, 0);
  w.ants = [a, b, far];
  b.life.infection = 1;
  const before = w.ants.map((a) => a.life.infection),
    pressure = diseaseExposure(w);
  assert.ok(pressure.get(a.id) > 0);
  assert.equal(pressure.get(far.id), 0);
  assert.deepEqual(
    w.ants.map((a) => a.life.infection),
    before,
  );
  w.ants.reverse();
  assert.deepEqual(diseaseExposure(w), pressure);
});
test("solid soil blocks short contact and carried contamination follows the carrier", () => {
  const w = survivalWorld(),
    a = worker(w, -0.2, 0),
    b = worker(w, 0.2, 0);
  Object.assign(a, { y: -0.52, angle: Math.PI });
  Object.assign(b, { y: -0.52, angle: 0 });
  w.nest.relief = [];
  w.nest.nodes = [
    { x: -0.2, y: -0.5, z: 0, r: 0.15, type: "chamber" },
    { x: 0.2, y: -0.5, z: 0, r: 0.15, type: "chamber" },
  ];
  w.nest.links = [];
  w.ants = [a, b];
  b.life.infection = 1;
  assert.ok(sampleSoil(w.nest, { x: 0, y: -0.4, z: 0 }).distance < -0.01);
  assert.equal(diseaseExposure(w).get(a.id), 0);
  w.nest.nodes = [];
  Object.assign(a, { x: 0, y: 0.008 });
  Object.assign(b, { x: 2, y: 0.008 });
  b.life.infection = 0;
  w.colony.waste = [
    {
      id: 900,
      x: 0,
      y: 0.03,
      z: 0,
      mass: 1,
      kind: "food",
      stored: false,
      carrier: b.id,
    },
  ];
  const pressure = diseaseExposure(w);
  assert.equal(pressure.get(a.id), 0);
  assert.ok(pressure.get(b.id) > 0);
});
test("risk profile removes the old hard worker age cap and records actual death causes", () => {
  const w = survivalWorld(),
    a = worker(w, -2, 2);
  a.age = 150;
  w.ants.push(a);
  w.step(1);
  assert.ok(w.ants.some((x) => x.id === a.id));
  const dying = worker(w, -3, 2);
  dying.energy = 0;
  w.ants.push(dying);
  w.step(1);
  assert.ok(!w.ants.some((x) => x.id === dying.id));
  assert.equal(w.colony.survival.causes.starvation, 1);
  assert.equal(w.deaths, 1);
  validateSurvival(w, true);
});
test("controlled challenge changes only a living selected subject and remains deterministic on restore", () => {
  const w = survivalWorld(),
    q = w.ants.find((a) => a.kind === "queen"),
    beforeFood = w.food;
  assert.equal(w.intervene("healthChallenge", 0, 0, q.id), true);
  assert.equal(q.life.infection, 0.5);
  assert.equal(w.food, beforeFood);
  assert.equal(w.colony.survival.challenges, 1);
  const frozen = w.snapshot();
  assert.equal(w.intervene("healthChallenge", 0, 0, -5), false);
  assert.deepEqual(w.snapshot(), frozen);
  const copy = World.restore(w.snapshot());
  w.step(140);
  copy.step(140);
  assert.deepEqual(w.snapshot(), copy.snapshot());
  const old = new World("legacy");
  const initial = old.snapshot();
  assert.equal(old.intervene("healthChallenge", 0, 0, 1), false);
  assert.deepEqual(old.snapshot(), initial);
});
test("missing physiological state, invalid loads or invented mortality counts are rejected", () => {
  const w = survivalWorld();
  for (const edit of [
    (x) => delete x.colony.survival,
    (x) => delete x.ants[0].life,
    (x) => (x.ants[0].life.infection = 1.01),
    (x) => (x.ants[0].life.ageBudget = 0),
    (x) => x.colony.survival.causes.disease++,
  ]) {
    const bad = w.snapshot();
    edit(bad);
    assert.throws(() => World.restore(bad), /saúde|mortalidade/);
  }
});

test("a fed established queen maintains herself from local stock without nurses in a controlled 25-day no-laying trial", () => {
  const w = survivalWorld(),
    q = w.ants.find((a) => a.kind === "queen");
  w.predators = [];
  w.lastLaying = 1e9;
  const initialFood = w.food;
  w.step(2500);
  assert.ok(w.ants.some((a) => a.id === q.id));
  assert.equal(w.ants.filter((a) => a.kind === "worker").length, 0);
  assert.ok(w.queenHealth > 99);
  assert.ok(w.food < initialFood);
  assert.ok(w.colony.stores.flows.care < 0);
  validateSurvival(w, true);
});
test("daughter retains her own physiology and does not reroll latent risks or copy maternal mortality counters", async () => {
  const { makeBrood } = await import("../src/modules/colony/brood.ts"),
    { hatchWorker } = await import("../src/modules/colony/hatching.ts"),
    { spawnDaughter } = await import("../src/modules/colonies/spawn.ts"),
    { takeStock } = await import("../src/modules/stores/ledger.ts");
  const w = survivalWorld(),
    gyne = hatchWorker(w, makeBrood(w, w.nextId++, 2, "gyne")),
    male = hatchWorker(w, makeBrood(w, w.nextId++, 2, "male"));
  takeStock(w, 10.2, "sexual");
  gyne.life.infection = 0.2;
  const before = structuredClone(gyne.life),
    entry = w.nest.nodes[0];
  for (const a of [gyne, male])
    Object.assign(a, {
      node: null,
      x: entry.x + 0.6,
      y: entry.y + 0.1,
      z: entry.z,
      route: [],
    });
  const child = spawnDaughter(w, w, gyne, male);
  assert.ok(child);
  assert.deepEqual(gyne.life, before);
  assert.notEqual(child.colony.survival, w.colony.survival);
  assert.equal(child.deaths, 0);
  const copy = World.restore(w.snapshot());
  assert.deepEqual(copy.colonies[0].ants[0].life, before);
  validateSurvival(copy, true);
  validateSurvival(copy.colonies[0], true);
});
