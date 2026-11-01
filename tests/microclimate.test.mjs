import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { ensureSoilClimate } from "../src/modules/microclimate/initialize.ts";
import { transportSoilClimate } from "../src/modules/microclimate/transport.ts";
import { climateBoundaries } from "../src/modules/microclimate/boundaries.ts";
import { sampleClimate, cellIndex } from "../src/modules/microclimate/grid.ts";
const sum = (v) => v.reduce((a, b) => a + b, 0);
test("soil state is seeded independently and air humidity alone does not set pore water or temperature", () => {
  const a = new World("matrix", { humidity: 20 }),
    b = new World("matrix", { humidity: 90 }),
    rng = a.rng;
  assert.deepEqual(ensureSoilClimate(a), ensureSoilClimate(b));
  assert.equal(a.rng, rng);
  const c = new World("other-matrix");
  assert.notDeepEqual(ensureSoilClimate(a).water, ensureSoilClimate(c).water);
});
test("closed transport conserves water and heat and is stable for a large requested step", () => {
  const w = new World("closed-soil"),
    s = ensureSoilClimate(w);
  s.water = s.water.map((_, i) => (i % 7 === 0 ? 1 : 0) * s.capacity);
  s.temperature = s.temperature.map((_, i) => (i % 9 === 0 ? 45 : 10));
  const water = sum(s.water),
    heat = sum(s.temperature);
  transportSoilClimate(s, 500);
  assert.ok(Math.abs(sum(s.water) - water) < 1e-8);
  assert.ok(Math.abs(sum(s.temperature) - heat) < 1e-7);
  assert.ok(
    s.water.every((v) => Number.isFinite(v) && v >= 0 && v <= s.capacity),
  );
  assert.ok(s.temperature.every((v) => v >= 10 && v <= 45));
});
test("capillary redistribution can wet a dry upper layer while gravity biases wet water downward", () => {
  const w = new World("capillary"),
    s = ensureSoilClimate(w);
  s.water.fill(s.capacity * 0.1);
  const upper = cellIndex(s, 9, 2, 6),
    lower = cellIndex(s, 9, 3, 6);
  s.water[lower] = s.capacity * 0.9;
  const before = s.water[upper];
  transportSoilClimate(s, 100);
  assert.ok(s.water[upper] > before);
  const one = ensureSoilClimate(new World("drain")),
    two = structuredClone(one);
  one.water.fill(one.capacity * 0.6);
  two.water.fill(two.capacity * 0.6);
  transportSoilClimate(one, 100, true);
  transportSoilClimate(two, 100, false);
  assert.ok(
    one.water[cellIndex(one, 9, 7, 6)] > two.water[cellIndex(two, 9, 7, 6)],
  );
});
test("rain, ponds, evaporation and plants have explicit water and thermal boundary budgets", () => {
  const w = new World("boundaries"),
    s = ensureSoilClimate(w);
  w.landscape.rainPulse = 1;
  w.tick = 25;
  const before = sum(s.water),
    heat = sum(s.temperature);
  climateBoundaries(w, s, 10);
  assert.ok(s.rainIn > 0 && s.evaporated > 0 && s.plantUptake > 0);
  assert.ok(
    Math.abs(
      sum(s.water) -
        before -
        s.rainIn -
        s.pondIn +
        s.evaporated +
        s.plantUptake,
    ) < 1e-9,
  );
  assert.ok(
    Math.abs(sum(s.temperature) - heat - s.boundaryHeat + s.evaporativeHeat) <
      1e-7,
  );
  assert.ok(sampleClimate(s, { x: 0, y: -2, z: 0 }).water > 0);
});
test("temperature control changes heat exchange without rewriting stored water", () => {
  const a = new World("climate-param", { temperatureC: 15 }),
    b = new World("climate-param", { temperatureC: 35 }),
    one = ensureSoilClimate(a),
    two = ensureSoilClimate(b);
  assert.deepEqual(one.water, two.water);
  assert.ok(sum(two.temperature) > sum(one.temperature));
  const before = one.temperature.at(-1);
  a.params.temperatureC = 40;
  climateBoundaries(a, one, 1);
  assert.equal(one.temperature.at(-1), before);
});
