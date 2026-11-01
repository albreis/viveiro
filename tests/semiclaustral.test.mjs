import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import {
  profileReference,
  resolveBiologicalProfile,
  latestProfileReference,
} from "../src/modules/biology/catalog.ts";
import {
  foragingBalance,
  loseFoundressLoad,
} from "../src/modules/semiclaustral/budget.ts";
import { validateFoundressForaging } from "../src/modules/semiclaustral/validation.ts";
import { updateFoundressForaging } from "../src/modules/semiclaustral/update.ts";
import { outsideSite } from "../src/modules/founding/site.ts";
import { spendReserve } from "../src/modules/founding/types.ts";
import { maternalBalance } from "../src/modules/maternal/pools.ts";
import { validateMaternalFounding } from "../src/modules/maternal/validation.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
import { surfaceHeight } from "../src/modules/landscape/queries.ts";
import { updateBroodLifecycle } from "../src/modules/colony/lifecycle.ts";
import { updatePredators } from "../src/modules/simulation/predator-step.js";
const ref = () => profileReference("generic-semiclaustral-demo", 1);
function fresh(seed = "a") {
  const w = new World(
    seed,
    { humidity: 68, temperatureC: 25 },
    { biologicalProfile: ref() },
  );
  w.predators = [];
  w.plants = [];
  w.patches = [];
  return w;
}
function balanced(w) {
  validateFoundressForaging(w.founding, true);
  validateMaternalFounding(w.founding, true);
  assert.ok(Math.abs(maternalBalance(w.founding.maternal).error) < 1e-7);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-7);
}
test("semiclaustral strategy has its own immutable profile and does not change old defaults", () => {
  const p = resolveBiologicalProfile(ref());
  assert.equal(p.foundation, "semiclaustral");
  assert.equal(p.entranceModel, "open");
  assert.equal(p.modelRevision, 6);
  assert.equal(latestProfileReference().version, 5);
  const old = new World(
    "a",
    {},
    { biologicalProfile: profileReference("generic-demo", 5) },
  );
  assert.equal(old.founding.foraging, undefined);
  balanced(fresh());
});
test("external pantry finances costs separately without refilling initial tissue or overdraw", () => {
  const w = fresh(),
    f = w.founding,
    s = f.foraging;
  s.collected = s.delivered = s.pantry = 1;
  const initial = { ...f.maternal.initial };
  assert.equal(spendReserve(w, "eggs", 1.2), 1.2);
  assert.equal(s.consumed, 1);
  assert.equal(s.pantry, 0);
  assert.deepEqual(f.maternal.initial, initial);
  assert.ok(Math.abs(f.maternal.consumed.protein - 0.2) < 1e-10);
  balanced(w);
  s.collected += 0.65;
  s.load = 0.65;
  w.ants[0].carrying = 0.65;
  loseFoundressLoad(w, w.ants[0]);
  assert.equal(s.lost, 0.65);
  assert.equal(s.load, 0);
  balanced(w);
  for (const mutate of [
    (a) => (a.foraging.load = 1),
    (a) => (a.foraging.delivered += 1),
    (a) => (a.foraging.pantry = -1),
    (a) => (a.foraging.phase = "flying"),
  ]) {
    const b = structuredClone(f);
    mutate(b);
    assert.throws(() => validateFoundressForaging(b, true));
  }
  assert.throws(() => validateFoundressForaging(f, false));
});
test("queen only detects nearby finite patches and cannot pay the first clutch from remote stock", () => {
  const w = fresh(),
    f = w.founding,
    q = w.ants[0],
    s = f.foraging;
  f.phase = "semiclaustral";
  f.front = 0;
  w.nest.nodes = [{ ...f.chamber, r: 0.68, type: "royal", name: "fixture" }];
  s.phase = "searching";
  q.node = null;
  Object.assign(q, {
    x: 0,
    y: surfaceHeight(w.nest.relief, 0, 0) + 0.008,
    z: 0,
  });
  q.winged = false;
  w.food = 100;
  w.tick = 100;
  w.patches = [
    { id: 900, x: 8, z: 0, amount: 5, capacity: 5, discovered: false },
  ];
  updateFoundressForaging(w);
  assert.equal(s.load, 0);
  assert.equal(s.heading, 0);
  w.patches[0].x = q.x;
  w.patches[0].z = q.z;
  const amount = w.patches[0].amount;
  updateFoundressForaging(w);
  assert.equal(s.load, 0.65);
  assert.ok(Math.abs(w.patches[0].amount - (amount - 0.65)) < 1e-10);
  assert.equal(s.pantry, 0);
  updateBroodLifecycle(w, 1);
  assert.equal(w.brood.length, 0);
  assert.equal(w.food, 100);
  s.collected = s.delivered = s.pantry = 1;
  s.load = 0;
  s.phase = "outbound";
  updateBroodLifecycle(w, 1);
  assert.equal(w.brood.length, 0);
});
test("outside semiclaustral queen is exposed to the same surface predator capture rule", () => {
  const w = fresh(),
    q = w.ants[0];
  q.node = null;
  q.x = 0;
  q.z = 0;
  q.y = 0.008;
  w.nest.nodes = [];
  w.founding.foraging.phase = "searching";
  w.predators = [{ x: 0.1, z: 0, energy: 100, cooldown: 0, prey: 0, angle: 0 }];
  w.random = () => 0;
  w.moveSurface = () => true;
  const dead = new Set();
  updatePredators(w, dead);
  assert.ok(dead.has(q.id));
  assert.equal(q.deathCause, "predation");
});
test("physical semiclaustral founding consumes finite external food, preserves saves mid-trip and hands off only at home", () => {
  const w = fresh(),
    f = w.founding,
    out = outsideSite(f, 1.35);
  w.patches = [
    {
      id: 900,
      ...out,
      amount: 5,
      capacity: 5,
      discovered: false,
      supplemental: true,
    },
  ];
  let maxStep = 0,
    saved = false,
    externalBefore = 0;
  while (w.tick < 10000 && !["established", "failed"].includes(f.phase)) {
    const q = w.ants.find((a) => a.kind === "queen");
    assert.ok(q);
    const old = { x: q.x, y: q.y, z: q.z };
    const phase = f.phase;
    w.step();
    if (
      !q.airborne &&
      !["flight", "landing", "dealate", "weather"].includes(phase)
    )
      maxStep = Math.max(
        maxStep,
        Math.hypot(q.x - old.x, q.y - old.y, q.z - old.z),
      );
    if (w.tick % 100 === 0) balanced(w);
    if (!saved && f.foraging.load > 0) {
      const snapshot = w.snapshot(),
        copy = World.restore(snapshot);
      w.step(20);
      copy.step(20);
      assert.deepEqual(copy.snapshot(), w.snapshot());
      saved = true;
      externalBefore = f.foraging.collected;
    }
  }
  assert.equal(
    f.phase,
    "established",
    JSON.stringify({
      tick: w.tick,
      phase: f.phase,
      queen: w.queenHealth,
      foraging: f.foraging,
      events: w.events.slice(0, 4),
    }),
  );
  assert.ok(f.nanitics > 0);
  assert.ok(saved && externalBefore > 0);
  assert.ok(f.foraging.delivered >= 0.84);
  assert.ok(f.foraging.consumed >= 0.84);
  assert.equal(f.foraging.load, 0);
  assert.equal(f.foraging.phase, "nursing");
  assert.equal(f.foraging.pantry, 0);
  assert.ok(f.foraging.exported >= 0);
  assert.ok(maxStep < 0.13);
  assert.equal(f.seal, undefined);
  balanced(w);
  console.log(
    JSON.stringify({
      tick: w.tick,
      nanitics: f.nanitics,
      maxStep,
      foraging: f.foraging,
      maternal: f.reserves,
    }),
  );
});

test("surface exposure follows colony ownership rather than the root strategy", async () => {
  const { exposedFoundress } =
    await import("../src/modules/semiclaustral/exposure.ts");
  const w = fresh(),
    q = w.ants[0];
  q.node = null;
  q.colonyId = 2;
  w.colonies = [{ colonyId: 2, founding: {} }];
  w.founding.foraging.phase = "searching";
  assert.equal(exposedFoundress(w, q), false);
  w.colonies[0].founding.foraging = { phase: "searching" };
  assert.equal(exposedFoundress(w, q), true);
  q.node = 0;
  assert.equal(exposedFoundress(w, q), false);
});
test("empty surroundings never fund a semiclaustral clutch and exhaustion is a possible outcome", () => {
  const w = fresh("empty-semi"),
    f = w.founding;
  while (w.tick < 10000 && f.phase !== "failed") w.step();
  assert.equal(w.brood.length, 0);
  assert.equal(f.firstClutch, false);
  assert.equal(f.foraging.collected, 0);
  assert.equal(f.phase, "failed");
  balanced(w);
});
