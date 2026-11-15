import { laboratoryPreparationPlan } from "../src/modules/benchmarks/gautrais/laboratory/plan.ts";
import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { World } from "../src/modules/simulation/world.js";
import { sampleSoil, sampleSupport } from "../src/modules/terrain/field.ts";
import { laboratorySand } from "../src/modules/terrain/laboratory-field.ts";
import { validateLaboratoryGeometry } from "../src/modules/terrain/laboratory.ts";
import { prepareLaboratoryWorld } from "../src/modules/benchmarks/gautrais/laboratory/setup.ts";
import {
  legacyClockAudit,
  physicalScale,
  modelLength,
  volumeCm3,
  physicalDays,
  eventProbability,
} from "../src/modules/benchmarks/gautrais/laboratory/scale.ts";
import {
  sampleWorldSection,
  observeWorldSection,
} from "../src/modules/benchmarks/gautrais/observation/world-section.ts";
import { positionClear } from "../src/modules/navigation/collision.ts";
const options = {
  seed: "GAUTRAIS-K1-GEOMETRY",
  workers: 50,
  temperatureC: 24,
  humidityPercent: 80,
  coverThicknessMm: 1,
};
const close = (a, b, tolerance = 1e-10) =>
  assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);

test("laboratory geometry uses reported dimensions with explicit scale and unchanged worker phenotype", () => {
  for (const workers of [50, 100, 200]) {
    const { world, report } = prepareLaboratoryWorld({ ...options, workers }),
      g = world.nest.laboratory,
      mm = g.millimetersPerUnit;
    assert.equal(world.ants.length, workers);
    assert.ok(world.ants.every((a) => a.kind === "worker" && a.age === 20));
    close(g.sandRadius * mm, 100);
    close(g.sandDepth * mm, 5);
    close(g.arenaRadius * mm, 250);
    close(g.coverHalfWidth * mm, 125);
    assert.equal(report.physicalProtocolCompatible, false);
    assert.equal(report.physicalDynamicsIntegrated, false);
    assert.deepEqual(world.nest.nodes, []);
    assert.deepEqual(world.nest.links, []);
    assert.equal(world.soil.removed, 0);
    assert.equal(
      world.brood.length +
        world.plants.length +
        world.predators.length +
        world.patches.length,
      0,
    );
    assert.equal(
      world.landscape.ponds.length +
        world.landscape.logs.length +
        world.landscape.relief.length,
      0,
    );
    for (const a of world.ants) {
      const r = Math.hypot(a.x, a.z);
      assert.ok(r > g.sandRadius && r < g.arenaRadius);
      close(sampleSupport(world.nest, a).distance, 0.008);
      assert.ok(positionClear(world, a, a, a.angle, 0, a.normal, false));
      assert.ok(a.bodyScale >= 0.8 && a.bodyScale <= 1.6);
    }
    assert.deepEqual(
      prepareLaboratoryWorld({ ...options, workers }).world.snapshot(),
      world.snapshot(),
    );
  }
});

test("cylinder field, floor and finite cover have analytic distances and normals", () => {
  const { world } = prepareLaboratoryWorld(options),
    g = world.nest.laboratory;
  const middle = -g.sandDepth / 2;
  close(
    laboratorySand(g, { x: 0, y: middle, z: 0 }).distance,
    -g.sandDepth / 2,
  );
  const side = laboratorySand(g, { x: g.sandRadius + 1, y: middle, z: 0 });
  close(side.distance, 1);
  close(side.x, 1);
  close(side.y, 0);
  close(laboratorySand(g, { x: 0, y: -g.sandDepth - 0.1, z: 0 }).distance, 0.1);
  const under = sampleSupport(world.nest, {
    x: g.sandRadius + 0.5,
    y: -0.01,
    z: 0,
  });
  close(under.distance, 0.01);
  close(under.y, -1);
  const over = sampleSupport(world.nest, {
    x: 0,
    y: g.coverThickness + 0.02,
    z: 0,
  });
  close(over.distance, 0.02);
  close(over.y, 1);
  const beyond = sampleSupport(world.nest, {
    x: g.coverHalfWidth + 0.5,
    y: g.coverThickness / 2,
    z: 0,
  });
  assert.ok(beyond.distance > 0);
  close(
    volumeCm3(
      Math.PI * g.sandRadius * g.sandRadius * g.sandDepth,
      legacyClockAudit(5),
    ),
    Math.PI * 50,
  );
});

