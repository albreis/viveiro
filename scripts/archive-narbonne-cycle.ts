import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { readSweepJson, immutableSweepFile } from "./lib/sweep-files.ts";
import type { ExperimentPlan } from "../src/modules/experiments/plan.ts";
import type { ExperimentResult } from "../src/modules/experiments/result.ts";

interface Run {
  plan: ExperimentPlan;
  result: ExperimentResult;
  firstEggTick: number | null;
  firstWorkerTick: number | null;
  establishedTick: number | null;
  fullOpeningTick?: number | null;
  samples: Record<string, number | boolean | string>[];
}
const { values } = parseArgs({
  options: {
    input: { type: "string" },
    prefix: { type: "string" },
    source: { type: "string" },
  },
});
if (
  !values.input ||
  !values.prefix ||
  !/^[a-f0-9]{40}$/.test(values.source ?? "")
)
  throw Error("Uso: --input PASTA --prefix docs/validacoes/NOME --source SHA");
const data = readSweepJson(
  join(values.input, "series.json"),
  2 * 1024 * 1024,
) as {
  fingerprint: string;
  results: Run[];
};
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const fields = Object.keys(data.results[0].samples[0]);
const lines = [["seed", "profileVersion", ...fields].join(",")];
let maxBalanceError = 0;
const runs = data.results.map((run) => {
  const manifest = JSON.parse(run.result.manifest);
  assert.deepEqual(manifest.plan, run.plan);
  assert.equal(sha(run.result.csv), manifest.csv.sha256);
  assert.equal(run.samples.length, run.plan.days + 1);
  run.samples.forEach((sample, day) => {
    assert.deepEqual(Object.keys(sample), fields);
    assert.equal(sample.day, day);
    maxBalanceError = Math.max(
      maxBalanceError,
      sample.balanceMaxError as number,
    );
    const row = [
      run.plan.seed,
      run.plan.biologicalProfile.version,
      ...fields.map((k) => sample[k]),
    ];
    lines.push(
      row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
    );
  });
  assert.ok(maxBalanceError < 1e-7);
  return {
    plan: run.plan,
    firstEggTick: run.firstEggTick,
    firstWorkerTick: run.firstWorkerTick,
    establishedTick: run.establishedTick,
    fullOpeningTick: run.fullOpeningTick ?? null,
    final: run.samples.at(-1),
    csvSha256: manifest.csv.sha256,
    arithmetic: manifest.arithmetic,
    finalRootRng: manifest.finalRootRng,
    recordSha256: sha(JSON.stringify(run)),
  };
});
const csv = lines.join("\n") + "\n";
const summary = {
  schema: "viveiro-narbonne-cycle-v1",
  calibrated: false,
  sourceCommit: values.source,
  modelFingerprint: data.fingerprint,
  ticksPerModelDay: 100,
  seriesSha256Lf: sha(csv),
  sampleCount: data.results.reduce((n, r) => n + r.samples.length, 0),
  maxBalanceError,
  runs,
};
immutableSweepFile(resolve(values.prefix + "-series.csv"), csv);
immutableSweepFile(
  resolve(values.prefix + "-comparacao.json"),
  JSON.stringify(summary, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    source: values.source,
    rows: summary.sampleCount,
    maxBalanceError,
  }),
);
