import { test } from "node:test";
import assert from "node:assert/strict";
import { seasonFixture } from "./fixtures/season.mjs";
import {
  finishCocoon,
  COCOON_COST,
} from "../src/modules/development/cocoon.ts";
import { updateBroodLifecycle } from "../src/modules/colony/lifecycle.ts";
import { World } from "../src/modules/simulation/world.js";
import {
  profileReference,
  resolveBiologicalProfile,
} from "../src/modules/biology/catalog.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
import { maternalBalance } from "../src/modules/maternal/pools.ts";
const near = (a, b = 0) => assert.ok(Math.abs(a - b) < 1e-8);
test("the first revision of a naked-pupa profile enables current mechanisms without pretending its identity version is the model revision", () => {
  const { w, b } = seasonFixture("generic-naked-demo", 1),
    p = resolveBiologicalProfile(w.biologicalProfile);
  assert.equal(p.version, 1);
  assert.equal(p.modelRevision, 5);
  assert.ok(w.colony.season && b.development && w.biologicalProfile);
  assert.equal(b.cocoon, undefined);
  b.age = 0.9;
  w.food = 0;
  finishCocoon(w, b);
  assert.equal(b.age, 0.9);
});
test("a cocoon cannot be built for free, partial payments persist and a completed cocoon is not charged twice", () => {
  const { w, b } = seasonFixture();
  b.age = 0.9;
  w.food = 0;
  finishCocoon(w, b);
  assert.equal(b.cocoon.built, false);
  assert.ok(b.age < 0.9);
  w.food = COCOON_COST / 2;
  b.age = 0.9;
  finishCocoon(w, b);
  near(b.cocoon.paid, COCOON_COST / 2);
  assert.equal(b.cocoon.built, false);
  near(w.food);
  w.food = COCOON_COST / 2;
  b.age = 0.9;
  finishCocoon(w, b);
  assert.equal(b.cocoon.built, true);
  near(b.cocoon.paid, COCOON_COST);
  near(w.food);
  finishCocoon(w, b);
  near(w.food);
});
test("emergence leaves an empty cocoon as waste without refunding its nutrient cost, while corrupted pupal records are rejected", () => {
  const { w, b } = seasonFixture();
  b.age = 0.9;
  w.food = COCOON_COST;
  finishCocoon(w, b);
  const raw = w.snapshot(),
    bad = structuredClone(raw);
  bad.brood[0].cocoon.built = false;
  assert.throws(() => World.restore(bad), /casulo/);
  b.age = 1.3;
  updateBroodLifecycle(w, 1);
  assert.equal(w.brood.length, 0);
  assert.ok(w.colony.waste.some((x) => x.kind === "cocoon"));
  near(w.food);
});
test("a seasonal cocoon-bearing profile still completes paid founding and reopening before its endogenous summer timer starts", () => {
  const w = new World(
    "a",
    { humidity: 68 },
    { biologicalProfile: profileReference("generic-demo", 5) },
  );
  let sawCocoons = false;
  while (
    w.tick < 7000 &&
    !["established", "failed"].includes(w.founding.phase)
  ) {
    w.step();
    sawCocoons ||= w.brood.some((b) => b.cocoon?.built);
  }
  assert.equal(w.founding.phase, "established");
  assert.ok(w.founding.nanitics > 0 && sawCocoons);
  assert.ok(w.colony.waste.some((x) => x.kind === "cocoon"));
  assert.equal(w.colony.season.phase, "active");
  assert.ok(w.colony.season.activeTicks < 2);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-7);
  assert.ok(Math.abs(maternalBalance(w.founding.maternal).error) < 1e-7);
  console.log(
    JSON.stringify({
      profile: 5,
      established: w.tick,
      nanitics: w.founding.nanitics,
      reserve: w.founding.reserves,
      cycles: w.colony.season.cycles,
    }),
  );
});
