import assert from "node:assert/strict";
import { test } from "node:test";
import { World } from "../src/modules/simulation/world.js";
import {
  createTerrariumStudy,
  runTerrariumStudyBaseline,
} from "../src/modules/benchmarks/terrarium-study/baseline.ts";
test("study baseline uses the real World and preserves its exact stepping", () => {
  const world = createTerrariumStudy("SHARED-ENGINE", 50);
  assert.ok(world instanceof World);
  assert.equal(world.workers.length, 50);
  assert.equal(
    world.ants.some((a) => a.kind === "queen"),
    false,
  );
  world.step(100);
  const result = runTerrariumStudyBaseline("SHARED-ENGINE", 50, 100);
  assert.equal(result.finalRng, world.rng);
  assert.equal(result.samples.at(-1).removedModelVolume, world.soil.removed);
  assert.equal(result.buhlComparable, false);
  assert.equal(result.blockers.length, 4);
});
test("baseline refuses unsupported cohorts and unbounded pilot durations", () => {
  assert.throws(() => createTerrariumStudy("x", 20));
  assert.throws(() => runTerrariumStudyBaseline("x", 50, 50000));
});