test("blank laboratory cuts do not turn exterior air into a peripheral gallery", () => {
  const { world } = prepareLaboratoryWorld(options),
    g = world.nest.laboratory;
  const section = {
    y: -g.sandDepth / 2,
    minX: -g.sandRadius,
    maxX: g.sandRadius,
    minZ: -g.sandRadius,
    maxZ: g.sandRadius,
    pitch: 0.1,
  };
  assert.ok(
    sampleWorldSection(world.nest, section).cells.every((v) => v === 0),
  );
  assert.equal(observeWorldSection(world.nest, section).metrics.nodes, 0);
  world.nest.nodes.push({
    x: g.sandRadius - 0.2,
    y: section.y,
    z: 0,
    r: 0.4,
    type: "chamber",
    name: "synthetic cut",
  });
  const read = observeWorldSection(world.nest, section);
  assert.equal(read.metrics.components, 1);
  assert.equal(read.metrics.cycleRank, 0);
  assert.equal(read.buhlComparable, false);
  assert.ok(
    sampleSoil(world.nest, { x: g.sandRadius - 0.2, y: section.y, z: 0 })
      .distance > 0,
  );
});

test("geometry preparations refuse both World advance paths before mutating clocks or RNG", () => {
  const { world } = prepareLaboratoryWorld(options),
    before = world.snapshot();
  assert.throws(() => world.step(), /physical clocks/);
  assert.throws(() => world.advance(), /physical clocks/);
  assert.deepEqual(world.snapshot(), before);
  assert.throws(() => World.restore(before), /not terrarium saves/);
  const legacy = new World("K1-LEGACY-SAVE");
  legacy.step();
  assert.deepEqual(
    World.restore(legacy.snapshot()).snapshot(),
    legacy.snapshot(),
  );
});

test("unit conversions expose the old clock mismatch and event probabilities compose across step sizes", () => {
  const audit = legacyClockAudit(5),
    scale = physicalScale(10, 0.05);
  assert.equal(audit.biologicalSecondsPerLegacyTick, 864);
  assert.equal(audit.movementReferenceSeconds, 0.05);
  assert.equal(audit.biologicalToMovementRatio, 17280);
  assert.equal(audit.physicalClockIntegrated, false);
  assert.equal(modelLength(25, scale), 2.5);
  assert.equal(volumeCm3(1, scale), 1);
  assert.equal(physicalDays(1728000, scale), 1);
  close(
    1 - Math.pow(1 - eventProbability(0.3, 0.01), 100),
    eventProbability(0.3, 1),
  );
  for (const value of [0, -1, NaN, Infinity])
    assert.throws(() => physicalScale(value, 1));
  assert.throws(() => eventProbability(-1, 1));
  assert.throws(() => physicalDays(0.5, scale));
});

test("legacy field has the same 4,800 samples as its pre-refactor source", () => {
  const rows = [];
  for (const seed of ["K1-LEGACY-A", "K1-LEGACY-B"]) {
    const w = new World(seed, {}, { founding: false });
    for (let i = 0; i < 1200; i++) {
      const p = {
        x: -11 + ((i * 1.618033988749895) % 1) * 22,
        y: -5 + ((i * 0.414213562373095) % 1) * 6,
        z: -8 + ((i * 0.732050807568877) % 1) * 16,
      };
      rows.push(sampleSoil(w.nest, p), sampleSupport(w.nest, p));
    }
  }
  // Generated with field.ts from 7fb8fb5691066d59c7374227fe4412f5937abacf.
  assert.equal(
    createHash("sha256").update(JSON.stringify(rows)).digest("hex"),
    "4ab1bd2217dee8d7379ff2a854544dc2a63e81508ca784b46e0c1616a455531f",
  );
});

test("invalid setup dimensions and cohors fail before any physical simulation", () => {
  for (const extra of [
    { workers: 500 },
    { temperatureC: NaN },
    { humidityPercent: 101 },
    { coverThicknessMm: 0 },
    { coverThicknessMm: 10 },
    { seed: "bad path" },
  ])
    assert.throws(() => prepareLaboratoryWorld({ ...options, ...extra }));
  const { world } = prepareLaboratoryWorld(options);
  assert.throws(() =>
    validateLaboratoryGeometry({ ...world.nest.laboratory, arenaRadius: 0 }),
  );
});

test("laboratory preparation plan bounds groups and does not depend on JSON key order", () => {
  const plan = {
    schema: "viveiro-world-laboratory-geometry-plan-v1",
    seed: options.seed,
    groups: [50, 100, 200],
    temperatureC: 24,
    humidityPercent: 80,
    coverThicknessMm: 1,
  };
  assert.deepEqual(
    laboratoryPreparationPlan(
      Object.fromEntries(Object.entries(plan).reverse()),
    ),
    plan,
  );
  for (const extra of [
    { groups: [50, 50] },
    { groups: [] },
    { groups: [500] },
    { groups: [50, 100, 200, 50] },
    { script: "ignored" },
    { coverThicknessMm: 5 },
  ])
    assert.throws(() => laboratoryPreparationPlan({ ...plan, ...extra }));
  assert.throws(() =>
    modelLength(1, { millimetersPerUnit: 0, secondsPerStep: 1 }),
  );
});
