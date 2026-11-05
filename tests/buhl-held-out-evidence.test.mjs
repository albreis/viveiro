import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assessBuhlPhysicalSeries } from "../scripts/lib/buhl-physical-check.ts";
import { BUHL_DISK_MM } from "../src/modules/benchmarks/buhl-arena/geometry.ts";

const readEvidence = (name) =>
  readFileSync(new URL("../docs/validacoes/" + name, import.meta.url), "utf8");

test("reproduz o diagnóstico de 72 h com a série arquivada", () => {
  const report = JSON.parse(readEvidence("buhl-arena-reservado-72h.json"));
  const plan = JSON.parse(readEvidence("buhl-arena-reservado-plano.json"));
  const csv = readEvidence("buhl-arena-reservado-72h.csv").replaceAll(
    "\r\n",
    "\n",
  );
  assert.equal(
    createHash("sha256").update(csv).digest("hex"),
    report.publishedSeriesSha256Lf,
  );
  const [header, ...lines] = csv.trimEnd().split("\n");
  const columns = header.split(",");
  const runs = new Map();
  for (const line of lines) {
    const [seed, workersText, ...values] = line.split(",");
    const workers = Number(workersText);
    const key = workers + "/" + seed;
    if (!runs.has(key)) runs.set(key, { seed, workers, samples: [] });
    const sample = Object.fromEntries(
      columns.slice(2).map((column, i) => [column, Number(values[i])]),
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
    runs.get(key).samples.push(sample);
  }
  assert.deepEqual(
    [...runs.keys()].sort(),
    plan.groups.flatMap((g) => plan.seeds.map((seed) => g + "/" + seed)).sort(),
  );
  assert.equal(runs.size, report.runCount);
  const times = Array.from({ length: 217 }, (_, i) => i * 1200);
  for (const run of runs.values())
    assert.deepEqual(
      run.samples.map((sample) => sample.timeSeconds),
      times,
    );
  const result = assessBuhlPhysicalSeries({
    schema: "viveiro-buhl-arena-series-v1",
    protocol: "disco-fixo-2005",
    geometryMm: BUHL_DISK_MM,
    timeUnit: "s",
    volumeUnit: "cm3",
    sourceFingerprint: report.sourceFingerprint,
    secondsPerTick: plan.settings.tickMilliseconds / 1000,
    runs: [...runs.values()],
  });
  assert.deepEqual(result.groups, report.groups);
  assert.deepEqual(result.scale, report.scale);
  assert.equal(report.calibrated, false);
  assert.equal(report.independentEmpiricalValidation, false);
});
