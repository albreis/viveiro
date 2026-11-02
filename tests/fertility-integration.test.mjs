import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import { updateBroodLifecycle } from "../src/modules/colony/lifecycle.ts";
import { spawnDaughter } from "../src/modules/colonies/spawn.ts";
import { hatchWorker } from "../src/modules/colony/hatching.ts";
import { takeStock } from "../src/modules/stores/ledger.ts";
import { registerMating } from "../src/modules/fertility/model.ts";
import { validateFertility } from "../src/modules/fertility/validation.ts";
import { makeBrood } from "../src/modules/colony/brood.ts";
const fresh = (founding = false) =>
  new World(
    "fertility-fixture",
    { humidity: 68, light: 72 },
    {
      founding,
      biologicalProfile: profileReference("generic-fertility-demo", 1),
    },
  );
const ledger = (w) => w.colony.fertility;
const balance = (w) => validateFertility(w, true);
test("normal laying with exhausted capacity pays for male brood and never marks males as nanitics", () => {
  const w = fresh(),
    pool = {
      maleId: 2,
      genome: w.genetics.sire.genome,
      tick: 0,
      origin: "contact",
      received: 80,
      viable: 0,
      used: 80,
      lost: 0,
    };
  Object.assign(ledger(w), {
    pools: [pool],
    femaleAttempts: 80,
    fertilized: 80,
  });
  w.founding = fresh(true).founding;
  w.founding.phase = "claustral";
  w.tick = 100;
  const reserve = w.founding.reserves,
    health = w.queenHealth;
  updateBroodLifecycle(w, 0.8);
  assert.equal(w.brood.length, 4);
  assert.ok(
    w.brood.every(
      (b) => b.kind === "male" && !b.nanitic && b.genome.ploidy === 1,
    ),
  );
  assert.ok(w.founding.reserves < reserve);
  assert.equal(w.queenHealth, health);
  balance(w);
});
test("a saved reservoir resumes the identical numerical future", () => {
  const w = fresh();
  w.step(220);
  const copy = World.restore(w.snapshot());
  w.step(160);
  copy.step(160);
  assert.deepEqual(w.snapshot(), copy.snapshot());
  balance(w);
});

test("a fertile first generation keeps the previous profile numerical future except explicit reproductive records", () => {
  const a = new World(
      "fertility-fixture",
      { humidity: 68, light: 72 },
      {
        founding: false,
        biologicalProfile: profileReference("generic-microclimate-demo", 3),
      },
    ),
    b = fresh();
  a.step(250);
  b.step(250);
  const x = a.snapshot(),
    y = b.snapshot();
  delete x.biologicalProfile;
  delete y.biologicalProfile;
  delete y.colony.fertility;
  for (const brood of y.brood) delete brood.fertilization;
  assert.deepEqual(x, y);
});
test("a paid daughter receives her own empty reservoir and retains it independently through restore", () => {
  const w = fresh();
  const gyne = hatchWorker(w, makeBrood(w, w.nextId++, 2, "gyne")),
    male = hatchWorker(w, makeBrood(w, w.nextId++, 2, "male"));
  takeStock(w, 10.2, "sexual");
  const entry = w.nest.nodes[0];
  for (const a of [gyne, male])
    Object.assign(a, {
      node: null,
      x: entry.x + 0.6,
      y: entry.y + 0.1,
      z: entry.z,
      route: [],
    });
  const child = spawnDaughter(w, w, gyne, male);
  assert.ok(child);
  assert.equal(ledger(child).pools.length, 0);
  assert.equal(ledger(w).pools[0].used, 1);
  Object.assign(gyne, { airborne: true });
  Object.assign(male, { airborne: true });
  assert.equal(registerMating(child, gyne, male), true);
  assert.notEqual(ledger(w), ledger(child));
  assert.equal(ledger(child).pools[0].maleId, male.id);
  assert.equal(ledger(w).pools[0].used, 1);
  const copy = World.restore(w.snapshot());
  assert.deepEqual(
    copy.colonies[0].colony.fertility,
    JSON.parse(JSON.stringify(child.colony.fertility)),
  );
  balance(copy);
  balance(copy.colonies[0]);
});
