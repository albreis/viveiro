import { sampleSupport } from "../src/modules/terrain/field.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { World } from "./fixtures/established-world.mjs";
import { family } from "./fixtures/family.mjs";
import { trainBrain } from "../src/modules/learning/train.ts";
import { createLearning } from "../src/modules/learning/live.ts";
import { colonyWorlds } from "../src/modules/colonies/types.ts";
import { requestRoute } from "../src/modules/navigation/local-routing.ts";
import { tunnelFooting } from "../src/modules/terrain/surface-queries.ts";
test("disabled learning exactly preserves the default simulation and does not consume RNG", () => {
  const a = new World("baseline-preserved"),
    b = World.restore(a.snapshot());
  b.learning = createLearning("off");
  b.learning.enabled = false;
  a.step(300);
  b.step(300);
  const one = a.snapshot(),
    two = b.snapshot();
  delete two.learning;
  assert.ok(
    isDeepStrictEqual(one, two),
    "disabled hook altered the baseline state",
  );
});
test("policy application is validated, isolated per colony, reversible and replayable", () => {
  const { w } = family("learning-family"),
    result = trainBrain("family-training");
  const before = w.rng;
  assert.equal(
    w.intervene("learningPolicy", 0, 0, { brain: {}, report: {} }),
    false,
  );
  assert.equal(w.learning, undefined);
  assert.equal(w.intervene("learningPolicy", 0, 0, result), true);
  assert.equal(w.rng, before);
  assert.ok(colonyWorlds(w).every((c) => c.learning?.enabled));
  assert.notEqual(w.learning.brain, w.colonies[0].learning.brain);
  w.step(30);
  const restored = World.restore(w.snapshot());
  w.step(40);
  restored.step(40);
  assert.ok(
    isDeepStrictEqual(w.snapshot(), restored.snapshot()),
    "learning restore changed future",
  );
  const weights = structuredClone(w.learning.brain);
  w.intervene("learningEnabled", 0, 0, 0);
  assert.ok(colonyWorlds(w).every((c) => !c.learning.enabled));
  w.intervene("learningEnabled", 0, 0, 1);
  assert.deepEqual(w.learning.brain, weights);
});
test("a learned policy steers a real supported worker with bounded motion and persistent individual weights", () => {
  const w = new World("learned-motion"),
    r = trainBrain("motion-training"),
    from = w.nest.nodes[4],
    to = w.nest.nodes[8];
  const pose = tunnelFooting(w.nest, from, to, from, 0);
  const a = w.makeAnt("worker", pose.x, pose.z);
  Object.assign(a, pose, {
    normal: pose.normal,
    node: 4,
    route: [],
    tunnelCenter: { ...from },
    tunnelY: from.y,
    role: "forager",
    nextTaskChoice: 1e6,
  });
  w.ants = [a];
  w.brood = [];
  w.predators = [];
  w.lastLaying = 1e7;
  w.intervene("learningPolicy", 0, 0, r);
  requestRoute(w, a, 0);
  let walked = 0,
    maxStep = 0;
  for (let i = 0; i < 350; i++) {
    const p = { x: a.x, y: a.y, z: a.z };
    w.step();
    const d = Math.hypot(a.x - p.x, a.y - p.y, a.z - p.z);
    if (i % 5 === 0)
      assert.ok(
        Math.abs(
          sampleSupport(w.nest, { x: a.x, y: a.y, z: a.z }).distance - 0.008,
        ) < 0.035,
        "learned worker lost terrain support",
      );
    walked += d;
    maxStep = Math.max(maxStep, d);
    assert.ok(d <= a.speed * 1.2 + 0.002, "learned route teleported a body");
  }
  assert.ok(walked > 0.5);
  assert.ok(w.learning.decisions > 0);
  assert.ok(a.learningBrain);
  assert.ok(w.learning.updates > 0);
  const restored = World.restore(w.snapshot());
  w.step(40);
  restored.step(40);
  assert.ok(
    isDeepStrictEqual(w.snapshot(), restored.snapshot()),
    "individual brain future changed",
  );
});
