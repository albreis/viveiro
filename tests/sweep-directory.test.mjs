import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { SweepDirectory } from "../scripts/lib/sweep-directory.ts";
import {
  readSweepFile,
  immutableSweepFile,
} from "../scripts/lib/sweep-files.ts";
import { exampleSweep } from "../src/modules/sweeps/plan.ts";
import { runSweep } from "../src/modules/sweeps/run.ts";
import { runExperimentProcess } from "../scripts/lib/experiment-process.ts";
mkdirSync(".runtime", { recursive: true });
const root = () => mkdtempSync(resolve(".runtime/sweep-directory-"));
const plan = () => ({
  ...exampleSweep(),
  values: [50],
  replicates: 1,
  base: { ...exampleSweep().base, days: 0 },
});
test("disk commits retain BOM/CRLF and resume checks real results without overwriting", async () => {
  const p = plan(),
    out = join(root(), "out");
  const store = await SweepDirectory.open(out, p, false);
  try {
    const result = await runSweep(p, {
      concurrency: 1,
      execute: (j) => runExperimentProcess(j.plan),
      completed: (r) => store.save(r),
    });
    assert.ok(result.results[0].result.csv.startsWith("\ufeff"));
    const bytes = readFileSync(join(out, "v001-r001/dados.csv"));
    assert.equal(bytes[0], 0xef);
    assert.deepEqual((await store.load(p)).results, result.results);
    await store.finish(result);
    await store.finish(result);
    assert.ok(existsSync(join(out, "concluido.json")));
    await assert.rejects(SweepDirectory.open(out, p, true), /bloqueada/);
  } finally {
    store.close();
  }
  const resumed = await SweepDirectory.open(out, p, true);
  try {
    const c = await resumed.load(p);
    assert.equal(c.results.length, 1);
    writeFileSync(join(out, "v001-r001/dados.csv"), "corrupted");
    await assert.rejects(resumed.load(p), /hash inválido/);
    assert.equal(
      readFileSync(join(out, "v001-r001/dados.csv"), "utf8"),
      "corrupted",
    );
  } finally {
    resumed.close();
  }
});
test("existing folders, incompatible plans, unexpected IDs and incomplete commits are preserved", async () => {
  const p = plan(),
    out = join(root(), "existing");
  mkdirSync(out);
  writeFileSync(join(out, "sentinel"), "keep");
  await assert.rejects(SweepDirectory.open(out, p, false), /já existe/);
  assert.equal(readFileSync(join(out, "sentinel"), "utf8"), "keep");
  const fresh = join(root(), "fresh"),
    s = await SweepDirectory.open(fresh, p, false);
  s.close();
  const changed = structuredClone(p);
  changed.values = [60];
  await assert.rejects(
    SweepDirectory.open(fresh, changed, true),
    /incompatível/,
  );
  assert.equal(existsSync(join(fresh, ".sweep.lock")), false);
  const loaded = await SweepDirectory.open(fresh, p, true);
  try {
    mkdirSync(join(fresh, "v999-r999"));
    await assert.rejects(loaded.load(p), /alheia/);
    assert.throws(
      () => loaded.save({ id: "../../outside", result: {} }),
      /inválido/,
    );
  } finally {
    loaded.close();
  }
});
test("immutable file publication refuses different bytes and permits an identical retry", () => {
  const file = join(root(), "result");
  immutableSweepFile(file, "\ufeffa,b\r\n");
  immutableSweepFile(file, "\ufeffa,b\r\n");
  assert.equal(readSweepFile(file), "\ufeffa,b\r\n");
  assert.throws(() => immutableSweepFile(file, "other"), /difere/);
  assert.equal(readSweepFile(file), "\ufeffa,b\r\n");
});
