import { test } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { developmentFixture } from "./fixtures/development.mjs";
import { thermalRate, waterRate } from "../src/modules/development/curves.ts";
import { advanceBroodDevelopment } from "../src/modules/development/update.ts";
import { updateBroodLifecycle } from "../src/modules/colony/lifecycle.ts";
import { initializeBroodDevelopment } from "../src/modules/development/initialize.ts";
import { climateCell } from "../src/modules/microclimate/grid.ts";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
import { maternalBalance } from "../src/modules/maternal/pools.ts";
test("cardinal thermal response is finite, bounded and slower beyond its chosen peak; pore water is a separate bounded proxy", () => {
  for (let t = -100; t <= 100; t += 0.1) {
    const r = thermalRate(t);
    assert.ok(Number.isFinite(r) && r >= 0 && r <= 1);
  }
  assert.equal(thermalRate(25), 1);
  assert.equal(thermalRate(10), 0);
  assert.equal(thermalRate(38), 0);
  assert.equal(thermalRate(100), 0);
  assert.equal(thermalRate(NaN), 0);
  assert.ok(thermalRate(35) < thermalRate(25));
  assert.equal(waterRate(0), 0);
  assert.equal(waterRate(1), 0);
  assert.equal(waterRate(0.55), 1);
});
test("actual stage transitions follow the chosen reference durations while cold and excess warmth slow maturation", () => {
  const run = (t) => {
    const { w, b } = developmentFixture(t);
    let ticks = 0;
    while (b.age < 1.3 && ticks < 5000) {
      ticks++;
      assert.equal(advanceBroodDevelopment(w, b, 1), true);
    }
    return { ticks, b };
  };
  const ideal = run(25),
    cold = run(20),
    warm = run(35),
    g = ideal.b.development.growthFactor;
  assert.ok(
    Math.abs(
      ideal.ticks - (Math.ceil(50 / g) + Math.ceil(80 / g) + Math.ceil(60 / g)),
    ) <= 3,
  );
  assert.ok(cold.ticks > ideal.ticks && warm.ticks > ideal.ticks);
  assert.equal(ideal.b.age, 1.3);
});
test("unpaid larvae stop growing; partial paid food supports partial growth and is consumed once by the colony", () => {
  const empty = developmentFixture(),
    partial = developmentFixture(),
    full = developmentFixture();
  for (const f of [empty, partial, full]) {
    f.b.age = 0.35;
    f.w.food = 0;
  }
  empty.w.food = 0;
  partial.w.food = 0.0006;
  full.w.food = 0.0012;
  for (const f of [empty, partial, full]) updateBroodLifecycle(f.w, 1);
  assert.equal(empty.b.age, 0.35);
  assert.ok(partial.b.age > 0.35 && partial.b.age < full.b.age);
  assert.equal(partial.w.food, 0);
  assert.equal(full.w.food, 0);
});
test("sensing follows the carrier locally; extreme heat arrests growth and sustained stress loses brood without refunding food", () => {
  const { w, b, soil } = developmentFixture(),
    carrier = w.makeAnt("worker", 6, 3);
  carrier.y = -1;
  w.ants.push(carrier);
  b.carrier = carrier.id;
  carrier.carryingBrood = b.id;
  assert.notEqual(climateCell(soil, b), climateCell(soil, carrier));
  soil.temperature[climateCell(soil, carrier)] = 45;
  advanceBroodDevelopment(w, b, 1);
  assert.equal(b.development.lastTemperature, 45);
  assert.equal(b.development.lastRate, 0);
  assert.equal(b.age, 0);
  b.development.stress = 0.999;
  w.food = 0;
  updateBroodLifecycle(w, 1);
  assert.equal(w.brood.length, 0);
  assert.equal(w.colony.broodLosses, 1);
  assert.equal(w.food, 0);
  assert.equal(carrier.carryingBrood, undefined);
  assert.ok(w.colony.waste.some((x) => x.kind === "corpse"));
});
test("individual and genetic growth variation is reproducible without advancing the world random stream", () => {
  const a = developmentFixture(),
    b = developmentFixture(),
    before = a.w.rng;
  initializeBroodDevelopment(a.w, a.b);
  assert.equal(a.w.rng, before);
  assert.deepEqual(a.b.development, b.b.development);
  assert.ok(
    a.b.development.growthFactor >= 0.855 &&
      a.b.development.growthFactor <= 1.155,
  );
});
test("maturation state keeps an exact future through restore and rejects missing, corrupt or incompatible records", () => {
  const { w } = developmentFixture();
  w.step(80);
  const raw = w.snapshot(),
    r = World.restore(raw);
  w.step(120);
  r.step(120);
  assert.ok(isDeepStrictEqual(w.snapshot(), r.snapshot()));
  assert.ok(raw.brood.length);
  for (const mutate of [
    (s) => delete s.brood[0].development,
    (s) => (s.brood[0].development.stress = -1),
    (s) => (s.brood[0].development.growthFactor = 8),
    (s) => (s.biologicalProfile.version = 3),
  ]) {
    const bad = structuredClone(raw);
    mutate(bad);
    assert.throws(() => World.restore(bad), /maturação/);
  }
});
test("a thermal profile still finances the first workers and physically reopens its entrance with closed material and nutrient ledgers", () => {
  const w = new World(
    "a",
    { humidity: 68 },
    { biologicalProfile: profileReference("generic-demo", 4) },
  );
  while (w.tick < 7000 && !["established", "failed"].includes(w.founding.phase))
    w.step();
  assert.equal(w.founding.phase, "established");
  assert.ok(w.founding.nanitics > 0);
  assert.equal(w.founding.seal.phase, "opened");
  assert.ok(Math.abs(soilBalance(w).error) < 1e-7);
  assert.ok(Math.abs(maternalBalance(w.founding.maternal).error) < 1e-7);
  console.log(
    JSON.stringify({
      profile: 4,
      established: w.tick,
      nanitics: w.founding.nanitics,
      reserve: w.founding.reserves,
    }),
  );
});
