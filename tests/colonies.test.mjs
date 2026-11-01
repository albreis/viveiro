import { cohort, family } from "./fixtures/family.mjs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import {
  laySexualBrood,
  GYNE_COST,
  MALE_COST,
} from "../src/modules/colonies/sexual-brood.ts";
import { updateBroodLifecycle } from "../src/modules/colony/lifecycle.ts";
import { spawnDaughter } from "../src/modules/colonies/spawn.ts";
import { allAnts, allBrood } from "../src/modules/colonies/types.ts";
import { presentFamily } from "../src/modules/colonies/presentation.ts";
import { bindNeighbors } from "../src/modules/colonies/shared.ts";
import { updateNutrition } from "../src/modules/colony/nutrition.ts";
import {
  neighborsOf,
  invalidateNeighbors,
} from "../src/modules/navigation/sensors.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";

test("sexual brood is paid by stock and keeps haplodiploid ancestry after eclosion", () => {
  const { w, gyne, male, embryos } = cohort();
  assert.ok(Math.abs(w.food - (30 - GYNE_COST - MALE_COST)) < 1e-9);
  assert.ok(gyne.winged && gyne.sexual && gyne.foundressBudget === 8);
  assert.ok(male.winged && male.sexual);
  assert.equal(gyne.genome.ploidy, 2);
  assert.equal(gyne.genome.motherId, 1);
  assert.equal(gyne.genome.fatherId, 2);
  assert.equal(male.genome.ploidy, 1);
  assert.equal(male.genome.motherId, 1);
  assert.equal(male.genome.fatherId, undefined);
  assert.deepEqual(gyne.genome, embryos.find((b) => b.kind === "gyne").genome);
  assert.deepEqual(male.genome, embryos.find((b) => b.kind === "male").genome);
  assert.equal(
    laySexualBrood(w),
    false,
    "a live cohort prevents free duplicate founders",
  );
});
test("a daughter moves existing alates into an independent colony sharing only the habitat", () => {
  const { w, child, gyne, male } = family();
  assert.equal(allAnts(w).length, 3);
  assert.equal(w.ants.length, 1);
  assert.equal(child.ants.length, 2);
  assert.equal(child.nest, w.nest);
  assert.equal(child.soil, w.soil);
  assert.notEqual(child.genetics, w.genetics);
  assert.notEqual(child.colony, w.colony);
  assert.equal(child.parentColonyId, 1);
  assert.equal(child.colonyId, 2);
  assert.equal(child.genetics.queen.id, gyne.id);
  assert.equal(child.genetics.sire.id, male.id);
  assert.equal(child.founding.reserves, 8);
  assert.equal(child.food, 0);
  assert.equal(child.founding.phase, "flight");
  assert.equal(
    spawnDaughter(w, w, gyne, male),
    null,
    "the same adults cannot be allocated twice",
  );
  const before = w.food;
  child.food = 4;
  assert.equal(w.food, before);
  child.food = 0;
  const view = presentFamily(w);
  assert.equal(view.population, 3);
  assert.equal(view.ants.filter((a) => a.kind === "queen").length, 2);
});
test("physical neighbors are shared but social food is not exchanged between colonies", () => {
  const { w, child } = family();
  const donor = w.makeAnt("worker", 0, 0),
    receiver = child.makeAnt("worker", 0.2, 0);
  receiver.id = w.nextId++;
  w.ants.push(donor);
  child.ants.push(receiver);
  donor.crop = 0.6;
  receiver.crop = 0;
  donor.energy = receiver.energy = 100;
  for (const a of allAnts(w))
    if (a !== donor && a !== receiver) {
      a.x = 7;
      a.z = 5;
    }
  bindNeighbors(w);
  invalidateNeighbors(w);
  invalidateNeighbors(child);
  assert.ok(neighborsOf(child, receiver).some((a) => a.id === donor.id));
  updateNutrition(w);
  updateNutrition(child);
  assert.equal(donor.crop, 0.6);
  assert.equal(receiver.crop, 0);
});
test("two-colony snapshots restore shared habitat and exactly reproduce the future", () => {
  const { w } = family("persist-family");
  w.step(150);
  const restored = World.restore(w.snapshot());
  assert.equal(restored.colonies[0].nest, restored.nest);
  assert.equal(restored.colonies[0].soil, restored.soil);
  w.step(120);
  restored.step(120);
  assert.deepEqual(restored.snapshot(), w.snapshot());
});
test("a daughter excavates a different access and produces a second inherited generation", () => {
  const { w, child } = family("second-generation");
  w.food = 0;
  let maxJump = 0;
  for (let i = 0; i < 4000 && child.founding.phase !== "established"; i++) {
    const q = child.ants.find((a) => a.kind === "queen");
    assert.ok(q);
    const p = { x: q.x, y: q.y, z: q.z };
    w.step();
    maxJump = Math.max(maxJump, Math.hypot(q.x - p.x, q.y - p.y, q.z - p.z));
    assert.ok(Math.abs(soilBalance(w).error) < 1e-7);
  }
  assert.equal(child.founding.phase, "established");
  assert.ok(child.founding.entry >= 9);
  assert.ok(child.founding.front >= 10);
  assert.equal(w.nest.nodes[child.founding.entry].colonyId, 2);
  assert.equal(w.nest.nodes[child.founding.front].type, "royal");
  assert.ok(
    child.ants.some(
      (a) =>
        a.kind === "worker" &&
        a.genome.generation === 2 &&
        a.genome.motherId === child.genetics.queen.id &&
        a.genome.fatherId === child.genetics.sire.id,
    ),
  );
  const ids = allAnts(w).map((a) => a.id);
  assert.equal(ids.length, new Set(ids).size);
  assert.ok(allAnts(w).length + allBrood(w).length <= 450);
  assert.ok(maxJump < 0.12);
  console.log("daughter founding", {
    ticks: w.tick - 2600,
    maxJump,
    entry: child.founding.entry,
    nanitics: child.founding.nanitics,
  });
});
test("alates walk out of the source nest before a rain-triggered daughter flight", () => {
  const { w, gyne, male } = cohort("departure");
  gyne.age = male.age = 1.2;
  let maxJump = 0;
  for (let i = 0; i < 1800 && w.colonies.length === 0; i++) {
    if (i % 180 === 0) {
      w.landscape.rainPulse = 1;
      w.params.humidity = 68;
    }
    const p = { x: gyne.x, y: gyne.y, z: gyne.z };
    w.step();
    maxJump = Math.max(
      maxJump,
      Math.hypot(gyne.x - p.x, gyne.y - p.y, gyne.z - p.z),
    );
  }
  assert.equal(w.colonies.length, 1);
  assert.equal(gyne.node, null);
  assert.equal(male.node, null);
  assert.ok(maxJump < 0.13);
  assert.ok(gyne.distanceWalked > 1);
});
