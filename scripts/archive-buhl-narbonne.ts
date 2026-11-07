import { existsSync, readFileSync } from "node:fs";
import { readCsv } from "../src/libs/csv-reader.ts";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { assessBuhlPhysicalSeries } from "./lib/buhl-physical-check.ts";
import { readSweepJson, immutableSweepFile } from "./lib/sweep-files.ts";
import type { BiologicalReference } from "../src/modules/biology/types.ts";
import type { BuhlLabPlan } from "../src/modules/benchmarks/buhl-arena/settings.ts";

// Historical data remains readable after the optional morphology engine was removed.
interface ArchivedRun {
  seed: string;
  workers: number;
  samples: Record<string, number>[];
  workerPhenotypes?: Record<string, number>[];
}
type ArchivedPlan = BuhlLabPlan & { workerProfile?: BiologicalReference };

const [folder, sourceCommit, ...extra] = process.argv.slice(2);
if (!folder || !/^[a-f0-9]{40}$/.test(sourceCommit ?? "") || extra.length)
  throw Error("Uso: node scripts/archive-buhl-narbonne.ts PASTA SHA_DA_FONTE");
const source = readSweepJson(join(folder, "series.json"), 8 * 1024 * 1024) as {
  sourceFingerprint: string;
  runs: ArchivedRun[];
};
const manifest = readSweepJson(join(folder, "plano.json")) as {
  plans: ArchivedPlan[];
  sourceFingerprint: string;
  runtime: string;
};
assert.equal(source.sourceFingerprint, manifest.sourceFingerprint);
assert.equal(source.runs.length, 15);
const previous = readSweepJson(
  "docs/validacoes/buhl-fadiga-comparacao-72h.json",
) as {
  arms: Record<
    "controle" | "local",
    ReturnType<typeof assessBuhlPhysicalSeries> & {
      publishedSeriesSha256Lf: string;
    }
  >;
};
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
] as const;
const traits = [
  "id",
  "bodyMm",
  "bodyScale",
  "headScale",
  "walkingMmPerSecond",
  "loadedGalleryWalkingMmPerSecond",
] as const;
const samples: unknown[][] = [["workers", "seed", ...fields]];
const bodies: unknown[][] = [["workers", "seed", ...traits]];
const runHashes: string[] = [];
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
for (const [index, run] of source.runs.entries()) {
  const plan = manifest.plans[index];
  assert.equal(run.seed, plan.seed);
  assert.equal(run.workers, plan.workers);
  assert.equal(plan.digFatigue, "work-recovery");
  assert.equal(plan.workerProfile?.id, "messor-narbonne");
  assert.equal(plan.workerProfile?.version, 2);
  assert.equal(run.samples.length, 217);
  const record = readSweepJson(
    join(folder, "rodada-" + String(index + 1).padStart(3, "0") + ".json"),
    8 * 1024 * 1024,
  ) as { sha256: string; run: BuhlLabRun };
  assert.deepEqual(record.run, run);
  assert.equal(record.sha256, sha(JSON.stringify([plan, run])));
  runHashes.push(record.sha256);
  for (const [i, sample] of run.samples.entries()) {
    assert.equal(sample.timeSeconds, i * 1200);
    assert.equal(
      sample.dugMicrograms,
      sample.carriedMicrograms + sample.depositedMicrograms,
    );
    assert.equal(
      sample.initialSandCells,
      sample.remainingSandCells + sample.openedCells,
    );
    assert.equal(sample.trafficOpenedCells, 0);
    samples.push([run.workers, run.seed, ...fields.map((k) => sample[k])]);
  }
  assert.equal(run.workerPhenotypes?.length, run.workers);
  for (const body of run.workerPhenotypes!) {
    assert.ok(body.bodyMm >= 4 && body.bodyMm <= 8);
    bodies.push([run.workers, run.seed, ...traits.map((k) => body[k])]);
  }
}
const diagnostic = assessBuhlPhysicalSeries(source);
const oldCsv = readFileSync(
  "docs/validacoes/buhl-fadiga-local-72h.csv",
  "utf8",
).replaceAll("\r\n", "\n");
assert.equal(sha(oldCsv), previous.arms.local.publishedSeriesSha256Lf);
const [oldColumns, ...oldRows] = readCsv(oldCsv);
const oldFinal = new Map(
  oldRows
    .filter((row) => Number(row[oldColumns.indexOf("timeSeconds")]) === 259200)
    .map((row) => [
      row[0] + "/" + row[1],
      Number(row[oldColumns.indexOf("voidVolumeCm3")]),
    ]),
);
const comparisons = diagnostic.groups.map((group) => {
  const old = previous.arms.local.groups.find(
    (g) => g.workers === group.workers,
  )!;
  assert.deepEqual(group.replicateSeeds, old.replicateSeeds);
  const mean = (values: number[]) =>
    values.reduce((a, b) => a + b, 0) / values.length;
  return {
    workers: group.workers,
    before: {
      finalCm3: old.finalCm3,
      maeCm3: old.maeCm3,
      coverage: old.readBandCoverage,
    },
    after: {
      finalCm3: group.finalCm3,
      maeCm3: group.maeCm3,
      coverage: group.readBandCoverage,
    },
    lateRateCm3PerHour: mean(
      source.runs
        .filter((r) => r.workers === group.workers)
        .map(
          (r) =>
            (r.samples.at(-1)!.voidVolumeCm3 - r.samples[144].voidVolumeCm3) /
            24,
        ),
    ),
    pairs: source.runs
      .filter((r) => r.workers === group.workers)
      .map((r) => {
        const before = oldFinal.get(r.workers + "/" + r.seed);
        assert.notEqual(before, undefined);
        const after = r.samples.at(-1)!.voidVolumeCm3;
        return {
          seed: r.seed,
          beforeCm3: before,
          afterCm3: after,
          deltaCm3: after - before!,
        };
      }),
    pairedMeanDelta72hCm3: group.finalCm3 - old.finalCm3,
  };
});
const csv = (rows: unknown[][]) =>
  rows
    .map((row) =>
      row
        .map((v) => '"' + String(v ?? "").replaceAll('"', '""') + '"')
        .join(","),
    )
    .join("\n") + "\n";
const seriesCsv = csv(samples),
  bodyCsv = csv(bodies);
const receipt = {
  schema: "viveiro-buhl-narbonne-v1",
  calibrated: false,
  independentEmpiricalValidation: false,
  sourceCommit,
  sourceFingerprint: source.sourceFingerprint,
  runtime: manifest.runtime,
  runCount: source.runs.length,
  sampleCount: samples.length - 1,
  plans: manifest.plans,
  seriesSha256Lf: sha(seriesCsv),
  phenotypesSha256Lf: sha(bodyCsv),
  runHashes,
  comparisons,
  diagnostic,
  oldSeriesSha256Lf: previous.arms.local.publishedSeriesSha256Lf,
};
const prefix = "docs/validacoes/buhl-narbonne-operarias";
function publishHistorical(path: string, text: string) {
  if (existsSync(path)) {
    assert.equal(readFileSync(path, "utf8").replaceAll("\r\n", "\n"), text);
    return;
  }
  immutableSweepFile(path, text);
}
publishHistorical(prefix + "-72h.csv", seriesCsv);
publishHistorical(prefix + "-fenotipos.csv", bodyCsv);
publishHistorical(
  prefix + "-comparacao.json",
  JSON.stringify(receipt, null, 2) + "\n",
);
console.log(JSON.stringify(comparisons, null, 2));
