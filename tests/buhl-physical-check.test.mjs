import assert from "node:assert/strict";
import test from "node:test";
import {
  BUHL_CURVE_HOURS,
  BUHL_GROUPS,
} from "../src/modules/benchmarks/buhl-2005-data.ts";
import { assessBuhlPhysicalSeries } from "../scripts/lib/buhl-physical-check.ts";

const synthetic = () => ({
  schema: "viveiro-buhl-arena-series-v1",
  protocol: "disco-fixo-2005",
  sourceFingerprint: "a".repeat(64),
  secondsPerTick: 0.2,
  geometryMm: { arenaDiameter: 500, sandDiameter: 200, sandThickness: 5 },
  timeUnit: "s",
  volumeUnit: "cm3",
  runs: BUHL_GROUPS.flatMap((group) =>
    Array.from({ length: 5 }, (_, i) => ({
      seed: "TESTE-" + i,
      workers: group.workers,
      samples: BUHL_CURVE_HOURS.map((hour, j) => ({
        timeSeconds: hour * 3600,
        voidVolumeCm3: group.curveCm3[j],
      })),
    })),
  ),
});

test("detecta saturação precoce e atraso mesmo com o mesmo volume final", () => {
  const data = synthetic();
  const reference = assessBuhlPhysicalSeries(data);
  assert.ok(reference.groups.every((g) => g.maeCm3 === 0));
  assert.equal(reference.calibrated, false);
  assert.ok(reference.scale.withinDigitizationBand);
  for (const run of data.runs) {
    run.samples[2].voidVolumeCm3 = run.samples.at(-1).voidVolumeCm3;
    run.samples[1].voidVolumeCm3 = 0;
  }
  const different = assessBuhlPhysicalSeries(data);
  for (const group of different.groups) {
    assert.ok(group.maeCm3 > 0);
    assert.equal(group.readBandCoverage, 4 / 6);
    assert.equal(group.earlyFraction[0].simulated, 1);
    assert.equal(group.articleFinal72h.withinDescriptiveBand, true);
  }
  assert.deepEqual(different.scale, reference.scale);
});

test("recusa unidades do terrário, horizonte parcial e pseudorréplicas", () => {
  const data = synthetic();
  assert.throws(
    () => assessBuhlPhysicalSeries({ ...data, volumeUnit: "u3" }),
    /arena física/,
  );
  assert.throws(
    () => assessBuhlPhysicalSeries({ ...data, runs: data.runs.slice(1) }),
    /cinco sementes/,
  );
  data.runs[0].samples[0].voidVolumeCm3 = 1;
  assert.throws(() => assessBuhlPhysicalSeries(data), /começar em zero/);
  data.runs[0].samples[0].voidVolumeCm3 = 0;
  data.runs[0].samples.pop();
  assert.throws(() => assessBuhlPhysicalSeries(data), /72 h/);
  data.runs[0] = structuredClone(data.runs[1]);
  assert.throws(() => assessBuhlPhysicalSeries(data), /Seed repetida/);
});
