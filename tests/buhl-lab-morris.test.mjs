import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buhlMorrisAnalysis,
  buhlMorrisDesign,
} from "../scripts/lib/buhl-lab-morris.ts";

test("Morris da arena varia uma entrada por passo e preserva seeds pareadas", () => {
  const design = buhlMorrisDesign({
    seed: "MORRIS-TESTE",
    trajectories: 2,
    replicates: 2,
    settings: { workers: 100, separationMm: 5, durationSeconds: 60 },
  });
  assert.equal(design.plans.length, 16);
  for (const points of design.points) {
    assert.equal(
      new Set(points.slice(1).map((point) => point.changed)).size,
      3,
    );
    for (let i = 1; i < points.length; i++) {
      assert.equal(
        points[i].normalized.filter(
          (value, j) => value !== points[i - 1].normalized[j],
        ).length,
        1,
      );
      assert.deepEqual(
        points[i].plans.map((p) => p.seed),
        points[0].plans.map((p) => p.seed),
      );
    }
  }
  assert.notEqual(
    design.points[0][0].plans[0].seed,
    design.points[1][0].plans[0].seed,
  );
  const runs = design.plans.map((plan) => ({
    workers: plan.workers,
    seed: plan.seed,
    samples: [
      {
        voidVolumeCm3: 10 * plan.dryDensityMgPerMm3,
        removedSoilCm3: 2,
        fullPellets: 1,
      },
    ],
  }));
  const ranking = buhlMorrisAnalysis(design, runs).voidVolumeCm3;
  assert.equal(ranking[0].parameter, "dryDensityMgPerMm3");
  assert.ok(Math.abs(ranking[0].muStar - 6) < 1e-12);
  assert.equal(ranking[1].muStar, 0);
  assert.equal(ranking[2].muStar, 0);
  assert.throws(
    () => buhlMorrisAnalysis(design, runs.slice(1)),
    /todas as rodadas/,
  );
});
