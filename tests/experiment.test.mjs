import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  normalizeExperiment,
  exampleExperiment,
} from "../src/modules/experiments/plan.ts";
import { runExperiment } from "../src/modules/experiments/run.ts";
const hash = (v) => createHash("sha256").update(v).digest("hex");
test("experimento fixa defaults, ordem e perfil sem mutar seu plano", () => {
  const input = {
    schema: "viveiro-experiment-v1",
    parameters: { humidity: 68 },
  };
  const before = JSON.stringify(input),
    p = normalizeExperiment(input);
  assert.equal(p.parameters.humidity, 68);
  assert.equal(p.biologicalProfile.version, 5);
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(normalizeExperiment(p), p);
  assert.equal(
    normalizeExperiment({ ...p, parameters: { windX: -0 } }).parameters.windX,
    0,
  );
});
test("experimento rejeita campos, tipos, versões e limites antes de criar o mundo", () => {
  const p = exampleExperiment();
  for (const edit of [
    { schema: "wrong" },
    { seed: "" },
    { seed: "a\nb" },
    { days: 366 },
    { days: 1.5 },
    { days: null },
    { seed: null },
    { parameters: null },
    { biologicalProfile: null },
    { startMode: "flying" },
    { extra: true },
    { parameters: { humidity: null } },
    { parameters: { temperatureC: NaN } },
    { parameters: { windX: 5 } },
    { parameters: { missing: 1 } },
    { biologicalProfile: { schema: 1, id: "unknown", version: 1 } },
  ])
    assert.throws(
      () => normalizeExperiment({ ...p, ...edit }),
      JSON.stringify(edit),
    );
  assert.throws(() =>
    normalizeExperiment(
      JSON.parse('{"schema":"viveiro-experiment-v1","__proto__":{}}'),
    ),
  );
});
test("experimento zero dias contém somente o estado observado inicial", async () => {
  const result = await runExperiment({ ...exampleExperiment(), days: 0 });
  const m = JSON.parse(result.manifest),
    rows = result.csv.trimEnd().split("\r\n");
  assert.equal(rows.length, 2);
  assert.match(rows[1], /estado_inicial/);
  assert.equal(m.clock.endTick, 0);
  assert.equal(m.csv.sha256, hash(result.csv));
  assert.equal(m.csv.bytes, Buffer.byteLength(result.csv));
  assert.equal(result.csv.charCodeAt(0), 0xfeff);
  assert.equal(m.arithmetic, "ecmascript-native-f64-v1");
});
test("experimento repete bytes no mesmo runtime apesar de pausas e progresso", async () => {
  const p = {
    ...exampleExperiment(),
    seed: "TESTE-CLI",
    days: 3,
    startMode: "established",
    biologicalProfile: { schema: 1, id: "generic-demo", version: 1 },
  };
  const before = JSON.stringify(p),
    first = await runExperiment(p),
    ticks = [];
  const second = await runExperiment(p, {
    progress(t) {
      ticks.push(t);
    },
    pause: () => Promise.resolve(),
  });
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(p), before);
  assert.equal(ticks.at(-1), 300);
  assert.equal(ticks.length, 12);
  assert.equal(first.csv.trimEnd().split("\r\n").length, 5);
  assert.equal(JSON.parse(first.manifest).csv.sha256, hash(first.csv));
});
test("cancelamento não devolve resultado parcial e observações ausentes ficam vazias", async () => {
  let cancelled = false;
  await assert.rejects(
    runExperiment(
      { ...exampleExperiment(), days: 3 },
      {
        cancelled: () => cancelled,
        progress() {
          cancelled = true;
        },
      },
    ),
    /cancelado/,
  );
  // The lowest profile still gets actual environments as the engine initializes them;
  // this runner does not replace missing readings with fabricated measurements.
  const result = await runExperiment({ ...exampleExperiment(), days: 0 });
  assert.equal(JSON.parse(result.manifest).calibrated, false);
  assert.equal(result.csv.includes("NaN"), false);
  assert.match(result.csv, /,24,,,\r\n$/);
});
