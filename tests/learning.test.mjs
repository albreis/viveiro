import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createBrain,
  forward,
  trainValue,
  validBrain,
  learningRng,
} from "../src/modules/learning/network.ts";
import { trainBrain, trainingEpisode } from "../src/modules/learning/train.ts";
import { localFeatures } from "../src/modules/learning/policy.ts";
import {
  createLearning,
  chooseLearnedExit,
  finishLearningEdge,
  learningTick,
  learningDeath,
} from "../src/modules/learning/live.ts";
import { World } from "./fixtures/established-world.mjs";
test("small neural values reproduce by seed, train on error and remain finite under extreme rewards", () => {
  const a = createBrain("neurons"),
    b = createBrain("neurons");
  assert.deepEqual(a, b);
  assert.ok(validBrain(a));
  const x = [0.3, 0, 0, 1, 1, 1],
    before = Math.abs(forward(a, x).value - 0.7);
  for (let i = 0; i < 300; i++) trainValue(a, x, 0.7);
  assert.ok(Math.abs(forward(a, x).value - 0.7) < before * 0.2);
  for (let i = 0; i < 1000; i++) trainValue(a, x, i % 2 ? 1e6 : -1e6);
  assert.ok(validBrain(a));
  assert.ok(Number.isFinite(forward(a, x).value));
  const malformed = structuredClone(a);
  malformed.input[0] = NaN;
  assert.equal(validBrain(malformed), false);
});
test("feature vectors contain only local sensed cues and bounded recent experience", () => {
  const f = localFeatures(
    {
      id: 987654,
      signal: 4,
      visited: true,
      visits: 100,
      backtrack: true,
      goalVisible: false,
      comfort: 0.2,
    },
    true,
  );
  assert.equal(f.length, 6);
  assert.ok(f.every((n) => n >= -1 && n <= 1));
  assert.ok(!f.includes(987654));
  assert.equal(f[5], 1);
});
test("held-out graph deliveries improve over an untrained network and are compared with the same ACO baseline", () => {
  for (const seed of ["VIVEIRO-RL-1", "VIVEIRO-RL-2"]) {
    const r = trainBrain(seed);
    assert.ok(validBrain(r.brain));
    assert.ok(r.report.trained.deliveries > r.report.untrained.deliveries + 30);
    assert.ok(r.report.trained.deliveries >= 60);
    assert.equal(r.report.baseline.deliveries, 64);
    assert.ok(r.report.trained.meanSteps <= r.report.baseline.meanSteps + 1);
    assert.deepEqual(trainBrain(seed), r);
  }
});
test("separate agents change only their own network and leave the colony template unchanged", () => {
  const w = new World("individual-brains");
  w.learning = createLearning("brain-test");
  const template = structuredClone(w.learning.brain);
  const a = w.makeAnt("worker", 0, 0),
    b = w.makeAnt("worker", 0, 0);
  a.node = b.node = 0;
  const options = [
    {
      id: 1,
      signal: 0.02,
      visited: false,
      backtrack: false,
      goalVisible: true,
      comfort: 1,
    },
    {
      id: 2,
      signal: 0,
      visited: false,
      backtrack: false,
      goalVisible: false,
      comfort: 1,
    },
  ];
  chooseLearnedExit(w, a, options, () => 0.9);
  chooseLearnedExit(w, b, options, () => 0.9);
  const other = structuredClone(b.learningBrain);
  finishLearningEdge(w, a, true);
  assert.notDeepEqual(a.learningBrain, b.learningBrain);
  assert.deepEqual(b.learningBrain, other);
  assert.deepEqual(w.learning.brain, template);
  assert.equal(w.learning.updates, 1);
});
test("contacts, hunger, retreat and terminal death create local negative feedback", () => {
  const w = new World("feedback");
  w.learning = createLearning("feedback");
  const a = w.makeAnt("worker", 0, 0);
  a.node = 0;
  a.energy = 10;
  const options = [
    { id: 1, signal: 0, visited: false, backtrack: false, goalVisible: false },
  ];
  chooseLearnedExit(w, a, options, () => 0.9);
  a.navigation = { contactTicks: 10 };
  learningTick(w, a);
  assert.ok(a.learningTrace.reward < 0);
  finishLearningEdge(w, a, false, true);
  assert.ok(a.learningTrace.reward < -0.1);
  learningDeath(w, a);
  assert.ok(w.learning.reward < -0.5);
  assert.equal(a.learningTrace, undefined);
  assert.equal(w.learning.updates, 1);
});
test("training limits are explicit and baseline choices are sampled once per step", () => {
  assert.throws(() => trainBrain("limit", Infinity), RangeError);
  assert.throws(() => trainBrain("limit", 0), RangeError);
  const brain = createBrain("baseline");
  for (let i = 0; i < 50; i++) {
    const r = trainingEpisode(brain, "baseline:" + i, "aco");
    assert.ok(r.steps > 0 && r.steps <= 100 && Number.isFinite(r.reward));
  }
});
