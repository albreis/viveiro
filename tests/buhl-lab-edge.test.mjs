import assert from "node:assert/strict";
import { test } from "node:test";
import { runBuhlLab } from "../src/modules/benchmarks/buhl-arena/run.ts";

test("a ablação separa contato e recrutamento com o mesmo relógio e seed", () => {
  const plan = {
    seed: "ARENA-BASE-1",
    workers: 100,
    separationMm: 5,
    dryDensityMgPerMm3: 1.5,
    durationSeconds: 1200,
  };
  const plain = runBuhlLab({ ...plan, mechanism: "local" }).samples.at(-1);
  const edge = runBuhlLab({ ...plan, mechanism: "edge-follow" }).samples.at(-1);
  const trail = runBuhlLab({ ...plan, mechanism: "edge-recruit" }).samples.at(
    -1,
  );
  assert.equal(plain.fullPellets, 7);
  assert.equal(plain.voidVolumeCm3, 0);
  assert.ok(edge.contactWorkerTicks > 0);
  assert.equal(edge.recruitedDigStarts, 0);
  assert.ok(trail.recruitedDigStarts > 0);
  for (const sample of [edge, trail]) {
    assert.equal(sample.timeSeconds, 1200);
    assert.equal(
      sample.dugMicrograms,
      sample.carriedMicrograms + sample.depositedMicrograms,
    );
    assert.equal(sample.trafficOpenedCells, 0);
  }
  assert.throws(
    () => runBuhlLab({ ...plan, mechanism: "desconhecido" }),
    /Mecanismo/,
  );
});
