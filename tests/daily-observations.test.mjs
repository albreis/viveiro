import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { family } from "./fixtures/family.mjs";
import { createLessonSession } from "../src/modules/lessons/recipe.ts";
import { measureDaily } from "../src/modules/observations/measure.ts";
import { recordDaily } from "../src/modules/observations/record.ts";
import { DAILY_LIMIT } from "../src/modules/observations/types.ts";
import { validateDaily } from "../src/modules/observations/validation.ts";
import {
  dailyCsv,
  csvCell,
  scenarioSamples,
} from "../src/modules/observations/csv.ts";
import { normalizeSession } from "../src/modules/persistence/validation.ts";
import {
  createCheckpoint,
  decodeCheckpoint,
} from "../src/modules/persistence/codec.ts";
const bare = () => ({
  seed: "seed",
  tick: 0,
  ants: [{}],
  brood: [],
  food: 2,
  colony: {},
  params: { temperatureC: 24 },
});
const session = (w) => ({
  version: 1,
  world: w.snapshot(),
  scenario: "a",
  initial: { seed: w.seed, params: w.params },
  interventions: [],
  running: false,
  replaying: false,
  replayIndex: 0,
});

test("same-tick observation aggregates colonies and weights gases by volume; missing fields stay null", () => {
  const w = bare();
  assert.equal(measureDaily(w).oxygenPercent, null);
  assert.equal(measureDaily(w).soilTemperatureC, null);
  w.colonies = [
    {
      ...bare(),
      ants: [{}, {}],
      food: 4,
      colony: { reproductiveFood: 3 },
      brood: [{ age: 0 }, { age: 0.55 }, { age: 1.35 }],
    },
  ];
  w.microclimate = { temperature: [10, 20, 30] };
  w.gases = {
    cells: [
      { volume: 1, oxygen: 0.2, carbon: 0.01 },
      { volume: 3, oxygen: 0.3, carbon: 0.03 },
    ],
  };
  const before = JSON.stringify(w),
    p = measureDaily(w);
  assert.equal(p.population, 3);
  assert.equal(p.colonies, 2);
  assert.equal(p.food, 9);
  assert.equal(p.brood, 3);
  assert.deepEqual([p.eggs, p.larvae, p.pupae], [1, 1, 1]);
  assert.equal(p.soilTemperatureC, 20);
  assert.equal(p.oxygenPercent, 12.5);
  assert.equal(p.carbonDioxidePercent, 1);
  assert.equal(JSON.stringify(w), before);
});
test("daily endpoints survive irregular chart records and do not duplicate or backfill", () => {
  const w = new World("daily-boundaries");
  w.step(37);
  w.record();
  w.step(164);
  assert.deepEqual(
    w.dailyObservations.points.map((p) => p.tick),
    [0, 100, 200],
  );
  const before = w.snapshot();
  measureDaily(w);
  dailyCsv([{ id: "a", world: w }]);
  assert.deepEqual(w.snapshot(), before);
  const legacy = w.snapshot();
  delete legacy.dailyObservations;
  const restored = World.restore(legacy);
  assert.equal(restored.dailyObservations, undefined);
  restored.step(99);
  assert.equal(restored.dailyObservations.startedTick, 202);
  assert.deepEqual(
    restored.dailyObservations.points.map((p) => p.tick),
    [300],
  );
});
test("recording replaces a prepared initial sample and retains a bounded series with explicit losses", () => {
  const w = bare();
  recordDaily(w);
  w.food = 5;
  recordDaily(w);
  assert.equal(w.dailyObservations.points.length, 1);
  assert.equal(w.dailyObservations.points[0].food, 5);
  for (let day = 1; day <= DAILY_LIMIT + 1; day++) {
    w.tick = day * 100;
    recordDaily(w);
  }
  assert.equal(w.dailyObservations.points.length, DAILY_LIMIT);
  assert.equal(w.dailyObservations.discarded, 2);
  assert.equal(w.dailyObservations.points[0].tick, 200);
  validateDaily(w.dailyObservations, w.tick);
});
test("lesson samples represent the final prepared physics and population in both scenarios", () => {
  const s = createLessonSession({ id: "entradas-ar", version: 2 });
  for (const w of [s.world, s.comparison]) {
    assert.deepEqual(w.dailyObservations.points, [measureDaily(w)]);
    assert.equal(w.dailyObservations.points[0].population, 17);
    assert.notEqual(w.dailyObservations.points[0].oxygenPercent, null);
  }
});
test("checkpoint roundtrip and continuation preserve observations, physics and exact RNG", () => {
  const { w } = family("daily-checkpoint");
  w.step(115);
  const state = decodeCheckpoint(
    createCheckpoint(session(w), {
      id: "daily",
      sequence: 1,
      createdAt: 1,
      kind: "manual",
      label: "Daily",
    }),
  );
  const restored = World.restore(state.world);
  assert.deepEqual(restored.snapshot(), w.snapshot());
  for (let i = 0; i < 110; i++) {
    dailyCsv([{ id: "a", world: w }]);
    w.step();
    restored.step();
  }
  assert.deepEqual(w.snapshot(), restored.snapshot());
});
test("malformed observations fail import and restore before replacing a world", () => {
  const base = new World("daily-corrupt").snapshot();
  for (const edit of [
    (s) => s.points.push({ ...s.points[0] }),
    (s) => (s.points[0].tick = 100),
    (s) => (s.points[0].food = NaN),
    (s) => (s.points[0].population = -1),
    (s) => (s.points[0].eggs = 5),
    (s) => (s.points[0].modelVersion = "=BAD()"),
    (s) => (s.points[0].oxygenPercent = "oops"),
    (s) => (s.startedTick = 1),
    (s) => (s.points = {}),
  ]) {
    const value = structuredClone(base);
    edit(value.dailyObservations);
    assert.throws(() => World.restore(value), /diária/);
    assert.throws(
      () => normalizeSession({ ...session(new World("valid")), world: value }),
      /diária|Número inválido/,
    );
  }
});
test("CSV distinguishes daily endpoints, current observations, A/B, missing data and formula-safe text", () => {
  const a = bare();
  a.seed = '=SUM(1,2)\n"teste"';
  recordDaily(a);
  a.tick = 23;
  const b = bare();
  b.seed = "á,β";
  b.tick = 50;
  const before = JSON.stringify([a, b]);
  const csv = dailyCsv(
    [
      { id: "a", world: a },
      { id: "b", world: b },
    ],
    "aula@2",
  );
  assert.ok(csv.startsWith("\ufeff"));
  assert.ok(csv.endsWith("\r\n"));
  assert.ok(csv.includes('"\'=SUM(1,2)\n""teste"""'));
  assert.ok(csv.includes('"A","aula@2","estado_inicial"'));
  assert.ok(csv.includes('"B","aula@2","instantaneo_atual",50,0,50,0.5'));
  assert.ok(csv.includes(",24,,,\r\n"));
  assert.equal(JSON.stringify([a, b]), before);
  assert.equal(scenarioSamples(a).length, 2);
  assert.equal(scenarioSamples(b).length, 1);
  for (const v of ["=1", "+1", "-1", "@x", " \t=1", "\r+2"])
    assert.ok(csvCell(v).startsWith("\"'"));
  assert.equal(csvCell(-5), "-5");
  assert.throws(() => csvCell(NaN), /finita/);
});
