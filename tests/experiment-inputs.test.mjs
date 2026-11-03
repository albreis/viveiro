import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { normalizeExperiment } from "../src/modules/experiments/plan.ts";
import { sweepJobs } from "../src/modules/sweeps/jobs.ts";
import { exampleSweep } from "../src/modules/sweeps/plan.ts";
const w = (parameters = {}) =>
  new World("INPUT-42", { humidity: 68, ...parameters }, { founding: false });
test("old normalized plans retain only their seven keys", () => {
  const p = normalizeExperiment({ schema: "viveiro-experiment-v1" });
  assert.equal(Object.keys(p.parameters).length, 7);
  for (const [key, value] of [
    ["photoperiodHours", 25],
    ["initialFood", -1],
    ["surfaceDiffusionScale", 10],
    ["surfaceEvaporationScale", NaN],
    ["initialRainPulse", 2],
  ])
    assert.throws(() =>
      normalizeExperiment({
        schema: "viveiro-experiment-v1",
        parameters: { [key]: value },
      }),
    );
});
test("initial boundary conditions are observed and survive restore without reapplying stock", () => {
  const a = w({ initialFood: 30, initialRainPulse: 0.8, photoperiodHours: 10 });
  assert.equal(a.food, 30);
  assert.equal(a.landscape.rainPulse, 0.8);
  a.step(10);
  const copy = World.restore(a.snapshot());
  assert.equal(copy.food, a.food);
  a.step(10);
  copy.step(10);
  assert.deepEqual(copy.snapshot(), a.snapshot());
});
test("surface evaporation and diffusion controls alter transport, preserving finite positive fields", () => {
  const low = w({ surfaceEvaporationScale: 0.5 }),
    high = w({ surfaceEvaporationScale: 1.5 });
  low.pheromones[400] = high.pheromones[400] = 1;
  low.step();
  high.step();
  assert.ok(
    low.pheromones.reduce((a, b) => a + b) >
      high.pheromones.reduce((a, b) => a + b),
  );
  const a = w({ surfaceDiffusionScale: 0.5 }),
    b = w({ surfaceDiffusionScale: 1.5 });
  a.pheromones[400] = b.pheromones[400] = 1;
  a.step();
  b.step();
  assert.ok(a.pheromones[400] > b.pheromones[400]);
  assert.ok(b.pheromones.every((v) => Number.isFinite(v) && v >= 0));
});
test("optional axes normalize their key order consistently with the production Worker", async () => {
  const p = exampleSweep();
  p.parameter = "initialFood";
  p.values = [4, 20];
  p.replicates = 1;
  p.base.parameters.surfaceEvaporationScale = 1.2;
  for (const job of await sweepJobs(p))
    assert.deepEqual(job.plan, normalizeExperiment(job.plan));
});
