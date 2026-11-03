import { test } from "node:test";
import assert from "node:assert/strict";
import { morrisDesign } from "../src/modules/sensitivity/design.ts";
import {
  analyzeMorris,
  elementaryStatistics,
} from "../src/modules/sensitivity/analyze.ts";
import { morrisMetrics } from "../src/modules/sensitivity/metrics.ts";
import { parameterRanges } from "../src/modules/experiments/parameters.ts";
import { readCsv } from "../src/libs/csv-reader.ts";
const csv = (values) =>
  Object.values(morrisMetrics).join(",") + "\r\n" + values.join(",") + "\r\n";
test("Morris design stays on the grid and changes exactly one input at each step", async () => {
  const d = await morrisDesign({ trajectories: 3, replicates: 2, days: 1 });
  assert.equal(d.dimensions.length, 12);
  assert.equal(d.jobs.length, 78);
  assert.deepEqual(
    await morrisDesign({ trajectories: 3, replicates: 2, days: 1 }),
    d,
  );
  for (let t = 1; t <= 3; t++) {
    const points = d.points.filter((p) => p.trajectory === t),
      seeds = new Map();
    assert.equal(points.length, 13);
    assert.equal(new Set(points.slice(1).map((p) => p.changed)).size, 12);
    for (const p of points)
      for (const key of d.dimensions) {
        const x = p.normalized[key];
        assert.ok(x >= 0 && x <= 1);
        assert.ok(Math.abs(x * 3 - Math.round(x * 3)) < 1e-12);
      }
    for (let i = 1; i < points.length; i++) {
      const changed = d.dimensions.filter(
        (k) => points[i].normalized[k] !== points[i - 1].normalized[k],
      );
      assert.deepEqual(changed, [points[i].changed]);
      assert.ok(
        Math.abs(
          Math.abs(
            points[i].normalized[changed[0]] -
              points[i - 1].normalized[changed[0]],
          ) -
            2 / 3,
        ) < 1e-12,
      );
    }
    for (const j of d.jobs.filter((j) => j.trajectory === t)) {
      if (seeds.has(j.replicate))
        assert.equal(j.plan.seed, seeds.get(j.replicate));
      else seeds.set(j.replicate, j.plan.seed);
    }
    assert.notEqual(seeds.get(1), seeds.get(2));
  }
});
test("linear analytic response recovers coefficients scaled by each physical range", async () => {
  const d = await morrisDesign({ trajectories: 5, replicates: 2, days: 1 });
  const response = (job) =>
    d.dimensions.reduce(
      (sum, key, i) => sum + (i + 1) * job.plan.parameters[key],
      0,
    ) +
    job.replicate * 3;
  const records = d.jobs.map((job) => ({
    id: job.id,
    result: { csv: csv([response(job), 0, 0, 20, 0.04]), manifest: "" },
  }));
  const result = analyzeMorris(d, records);
  for (const row of result.rankings.population) {
    const i = d.dimensions.indexOf(row.parameter),
      [min, max] = d.bounds[row.parameter];
    assert.ok(Math.abs(row.mu - (i + 1) * (max - min)) < 1e-9);
    assert.ok(Math.abs(row.muStar - (i + 1) * (max - min)) < 1e-9);
    assert.ok(row.sigma < 1e-9);
    assert.equal(row.n, 5);
  }
});
test("mu-star preserves opposing signs; missing data is absent rather than zero", async () => {
  assert.deepEqual(elementaryStatistics([-2, 2]), {
    n: 2,
    mu: 0,
    muStar: 2,
    sigma: Math.sqrt(8),
  });
  const d = await morrisDesign({ trajectories: 2, replicates: 1, days: 1 });
  const records = d.jobs.map((job) => ({
    id: job.id,
    result: { csv: csv([1, 0, 0, "", 0.04]), manifest: "" },
  }));
  const r = analyzeMorris(d, records);
  assert.ok(r.rankings.oxygen.every((x) => x.n === 0 && x.muStar === null));
  assert.throws(() => analyzeMorris(d, records.slice(1)), /todas/);
});
test("nonlinear analytic response has nonzero dispersion across trajectories", async () => {
  const d = await morrisDesign({ trajectories: 10, replicates: 1, days: 1 });
  const records = d.jobs.map((job) => ({
    id: job.id,
    result: {
      csv: csv([
        job.plan.parameters.humidity * job.plan.parameters.light,
        0,
        0,
        20,
        0.04,
      ]),
      manifest: "",
    },
  }));
  const r = analyzeMorris(d, records);
  assert.ok(
    r.rankings.population.find((x) => x.parameter === "humidity").sigma > 0,
  );
  assert.ok(
    r.rankings.population.find((x) => x.parameter === "light").sigma > 0,
  );
});
test("CSV reader preserves quoted commas, escaped quotes, embedded newline and BOM", () => {
  assert.deepEqual(readCsv('\ufeffa,b\r\n"x,y","a""b\nq"\r\n'), [
    ["a", "b"],
    ["x,y", 'a"b\nq'],
  ]);
  for (const bad of ["a,b\n1", '"unfinished', '"a"oops,b'])
    assert.throws(() => readCsv(bad));
});
test("invalid or excessive Morris plans do not start model runs", async () => {
  for (const p of [
    { levels: 3 },
    { trajectories: 1 },
    { replicates: 0 },
    { days: 0 },
    { seed: "" },
    { trajectories: 20, replicates: 10, days: 30 },
  ])
    await assert.rejects(morrisDesign(p));
});
