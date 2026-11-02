import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeSweep, exampleSweep } from "../src/modules/sweeps/plan.ts";
import { sweepJobs, sweepId } from "../src/modules/sweeps/jobs.ts";
import { sweepArgs } from "../scripts/lib/sweep-args.ts";
test("five values and ten paired replicas expand without changing their source plan", async () => {
  const p = exampleSweep(),
    before = structuredClone(p),
    jobs = await sweepJobs(p);
  assert.equal(jobs.length, 50);
  assert.deepEqual(p, before);
  assert.equal(new Set(jobs.map((j) => j.id)).size, 50);
  assert.equal(new Set(jobs.map((j) => j.plan.seed)).size, 10);
  for (let i = 0; i < 10; i++)
    for (let v = 0; v < 5; v++) {
      assert.equal(jobs[v * 10 + i].plan.seed, jobs[i].plan.seed);
      assert.equal(jobs[v * 10 + i].plan.parameters.humidity, p.values[v]);
      assert.equal(jobs[v * 10 + i].replicate, i + 1);
    }
  assert.deepEqual(await sweepJobs(p), jobs);
  assert.equal(
    await sweepId(p),
    await sweepId(normalizeSweep(JSON.parse(JSON.stringify(p)))),
  );
});
test("seeds support long Unicode input and differ when its suffix changes", async () => {
  const a = exampleSweep();
  a.base.seed = "ç".repeat(127) + "a";
  const b = structuredClone(a);
  b.base.seed = b.base.seed.slice(0, -1) + "b";
  const ja = await sweepJobs(a),
    jb = await sweepJobs(b);
  assert.ok(ja.every((j) => j.plan.seed.length <= 128));
  assert.notEqual(ja[0].plan.seed, jb[0].plan.seed);
});
test("invalid or excessive sweeps are rejected before scheduling", () => {
  for (const edit of [
    (p) => (p.schema = "bad"),
    (p) => (p.parameter = "__proto__"),
    (p) => (p.values = [1, 1]),
    (p) => (p.values = [-0, 0]),
    (p) => (p.values = [101]),
    (p) => (p.values = ["50"]),
    (p) => (p.values = []),
    (p) => (p.replicates = 1.5),
    (p) => (p.replicates = 101),
    (p) => (p.extra = true),
    (p) => (p.base.days = -1),
    (p) => {
      p.values = Array.from({ length: 50 }, (_, i) => i);
      p.replicates = 100;
    },
  ]) {
    const p = exampleSweep();
    edit(p);
    assert.throws(() => normalizeSweep(p));
  }
  assert.throws(() => normalizeSweep(null));
  assert.throws(() => normalizeSweep([]));
});
test("CLI parser rejects duplicate flags, missing values and invalid job budgets", () => {
  assert.equal(
    sweepArgs(["--out", "x", "--jobs", "4", "--limit", "7", "--resume"]).limit,
    7,
  );
  for (const a of [
    ["--out", "x", "--jobs", "0"],
    ["--out", "x", "--jobs", "1.5"],
    ["--out", "x", "--limit", "0"],
    ["--out", "x", "--resume", "--resume"],
    ["--out", "x", "--resume", "--checkpoint", "a"],
    ["--out", "x", "--extra", "1"],
    ["--plan"],
    [],
  ])
    assert.throws(() => sweepArgs(a));
});
