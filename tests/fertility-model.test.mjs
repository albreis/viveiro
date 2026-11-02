import { founderGenome, GENES } from "../src/modules/genetics/genome.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import {
  initializeFertility,
  registerMating,
  updateFertility,
} from "../src/modules/fertility/model.ts";
import { validateFertility } from "../src/modules/fertility/validation.ts";
import { makeBrood } from "../src/modules/colony/brood.ts";
import { updateFlight } from "../src/modules/founding/flight.ts";
import { laySexualBrood } from "../src/modules/colonies/sexual-brood.ts";
import { addStock } from "../src/modules/stores/ledger.ts";
import { updateBroodLifecycle } from "../src/modules/colony/lifecycle.ts";
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
const balance = (w) => {
  for (const x of ledger(w).pools)
    assert.ok(Math.abs(x.received - x.viable - x.used - x.lost) < 1e-7);
  validateFertility(w, true);
};
function contact(w, male = w.ants.find((a) => a.kind === "male")) {
  const q = w.ants.find((a) => a.kind === "queen");
  Object.assign(q, { x: 0, y: 1, z: 0, airborne: true });
  Object.assign(male, { x: 0.1, y: 1, z: 0, airborne: true });
  w.founding.phase = "flight";
  return [q, male];
}
test("founding has no free sperm; actual airborne contact deposits once and landing prevents recharge", () => {
  const w = fresh(true),
    [q, m] = contact(w);
  assert.equal(ledger(w).pools.length, 0);
  m.x = 2;
  assert.equal(registerMating(w, q, m), false);
  m.x = 0.1;
  assert.equal(registerMating(w, q, m), true);
  assert.equal(registerMating(w, q, m), false);
  w.founding.phase = "landing";
  const second = w.makeAnt("male", q.x, q.z);
  w.ants.push(second);
  second.airborne = true;
  assert.equal(registerMating(w, q, second), false);
  assert.equal(ledger(w).pools[0].origin, "contact");
  balance(w);
});
test("flight transition records the real mate and pre-established scenario declares its assumption", () => {
  const w = fresh(true);
  w.founding.phase = "flight";
  w.founding.since = 0;
  for (w.tick = 1; w.tick < 240 && w.founding.phase === "flight"; w.tick++)
    updateFlight(w);
  assert.equal(w.founding.phase, "landing");
  assert.equal(ledger(w).pools.length, 1);
  assert.equal(ledger(w).pools[0].maleId, w.genetics.sire.id);
  balance(w);
  const established = fresh();
  assert.equal(ledger(established).pools[0].origin, "scenario");
  balance(established);
});
test("paid female capacity is finite; depletion produces haploid male eggs without injuring the queen", () => {
  const w = fresh(),
    health = w.queenHealth,
    qHealth = w.ants[0].health;
  for (let i = 0; i < 80; i++) {
    const b = makeBrood(w, w.nextId++);
    assert.equal(b.kind, "worker");
    assert.equal(b.genome.ploidy, 2);
    assert.equal(b.genome.fatherId, w.genetics.sire.id);
  }
  const b = makeBrood(w, w.nextId++);
  assert.equal(b.kind, "male");
  assert.equal(b.genome.ploidy, 1);
  assert.equal(b.genome.fatherId, undefined);
  assert.equal(b.fertilization.sireId, undefined);
  assert.equal(w.queenHealth, health);
  assert.equal(w.ants[0].health, qHealth);
  assert.equal(ledger(w).failed, 1);
  assert.equal(ledger(w).fertilized, 80);
  balance(w);
});
test("intentional haploid males consume no stored capacity and reproductive escrow is refunded if a gyne is impossible", () => {
  const w = fresh(),
    before = ledger(w).pools[0].viable;
  makeBrood(w, w.nextId++, 2, "male");
  assert.equal(ledger(w).pools[0].viable, before);
  assert.equal(ledger(w).intentionalMales, 1);
  const pool = ledger(w).pools[0];
  pool.used = 80;
  pool.viable = 0;
  ledger(w).fertilized = 80;
  ledger(w).femaleAttempts = 80;
  w.colony.reproductiveFood = 3;
  const food = w.food;
  assert.equal(laySexualBrood(w), false);
  assert.equal(w.colony.reproductiveFood, 0);
  assert.equal(w.food, food + 3);
  assert.equal(laySexualBrood(w), false);
  assert.equal(w.food, food + 3);
  balance(w);
});
test("multiple physically encountered fathers contribute bounded maternal/paternal haplotypes", () => {
  const w = fresh();
  w.founding = fresh(true).founding;
  initializeFertility(w);
  const [q, m] = contact(w);
  assert.equal(registerMating(w, q, m), true);
  const other = w.makeAnt("male", q.x, q.z);
  other.airborne = true;
  other.y = q.y;
  other.genome = founderGenome(w.seed, other.id, "male");
  w.ants.push(other);
  assert.equal(registerMating(w, q, other), true);
  const fathers = new Set();
  for (let i = 0; i < 40; i++) {
    const b = makeBrood(w, w.nextId++);
    fathers.add(b.genome.fatherId);
    const pool = ledger(w).pools.find((x) => x.maleId === b.genome.fatherId);
    for (let g = 0; g < pool.genome.haplotypes[0].length; g++)
      if (
        !b.genome.mutations.some(
          (x) =>
            x.copy === 1 &&
            x.locus ===
              [
                "locomotion",
                "size",
                "antennae",
                "mandibles",
                "efficiency",
                "activity",
                "courage",
                "exploration",
                "care",
                "cleaning",
                "digging",
              ][g],
        )
      )
        assert.equal(b.genome.haplotypes[1][g], pool.genome.haplotypes[0][g]);
  }
  assert.equal(fathers.size, 2);
  balance(w);
});
test("viability decays conservatively once per tick and cannot increase stored capacity", () => {
  const w = fresh(),
    pool = ledger(w).pools[0];
  w.tick = 100;
  updateFertility(w);
  assert.ok(pool.viable < 80);
  assert.ok(pool.lost > 0);
  const s = structuredClone(ledger(w));
  updateFertility(w);
  assert.deepEqual(ledger(w), s);
  w.tick = 1e7;
  updateFertility(w);
  assert.ok(pool.viable < 1);
  balance(w);
});
test("missing or inconsistent ledgers and paternal metadata are rejected on restore", () => {
  const w = fresh();
  w.brood.push(makeBrood(w, w.nextId++));
  for (const edit of [
    (x) => delete x.colony.fertility,
    (x) => x.colony.fertility.pools[0].viable++,
    (x) => x.colony.fertility.failed++,
    (x) =>
      x.colony.fertility.pools.push(
        structuredClone(x.colony.fertility.pools[0]),
      ),
    (x) => (x.brood[0].genome.fatherId = 999),
    (x) => delete x.brood[0].fertilization,
    (x) => delete x.brood[0].node,
  ]) {
    const bad = w.snapshot();
    edit(bad);
    assert.throws(() => World.restore(bad), /espermateca/);
  }
});
