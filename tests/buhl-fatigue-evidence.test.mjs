import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { readCsv } from "../src/libs/csv-reader.ts";
import { BUHL_DISK_MM } from "../src/modules/benchmarks/buhl-arena/geometry.ts";
import { assessBuhlPhysicalSeries } from "../scripts/lib/buhl-physical-check.ts";

const read = (name) =>
  readFileSync(
    new URL("../docs/validacoes/buhl-fadiga-" + name, import.meta.url),
    "utf8",
  );

test("a comparação de fadiga é reproduzida a partir das duas séries publicadas", () => {
  const receipt = JSON.parse(read("comparacao-72h.json"));
  const reconstructed = {};
  for (const arm of ["controle", "local"]) {
    const raw = read(arm + "-72h.csv").replaceAll("\r\n", "\n");
    assert.equal(
      createHash("sha256").update(raw).digest("hex"),
      receipt.arms[arm].publishedSeriesSha256Lf,
    );
    const [columns, ...rows] = readCsv(raw);
    const runs = new Map();
    for (const [workersText, seed, ...values] of rows) {
      const workers = Number(workersText);
      const key = workers + "/" + seed;
      if (!runs.has(key)) runs.set(key, { workers, seed, samples: [] });
      const sample = Object.fromEntries(
        columns
          .slice(2)
          .map((name, i) => [
            name,
            values[i] === "" ? null : Number(values[i]),
          ]),
      );
      assert.equal(
        sample.dugMicrograms,
        sample.carriedMicrograms + sample.depositedMicrograms,
      );
      assert.equal(
        sample.initialSandCells,
        sample.remainingSandCells + sample.openedCells,
      );
      assert.equal(sample.trafficOpenedCells, 0);
      if (arm === "local")
        assert.ok(sample.meanDigReadiness > 0 && sample.meanDigReadiness <= 1);
      else assert.equal(sample.meanDigReadiness, null);
      runs.get(key).samples.push(sample);
    }
    const plan = JSON.parse(read(arm + "-plano.json"));
    assert.deepEqual(
      [...runs.keys()],
      plan.seeds.flatMap((seed) =>
        plan.groups.map((group) => group + "/" + seed),
      ),
    );
    const times = Array.from({ length: 217 }, (_, i) => i * 1200);
    for (const run of runs.values())
      assert.deepEqual(
        run.samples.map((sample) => sample.timeSeconds),
        times,
      );
    const diagnosis = assessBuhlPhysicalSeries({
      schema: "viveiro-buhl-arena-series-v1",
      protocol: "disco-fixo-2005",
      geometryMm: BUHL_DISK_MM,
      timeUnit: "s",
      volumeUnit: "cm3",
      secondsPerTick: plan.settings.tickMilliseconds / 1000,
      sourceFingerprint: receipt.sourceFingerprint,
      runs: [...runs.values()],
    });
    assert.deepEqual(diagnosis.groups, receipt.arms[arm].groups);
    assert.deepEqual(diagnosis.scale, receipt.arms[arm].scale);
    reconstructed[arm] = runs;
  }
  for (const comparison of receipt.comparisons) {
    for (const pair of comparison.pairs) {
      for (const arm of ["controle", "local"]) {
        const samples = reconstructed[arm].get(
          comparison.workers + "/" + pair.seed,
        ).samples;
        const at = (time) =>
          samples.find((sample) => sample.timeSeconds === time).voidVolumeCm3;
        assert.equal(pair[arm].volume12hCm3, at(43200));
        assert.equal(pair[arm].volume72hCm3, at(259200));
        assert.equal(
          pair[arm].lateRateCm3PerHour,
          (at(259200) - at(172800)) / 24,
        );
      }
      assert.equal(
        pair.deltaVolume72hCm3,
        pair.local.volume72hCm3 - pair.controle.volume72hCm3,
      );
    }
  }
  const checks = receipt.criteria;
  const byGroup = (arm, workers) =>
    receipt.arms[arm].groups.find((group) => group.workers === workers);
  const average = (values) =>
    values.reduce((sum, value) => sum + value, 0) / values.length;
  let closer = 0;
  for (const comparison of receipt.comparisons) {
    const { workers, pairs } = comparison;
    const control = byGroup("controle", workers);
    const fatigue = byGroup("local", workers);
    const controlRate = average(
      pairs.map((pair) => pair.controle.lateRateCm3PerHour),
    );
    const fatigueRate = average(
      pairs.map((pair) => pair.local.lateRateCm3PerHour),
    );
    const referenceRate =
      (control.curve.at(-1).readCm3 -
        control.curve.find((point) => point.hour === 48).readCm3) /
      24;
    assert.equal(comparison.lowerMae, fatigue.maeCm3 < control.maeCm3);
    assert.equal(comparison.earlyWithin, fatigue.curve[1].within);
    assert.equal(
      comparison.lateCloser,
      Math.abs(fatigueRate - referenceRate) <
        Math.abs(controlRate - referenceRate),
    );
    closer += Number(comparison.lateCloser);
  }
  assert.equal(
    checks.allLowerMae,
    receipt.comparisons.every((group) => group.lowerMae),
  );
  assert.equal(
    checks.allEarlyWithin,
    receipt.comparisons.every((group) => group.earlyWithin),
  );
  assert.equal(checks.groupsWithCloserLateRate, closer);
  assert.equal(
    receipt.qualifiesForNewEvaluation,
    checks.allLowerMae &&
      checks.allEarlyWithin &&
      checks.groupsWithCloserLateRate >= 2,
  );
  assert.equal(receipt.runCount, 30);
  assert.equal(receipt.sampleCount, 6510);
  assert.equal(receipt.calibrated, false);
  assert.equal(receipt.independentEmpiricalValidation, false);
});
