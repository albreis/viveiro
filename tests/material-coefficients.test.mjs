import { test } from "node:test";
import assert from "node:assert/strict";
import {
  transportFactors,
  roofFactors,
} from "../src/modules/soil-material/coefficients.ts";
import { transportSoilClimate } from "../src/modules/microclimate/transport.ts";
import { climateBoundaries } from "../src/modules/microclimate/boundaries.ts";
import { roofStrength } from "../src/modules/structure/strength.ts";
const cell = () => ({
  version: 1,
  width: 2,
  layers: 2,
  rows: 1,
  depth: 2,
  capacity: 1,
  surface: [0, 0],
  water: [0.9, 0.1, 0.8, 0.2],
  temperature: [10, 30, 20, 40],
  initialWater: 2,
  rainIn: 0,
  pondIn: 0,
  evaporated: 0,
  plantUptake: 0,
  initialHeat: 100,
  boundaryHeat: 0,
  evaporativeHeat: 0,
  steps: 0,
});
const sum = (a) => a.reduce((n, v) => n + v, 0);
test("reference indices preserve the old transport and roof equations exactly", () => {
  const m = { clay: 0.35, packing: 0.5 };
  assert.deepEqual(transportFactors(m), { capillary: 1, drainage: 1, heat: 1 });
  for (const water of [0, 0.55, 0.9, 1])
    assert.deepEqual(roofFactors(m, water), { density: 1, cohesion: 1 });
  const a = cell(),
    b = cell();
  transportSoilClimate(a, 100);
  transportSoilClimate(b, 100, true, transportFactors(m));
  assert.deepEqual(a, b);
  const roof = { depth: 1.4, span: 1, thickness: 0.35, abutment: 0.4 };
  assert.deepEqual(
    roofStrength(roof, 0.6, 36),
    roofStrength(roof, 0.6, 36, 1, roofFactors(m, 0.6)),
  );
});
test("packing and clay alter separate water terms rather than rewriting humidity or stored water", () => {
  const loose = transportFactors({ clay: 0.35, packing: 0 }),
    packed = transportFactors({ clay: 0.35, packing: 1 }),
    fine = transportFactors({ clay: 1, packing: 0.5 });
  assert.ok(packed.capillary < loose.capillary);
  assert.ok(packed.drainage < loose.drainage);
  assert.ok(packed.heat > loose.heat);
  assert.ok(fine.drainage < 1 && fine.capillary > 1);
  const a = cell(),
    b = cell();
  transportSoilClimate(a, 50, false, loose);
  transportSoilClimate(b, 50, false, packed);
  assert.ok(
    Math.abs(a.water[0] - a.water[1]) < Math.abs(b.water[0] - b.water[1]),
  );
});
test("all extreme material settings conserve closed water and heat and remain bounded for a large step", () => {
  for (const clay of [0, 0.35, 1])
    for (const packing of [0, 0.5, 1]) {
      const s = cell();
      transportSoilClimate(s, 500, true, transportFactors({ clay, packing }));
      assert.ok(Math.abs(sum(s.water) - 2) < 1e-10);
      assert.ok(Math.abs(sum(s.temperature) - 100) < 1e-10);
      assert.ok(s.water.every((v) => v >= 0 && v <= 1));
      assert.ok(s.temperature.every((v) => v >= 10 && v <= 40));
    }
});
test("reduced surface infiltration changes counted inflow, not pore capacity or an untracked water sink", () => {
  const w = {
      tick: 0,
      params: { humidity: 100, light: 0, temperatureC: 24 },
      landscape: { rainPulse: 1, ponds: [] },
      plants: [],
    },
    a = cell(),
    b = cell();
  a.water.fill(0);
  b.water.fill(0);
  const m = transportFactors({ clay: 1, packing: 1 });
  climateBoundaries(w, a, 10);
  climateBoundaries(w, b, 10, Math.min(1, m.drainage));
  assert.ok(b.rainIn < a.rainIn);
  assert.equal(a.capacity, b.capacity);
  assert.ok(Math.abs(sum(b.water) - b.rainIn) < 1e-12);
});
test("roof loading and cohesive capacity respond to material and wet softening without guaranteeing stability", () => {
  const roof = { depth: 1.4, span: 1.2, thickness: 0.25, abutment: 0.3 },
    m = { clay: 0.9, packing: 0.9 };
  const base = roofStrength(roof, 0.55, 36),
    changed = roofStrength(roof, 0.55, 36, 1, roofFactors(m, 0.55));
  assert.notEqual(base.load, changed.load);
  assert.notEqual(base.capacity, changed.capacity);
  assert.ok(roofFactors(m, 1).cohesion < roofFactors(m, 0.55).cohesion);
  assert.ok(Number.isFinite(changed.safety));
});
