import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { colonyWorlds } from "../src/modules/colonies/types.ts";
import { family } from "./fixtures/family.mjs";
import { ensureSoilClimate } from "../src/modules/microclimate/initialize.ts";
import { updateLandscape } from "../src/modules/landscape/dynamics.ts";
test("climate is integrated once per global tick and restored as a shared field", () => {
  const { w } = family("climate-family");
  assert.equal(colonyWorlds(w).length, 2);
  w.step(30);
  const climate = w.microclimate;
  assert.ok(climate);
  assert.equal(climate.steps, 3);
  assert.ok(colonyWorlds(w).every((c) => c.microclimate === climate));
  const restored = World.restore(w.snapshot());
  assert.ok(
    colonyWorlds(restored).every(
      (c) => c.microclimate === restored.microclimate,
    ),
  );
  w.step(50);
  restored.step(50);
  assert.deepEqual(w.snapshot(), restored.snapshot());
  const c = w.microclimate;
  assert.ok(
    Math.abs(
      c.initialWater +
        c.rainIn +
        c.pondIn -
        c.evaporated -
        c.plantUptake -
        c.water.reduce((a, b) => a + b, 0),
    ) < 1e-7,
  );
  assert.ok(
    Math.abs(
      c.initialHeat +
        c.boundaryHeat -
        c.evaporativeHeat -
        c.temperature.reduce((a, b) => a + b, 0),
    ) < 1e-6,
  );
});
test("plants at different local soil samples react differently under the same air humidity", () => {
  const a = new World("local-growth"),
    b = World.restore(a.snapshot()),
    one = ensureSoilClimate(a),
    two = ensureSoilClimate(b);
  one.water.fill(one.capacity * 0.62);
  two.water.fill(two.capacity * 0.04);
  for (let i = 0; i < 200; i++) {
    updateLandscape(a);
    updateLandscape(b);
  }
  assert.ok(
    a.plants.reduce((n, p) => n + p.health, 0) >
      b.plants.reduce((n, p) => n + p.health, 0),
  );
  assert.equal(a.params.humidity, b.params.humidity);
});
test("rain and air temperature interventions preserve pore water memory and deterministic future", () => {
  const w = new World("climate-actions");
  w.step(40);
  const before = [...w.microclimate.water];
  w.intervene("temperatureC", 0, 0, 0);
  assert.equal(w.params.temperatureC, 5);
  w.intervene("temperatureC", 0, 0, 35);
  assert.deepEqual(w.microclimate.water, before);
  w.intervene("rain");
  w.step(30);
  assert.ok(w.microclimate.rainIn > 0);
  const r = World.restore(w.snapshot());
  w.step(50);
  r.step(50);
  assert.deepEqual(w.snapshot(), r.snapshot());
});
