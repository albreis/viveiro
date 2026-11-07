import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { immutableSweepFile } from "./lib/sweep-files.ts";
import { assessBuhlPhysicalSeries } from "./lib/buhl-physical-check.ts";
import type { BuhlLabRun } from "../src/modules/benchmarks/buhl-arena/run.ts";

const [folder, sourceCommit, ...extra] = process.argv.slice(2);
if (!folder || !/^[a-f0-9]{40}$/.test(sourceCommit ?? "") || extra.length)
  throw Error("Uso: node scripts/archive-buhl-access.ts PASTA SHA_DA_FONTE");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const manifest = read(join(folder, "plano.json"));
const duration = manifest.plans[0].durationSeconds;
assert.ok(duration === 7200 || duration === 259200);
const basePath =
  duration === 7200
    ? ".runtime/buhl-locomocao-piloto/base/series.json"
    : ".runtime/buhl-locomocao-72h/base/series.json";
const base = read(basePath) as {
  sourceFingerprint: string;
  runs: BuhlLabRun[];
};
const data = read(join(folder, "series.json")) as typeof base;
assert.equal(data.sourceFingerprint, base.sourceFingerprint);
assert.equal(manifest.sourceFingerprint, data.sourceFingerprint);
assert.equal(data.runs.length, 15);
const fields = [
  "timeSeconds",
  "voidVolumeCm3",
  "removedSoilCm3",
  "dugMicrograms",
  "carriedMicrograms",
  "depositedMicrograms",
  "initialSandCells",
  "remainingSandCells",
  "openedCells",
  "trafficOpenedCells",
  "digStarts",
  "contactWorkerTicks",
  "meanDigReadiness",
];
const csv: unknown[][] = [
  [
    "workers",
    "seed",
    ...fields,
    "diggingSeconds",
    "carryingSeconds",
    "blockedMoves",
  ],
];
const hashes: string[] = [];
for (const [i, run] of data.runs.entries()) {
  const plan = manifest.plans[i],
    record = read(
      join(folder, `rodada-${String(i + 1).padStart(3, "0")}.json`),
    );
  assert.deepEqual(record.run, run);
  assert.equal(record.sha256, sha(JSON.stringify([plan, run])));
  assert.equal(plan.contactAccess, 1);
  assert.equal(plan.durationSeconds, duration);
  assert.deepEqual(plan.locomotion, {
    walkingSource: "profile-temperature",
    soilLoadFactor: 0.85,
  });
  const before = base.runs.find(
    (r) => r.seed === run.seed && r.workers === run.workers,
  )!;
  assert.ok(before);
  assert.deepEqual(run.workerPhenotypes, before.workerPhenotypes);
  assert.equal(run.samples.length, duration / 1200 + 1);
  hashes.push(record.sha256);
  for (const [j, s] of run.samples.entries()) {
    assert.equal(s.timeSeconds, j * 1200);
    assert.equal(s.dugMicrograms, s.carriedMicrograms + s.depositedMicrograms);
    assert.equal(s.initialSandCells, s.remainingSandCells + s.openedCells);
    assert.equal(s.trafficOpenedCells, 0);
    csv.push([
      run.workers,
      run.seed,
      ...fields.map((k) => (s as unknown as Record<string, number>)[k]),
      s.activity!.diggingSeconds,
      s.activity!.carryingSeconds,
      s.activity!.blockedMoves,
    ]);
  }
}
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const comparisons = [50, 100, 200].map((workers) => {
  const runs = data.runs.filter((r) => r.workers === workers);
  const pairs = runs.map((r) => {
    const before = base.runs.find(
      (b) => b.workers === workers && b.seed === r.seed,
    )!;
    const a = before.samples.at(-1)!,
      b = r.samples.at(-1)!;
    return {
      seed: r.seed,
      baseCm3: a.voidVolumeCm3,
      accessOneCm3: b.voidVolumeCm3,
      deltaCm3: b.voidVolumeCm3 - a.voidVolumeCm3,
      baseDiggingSeconds: a.activity!.diggingSeconds,
      accessOneDiggingSeconds: b.activity!.diggingSeconds,
    };
  });
  const oldMean = mean(pairs.map((p) => p.baseCm3)),
    newMean = mean(pairs.map((p) => p.accessOneCm3));
  return {
    workers,
    pairs,
    baseMeanCm3: oldMean,
    accessOneMeanCm3: newMean,
    ratioOfMeans: oldMean > 0 ? newMean / oldMean : null,
  };
});
const text =
  csv
    .map((row) =>
      row
        .map((x) => '"' + String(x ?? "").replaceAll('"', '""') + '"')
        .join(","),
    )
    .join("\n") + "\n";
const publish = (p: string, s: string) =>
  existsSync(p)
    ? assert.equal(readFileSync(p, "utf8").replaceAll("\r\n", "\n"), s)
    : immutableSweepFile(p, s);
const prefix =
  "docs/validacoes/buhl-acesso-geometrico-" +
  (duration === 7200 ? "piloto" : "72h");
publish(prefix + ".csv", text);
publish(
  prefix + ".json",
  JSON.stringify(
    {
      schema:
        duration === 7200
          ? "viveiro-buhl-access-pilot-v1"
          : "viveiro-buhl-access-72h-v1",
      calibrated: false,
      independentEmpiricalValidation: false,
      purpose:
        duration === 7200
          ? "2h model ablation; not agreement with Buhl 72h"
          : "72h exploratory ablation; retrospective comparison",
      durationSeconds: duration,
      sourceCommit,
      sourceFingerprint: data.sourceFingerprint,
      runtime: manifest.runtime,
      analysisScriptSha256Lf: sha(
        readFileSync(new URL(import.meta.url), "utf8").replaceAll("\r\n", "\n"),
      ),
      csvSha256Lf: sha(text),
      baseSeriesSha256Lf: sha(
        readFileSync(basePath, "utf8").replaceAll("\r\n", "\n"),
      ),
      runCount: 15,
      sampleCount: csv.length - 1,
      plans: manifest.plans,
      runHashes: hashes,
      balances: true,
      trafficExcavationZero: true,
      morphologyUnchanged: true,
      comparisons,
      ...(duration === 259200
        ? { diagnostic: assessBuhlPhysicalSeries(data) }
        : {}),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    comparisons.map(({ pairs, ...summary }) => summary),
    null,
    2,
  ),
);
