import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ageScale,
  ageSurvival,
  infectionInterval,
} from "../src/modules/survival/curves.ts";
import { updateLife, recordMortality } from "../src/modules/survival/update.ts";
import {
  SURVIVAL_PARAMETERS as p,
  DEATH_CAUSES,
} from "../src/modules/survival/types.ts";
import { survivalWorld, worker } from "./fixtures/survival.mjs";
test("seeded synthetic cohorts follow conditional Weibull survival without a fixed maximum age", () => {
  for (const kind of ["queen", "worker"]) {
    const w = survivalWorld(),
      ants = Array.from({ length: 4096 }, () => w.makeAnt(kind, 0, 0));
    for (const multiple of [0.5, 1, 1.5]) {
      const days = ageScale(kind) * multiple;
      w.tick = days * 100;
      let alive = 0;
      for (const a of ants) {
        a.age = days;
        if (updateLife(w, a, 0) === null) alive++;
      }
      assert.ok(Math.abs(alive / ants.length - ageSurvival(days, kind)) < 0.03);
    }
    assert.ok(ageSurvival(ageScale(kind) * 2, kind) > 0);
    assert.ok(ageSurvival(0, kind) === 1);
  }
});
test("infection stays bounded and integrated disease exposure is independent of splitting a fixed interval", () => {
  for (const exposure of [0, 0.1, 4]) {
    const all = infectionInterval(0.4, exposure, 0.08, 20);
    let infection = 0.4,
      integral = 0;
    for (let i = 0; i < 200; i++) {
      const part = infectionInterval(infection, exposure, 0.08, 0.1);
      infection = part.infection;
      integral += part.integral;
    }
    assert.ok(infection >= 0 && infection <= 1);
    assert.ok(Math.abs(infection - all.infection) < 1e-10);
    assert.ok(Math.abs(integral - all.integral) < 1e-10);
  }
});
test("body repair is limited by food and spends crop exactly once per biological interval", () => {
  const w = survivalWorld(),
    a = worker(w);
  a.health = 60;
  a.crop = 0.3;
  a.age = 1;
  w.tick = 100;
  assert.equal(updateLife(w, a, 0), null);
  assert.ok(Math.abs(a.health - 62) < 1e-10);
  assert.ok(Math.abs(a.crop - 0.29) < 1e-10);
  assert.ok(Math.abs(a.life.repairFood - 0.01) < 1e-10);
  const before = structuredClone(a);
  updateLife(w, a, 0);
  assert.deepEqual(a, before);
  const b = worker(w);
  b.health = 60;
  b.crop = 0;
  b.age = 1;
  w.tick = 200;
  updateLife(w, b, 0);
  assert.equal(b.health, 60);
  assert.equal(b.life.repairFood, 0);
});
test("claustral queen repair uses finite maternal maintenance when her crop is empty", () => {
  const w = survivalWorld(true),
    q = w.ants.find((a) => a.kind === "queen");
  w.founding.phase = "claustral";
  q.crop = 0;
  q.health = 60;
  q.age = 1;
  q.life.ageBudget = 100;
  w.tick = 100;
  const reserve = w.founding.reserves;
  updateLife(w, q, 0);
  assert.ok(q.health > 60);
  assert.ok(w.founding.reserves < reserve);
  assert.ok(Math.abs(reserve - w.founding.reserves - q.life.repairFood) < 1e-9);
});
test("infertility is independent of queen vitality while disease and trauma have distinct endpoints", () => {
  const w = survivalWorld(),
    q = w.ants.find((a) => a.kind === "queen"),
    pool = w.colony.fertility.pools[0];
  pool.lost += pool.viable;
  pool.viable = 0;
  q.age = 1;
  w.tick = 100;
  assert.equal(updateLife(w, q, 0), null);
  assert.equal(q.health, 100);
  assert.equal(w.queenHealth, 100);
  q.life.diseaseBudget = 0.001;
  assert.equal(updateLife({ ...w, tick: 200 }, q, 4), "disease");
  q.health = 0;
  assert.equal(updateLife(w, q, 0), "combat");
});
test("competing death counters record each body once and keep the world total consistent", () => {
  const w = survivalWorld();
  for (const cause of DEATH_CAUSES) {
    const a = worker(w);
    a.deathCause = cause;
    recordMortality(w, a);
    recordMortality(w, a);
    assert.equal(w.colony.survival.causes[cause], 1);
  }
  assert.equal(w.deaths, DEATH_CAUSES.length);
});
