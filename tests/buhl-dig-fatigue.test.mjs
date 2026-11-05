import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BUHL_DIG_FATIGUE,
  BuhlDigFatigue,
} from "../src/modules/benchmarks/buhl-arena/dig-fatigue.ts";
import {
  describeBuhlLab,
  runBuhlLab,
} from "../src/modules/benchmarks/buhl-arena/run.ts";
import { normalizeBuhlLabPlan } from "../src/modules/benchmarks/buhl-arena/settings.ts";

test("fadiga acumula trabalho individual e se recupera em tempo físico", () => {
  const dt = 0.05;
  const first = new BuhlDigFatigue(dt);
  const second = new BuhlDigFatigue(dt);
  const effort = BUHL_DIG_FATIGUE.workHalfResponseSeconds / dt;
  const halfLife = BUHL_DIG_FATIGUE.recoveryHalfLifeSeconds / dt;
  assert.equal(first.readiness(0), 1);
  first.recordWork(effort, effort);
  assert.equal(first.readiness(effort), 0.5);
  assert.equal(first.readiness(effort + halfLife), 2 / 3);
  assert.equal(first.readiness(effort + 2 * halfLife), 0.8);
  assert.equal(second.readiness(effort + 2 * halfLife), 1);
  first.recordWork(effort + halfLife, effort);
  assert.equal(first.readiness(effort + halfLife), 0.4);
});

test("lote com fadiga é determinístico e conserva massa e geometria", () => {
  const base = {
    seed: "ARENA-FADIGA-1",
    workers: 50,
    separationMm: 5,
    dryDensityMgPerMm3: 1.5,
    durationSeconds: 1200,
    sampleEverySeconds: 120,
    mechanism: "edge-follow",
    contactAccess: 0.35,
  };
  const fatigue = { ...base, digFatigue: "work-recovery" };
  const control = runBuhlLab(base);
  assert.equal(control.samples[0].meanDigReadiness, undefined);
  assert.equal(
    describeBuhlLab(normalizeBuhlLabPlan(base)).digFatigue,
    undefined,
  );
  const candidate = runBuhlLab(fatigue);
  assert.deepEqual(candidate, runBuhlLab(fatigue));
  assert.equal(candidate.samples[0].meanDigReadiness, 1);
  assert.ok(candidate.samples.at(-1).meanDigReadiness < 1);
  for (const sample of candidate.samples) {
    assert.ok(sample.meanDigReadiness > 0 && sample.meanDigReadiness <= 1);
    assert.equal(
      sample.dugMicrograms,
      sample.carriedMicrograms + sample.depositedMicrograms,
    );
    assert.equal(
      sample.initialSandCells,
      sample.remainingSandCells + sample.openedCells,
    );
    assert.equal(sample.trafficOpenedCells, 0);
  }
  assert.throws(
    () => normalizeBuhlLabPlan({ ...fatigue, mechanism: "edge-recruit" }),
    /fadiga/,
  );
  assert.throws(
    () => normalizeBuhlLabPlan({ ...fatigue, digFatigue: "desconhecida" }),
    /fadiga/,
  );
});
