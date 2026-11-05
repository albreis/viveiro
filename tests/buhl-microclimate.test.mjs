import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BuhlMicroclimate,
  normalizeBuhlMicroclimate,
  walkingMmPerSecond,
} from "../src/modules/benchmarks/buhl-arena/microclimate.ts";
import { runBuhlLab } from "../src/modules/benchmarks/buhl-arena/run.ts";
import { motionWork } from "../src/modules/fatigue/motion-work.ts";

const climate = {
  temperatureC: 25,
  initialSandWaterFraction: 0.08,
  airRelativeHumidity: 0.65,
  airflowIndex: 0,
  drying: false,
};
const plan = {
  seed: "ARENA-MICROCLIMA-1",
  workers: 50,
  separationMm: 5,
  dryDensityMgPerMm3: 1.5,
  durationSeconds: 1200,
  sampleEverySeconds: 120,
  mechanism: "edge-follow",
  contactAccess: 0.35,
  observeActivity: true,
  microclimate: climate,
};

test("temperatura, teor de água e fluxo seguem vias separadas", () => {
  assert.deepEqual([16, 25, 30].map(walkingMmPerSecond), [8, 11.4, 15]);
  const still = new BuhlMicroclimate({ ...climate, drying: true }, 0.05);
  const wind = new BuhlMicroclimate(
    { ...climate, drying: true, airflowIndex: 1 },
    0.05,
  );
  const fixed = new BuhlMicroclimate({ ...climate, airflowIndex: 1 }, 0.05);
  assert.equal(fixed.waterFraction(144_000), 0.08);
  assert.equal(fixed.pelletTimeFactor(144_000), 1);
  assert.ok(wind.waterFraction(144_000) < still.waterFraction(144_000));
  assert.ok(wind.pelletTimeFactor(144_000) > still.pelletTimeFactor(144_000));
  assert.equal(
    new BuhlMicroclimate(
      { ...climate, initialSandWaterFraction: 0.04 },
      0.05,
    ).pelletTimeFactor(0),
    1.25,
  );
  assert.throws(
    () => normalizeBuhlMicroclimate({ ...climate, airflowIndex: 2 }),
    /airflowIndex/,
  );
  assert.equal(motionWork(10, 1), 2 * motionWork(10, 0));
});

test("vento com areia fixa preserva a trajetória, carga pesa na fadiga por ação", () => {
  const fatigue = { ...plan, digFatigue: "action-recovery" };
  const reference = runBuhlLab(fatigue);
  assert.deepEqual(
    reference,
    runBuhlLab({ ...fatigue, microclimate: { ...climate, airflowIndex: 1 } }),
  );
  const diggingOnly = runBuhlLab({ ...plan, digFatigue: "work-recovery" });
  assert.ok(
    reference.samples.at(-1).meanDigReadiness <
      diggingOnly.samples.at(-1).meanDigReadiness,
  );
  for (const sample of reference.samples) {
    assert.equal(
      sample.dugMicrograms,
      sample.carriedMicrograms + sample.depositedMicrograms,
    );
    assert.equal(sample.activity.removedMicrograms, sample.dugMicrograms);
  }
});
