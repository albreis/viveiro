import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { assessBuhlPhysicalSeries } from "./lib/buhl-physical-check.ts";
import { immutableSweepFile } from "./lib/sweep-files.ts";
import type { BuhlLabRun } from "../src/modules/benchmarks/buhl-arena/run.ts";
import type { BuhlLabPlan } from "../src/modules/benchmarks/buhl-arena/settings.ts";

const [folder, sourceCommit, ...extra] = process.argv.slice(2);
if (!folder || !/^[a-f0-9]{40}$/.test(sourceCommit ?? "") || extra.length)
  throw Error(
    "Uso: node scripts/archive-buhl-locomotion.ts PASTA SHA_DA_FONTE",
  );
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const experiment = read(join(folder, "experimento.json"));
const completed = read(join(folder, "concluido.json"));
assert.equal(completed.stage, "72h");
assert.equal(completed.runs, 60);
assert.equal(
  completed.planSha256,
  sha(
    readFileSync(join(folder, "experimento.json"), "utf8").replaceAll(
      "\r\n",
      "\n",
    ),
  ),
);
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
  "distanceMm",
  "digging",
  "carrying",
  "meanDigReadiness",
  "bodyRejectedCandidates",
];
const activity = [
  "diggingSeconds",
  "carryingSeconds",
  "blockedMoves",
  "unloadedSteps",
  "loadedSteps",
];
const csvRows: unknown[][] = [
  ["arm", "workers", "seed", ...fields, ...activity],
];
const arms = [];
let fingerprint = "";
const baseBodies = new Map<string, unknown>();
const allRuns = new Map<string, BuhlLabRun[]>();
for (const arm of experiment.arms) {
  const dir = join(folder, arm.id),
    manifest = read(join(dir, "plano.json"));
  const series = read(join(dir, "series.json")) as {
    sourceFingerprint: string;
    runs: BuhlLabRun[];
  };
  if (!fingerprint) fingerprint = series.sourceFingerprint;
  assert.equal(series.sourceFingerprint, fingerprint);
  assert.equal(manifest.sourceFingerprint, fingerprint);
  assert.equal(series.runs.length, 15);
  const hashes = [];
  for (const [i, run] of series.runs.entries()) {
    const plan = manifest.plans[i] as BuhlLabPlan;
    const record = read(
      join(dir, `rodada-${String(i + 1).padStart(3, "0")}.json`),
    );
    assert.deepEqual(record.run, run);
    assert.equal(record.sha256, sha(JSON.stringify([plan, run])));
    assert.equal(run.seed, plan.seed);
    assert.equal(run.workers, plan.workers);
    assert.equal(plan.durationSeconds, 259200);
    assert.equal(plan.digFatigue, "work-recovery");
    assert.deepEqual(plan.locomotion, {
      walkingSource: arm.walkingSource,
      soilLoadFactor: arm.soilLoadFactor,
    });
    assert.equal(run.samples.length, 217);
    hashes.push(record.sha256);
    const key = run.seed + "/" + run.workers;
    const bodies = run.workerPhenotypes!.map(
      ({ id, bodyMm, bodyScale, headScale }) => ({
        id,
        bodyMm,
        bodyScale,
        headScale,
      }),
    );
    if (arm.id === "base") baseBodies.set(key, bodies);
    else assert.deepEqual(bodies, baseBodies.get(key));
    for (const [j, s] of run.samples.entries()) {
      assert.equal(s.timeSeconds, j * 1200);
      assert.equal(
        s.dugMicrograms,
        s.carriedMicrograms + s.depositedMicrograms,
      );
      assert.equal(s.initialSandCells, s.remainingSandCells + s.openedCells);
      assert.equal(s.trafficOpenedCells, 0);
      assert.equal(s.activity!.removedMicrograms, s.dugMicrograms);
      assert.ok(
        Math.abs(
          s.distanceMm -
            (s.activity!.loadedSteps + s.activity!.unloadedSteps) *
              plan.pitchMm,
        ) < 1e-8,
      );
      assert.ok(
        s.activity!.diggingSeconds + s.activity!.carryingSeconds <=
          run.workers * s.timeSeconds + 1e-8,
      );
      csvRows.push([
        arm.id,
        run.workers,
        run.seed,
        ...fields.map((k) => (s as unknown as Record<string, number>)[k]),
        ...activity.map(
          (k) => (s.activity as unknown as Record<string, number>)[k],
        ),
      ]);
    }
  }
  allRuns.set(arm.id, series.runs);
  arms.push({
    id: arm.id,
    locomotion: arm,
    plans: manifest.plans,
    runHashes: hashes,
    diagnostic: assessBuhlPhysicalSeries(series),
    activity: experiment.groups.map((workers: number) => {
      const runs = series.runs.filter((r) => r.workers === workers),
        end = runs.map((r) => r.samples.at(-1)!);
      const mean = (k: keyof NonNullable<(typeof end)[0]["activity"]>) =>
        end.reduce((a, s) => a + Number(s.activity![k]), 0) / end.length;
      return {
        workers,
        diggingWorkerTimeFraction: mean("diggingSeconds") / (workers * 259200),
        carryingWorkerTimeFraction:
          mean("carryingSeconds") / (workers * 259200),
        unloadedSteps: mean("unloadedSteps"),
        loadedSteps: mean("loadedSteps"),
        blockedMoves: mean("blockedMoves"),
      };
    }),
  });
}
const mean = (x: number[]) => x.reduce((a, b) => a + b, 0) / x.length;
const comparisons = experiment.groups.map((workers: number) => {
  const get = (arm: string, seed: string) =>
    allRuns
      .get(arm)!
      .find((r) => r.workers === workers && r.seed === seed)!
      .samples.at(-1)!.voidVolumeCm3;
  const pairs = experiment.seeds.map((seed: string) => {
    const base = get("base", seed),
      speed = get("velocidade", seed),
      load = get("carga", seed),
      both = get("ambos", seed);
    return {
      seed,
      baseCm3: base,
      speedCm3: speed,
      loadCm3: load,
      bothCm3: both,
      speedGain: speed / base,
      loadGain: load / base,
      bothGain: both / base,
      interactionCm3: both - speed - load + base,
    };
  });
  return {
    workers,
    pairs,
    meanInteractionCm3: mean(
      pairs.map((p: { interactionCm3: number }) => p.interactionCm3),
    ),
  };
});
const csv =
  csvRows
    .map((row) =>
      row
        .map((v) => '"' + String(v ?? "").replaceAll('"', '""') + '"')
        .join(","),
    )
    .join("\n") + "\n";
const prefix = "docs/validacoes/buhl-locomocao";
immutableSweepFile(prefix + "-72h.csv", csv);
immutableSweepFile(
  prefix + "-resultado.json",
  JSON.stringify(
    {
      schema: "viveiro-buhl-locomotion-result-v1",
      calibrated: false,
      independentEmpiricalValidation: false,
      sourceCommit,
      sourceFingerprint: fingerprint,
      runCount: 60,
      sampleCount: csvRows.length - 1,
      csvSha256Lf: sha(csv),
      experiment,
      arms,
      comparisons,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    arms.map((a) => ({
      id: a.id,
      groups: a.diagnostic.groups.map((g) => ({
        workers: g.workers,
        finalCm3: g.finalCm3,
        maeCm3: g.maeCm3,
        coverage: g.readBandCoverage,
      })),
      ...a.diagnostic.scale,
    })),
    null,
    2,
  ),
);
