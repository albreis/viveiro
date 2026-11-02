import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runExperimentProcess } from "../scripts/lib/experiment-process.ts";
import { runExperiment } from "../src/modules/experiments/run.ts";
import { arithmeticPolicy } from "../src/libs/model-math.ts";
import { exampleExperiment } from "../src/modules/experiments/plan.ts";
import metadata from "../package.json" with { type: "json" };
test("Worker Node portátil isola o backend e repete CSV/manifesto sem mutar Math ou seu plano", async () => {
  const p = { ...exampleExperiment(), seed: "PORTABLE-ISOLATED", days: 2 },
    before = JSON.stringify(p),
    original = Math.exp;
  assert.equal(arithmeticPolicy(), "ecmascript-native-f64-v1");
  const [a, b] = await Promise.all([
    runExperimentProcess(p),
    runExperimentProcess(p),
  ]);
  assert.deepEqual(a, b);
  assert.equal(JSON.parse(a.manifest).arithmetic, "stdlib-f64-v1");
  assert.equal(Math.exp, original);
  assert.equal(arithmeticPolicy(), "ecmascript-native-f64-v1");
  assert.equal(JSON.stringify(p), before);
});
test("roteamento preserva a trajetória nativa capturada antes da mudança", async () => {
  const p = JSON.parse(
    readFileSync("tests/fixtures/cli-native-039/plan.json", "utf8"),
  );
  const r = await runExperiment(p);
  assert.equal(JSON.parse(r.manifest).arithmetic, "ecmascript-native-f64-v1");
  const original = readFileSync(
    "tests/fixtures/cli-native-039/node.csv",
    "utf8",
  );
  assert.equal(
    r.csv.replaceAll('"' + metadata.version + '"', '"0.39.0"'),
    original,
  );
});
