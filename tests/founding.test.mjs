import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { World as Established } from "./fixtures/established-world.mjs";
import { flightReadiness } from "../src/modules/founding/flight.ts";
import { sampleSupport, sampleSoil } from "../src/modules/terrain/field.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
const until = (w, predicate, limit = 3500) => {
  for (let i = 0; i < limit && !predicate(); i++) w.step();
  assert.ok(predicate(), "phase=" + w.founding.phase + " tick=" + w.tick);
};
const maternalError = (f) =>
  f.initialReserves -
  f.reserves -
  Object.values(f.spent).reduce((a, b) => a + b, 0);

test("a new terrarium has intact soil, two winged founders and no borrowed colony stock", () => {
  const w = new World("intact", { humidity: 30, light: 20 });
  assert.equal(w.nest.nodes.length, 0);
  assert.equal(w.nest.links.length, 0);
  assert.equal(w.food, 0);
  assert.equal(w.ants.length, 2);
  assert.ok(w.ants.every((a) => a.winged && a.node === null && a.crop === 0));
  assert.ok(
    sampleSoil(w.nest, { x: w.founding.site.x, y: -0.5, z: w.founding.site.z })
      .distance < 0,
  );
  w.step(200);
  assert.equal(w.founding.phase, "weather");
  assert.equal(w.brood.length, 0);
  assert.equal(w.founding.matedTick, undefined);
  assert.ok(Math.abs(maternalError(w.founding)) < 1e-9);
});
test("the flight window responds to rain memory, moisture and the current light proxy", () => {
  const w = new World("climate", { humidity: 30, light: 20 });
  assert.equal(flightReadiness(w), 0);
  w.intervene("humidity", 0, 0, 62);
  w.intervene("light", 0, 0, 75);
  assert.equal(flightReadiness(w), 0);
  w.intervene("rain");
  assert.ok(flightReadiness(w) > 0);
  until(w, () => w.founding.phase === "flight", 200);
  until(w, () => w.founding.matedTick !== undefined, 100);
  assert.ok(w.ants.every((a) => (a.y || 0) > 0.4));
  assert.equal(w.nest.nodes.length, 0);
  assert.equal(w.brood.length, 0);
  until(w, () => w.founding.phase === "digging", 100);
  assert.equal(w.ants.find((a) => a.kind === "queen").winged, false);
  assert.equal(w.founding.discardedWings.length, 4);
});
test("foundresses excavate, haul material and rear smaller first workers without teleporting or floating", () => {
  for (const seed of ["SEMENTE-42", "life", "rain"]) {
    const w = new World(seed, { humidity: 68 });
    w.predators = [];
    let maxGap = 0,
      maxStep = 0;
    let sawHaul = false;
    until(w, () => {
      const q = w.ants.find((a) => a.kind === "queen");
      assert.ok(q);
      if (q.previousX !== undefined) {
        const d = Math.hypot(
          q.x - q.previousX,
          q.y - q.previousY,
          q.z - q.previousZ,
        );
        maxStep = Math.max(maxStep, d);
        assert.ok(d <= Math.max(0.075, q.speed * 0.85) + 0.0003);
      }
      if (w.founding.phase === "digging")
        maxGap = Math.max(
          maxGap,
          Math.abs(sampleSupport(w.nest, q).distance - 0.008),
        );
      if (q.carryingSoil > 0.01) sawHaul = true;
      assert.ok(Math.abs(soilBalance(w).error) < 1e-8);
      assert.ok(Math.abs(maternalError(w.founding)) < 1e-8);
      if (w.founding.phase !== "established") assert.equal(w.food, 0);
      return w.founding.phase === "established";
    });
    assert.ok(maxGap < 0.025);
    assert.ok(sawHaul && w.founding.trips > 2);
    assert.ok(w.soil.deposited > 0.5);
    assert.equal(w.workers.length, 4);
    assert.ok(
      w.workers.every(
        (a) =>
          a.nanitic &&
          a.caste === "minor" &&
          a.bodyScale < 0.8 &&
          a.genome.motherId === 1 &&
          a.genome.fatherId === 2,
      ),
    );
    assert.equal(w.nest.nodes.length, 2);
    assert.equal(w.nest.nodes[1].type, "royal");
    assert.ok(
      w.founding.spent.eggs > 0 &&
        w.founding.spent.larvae > 0 &&
        w.founding.reserves > 0,
    );
    console.log("founding", seed, {
      tick: w.tick,
      maxGap,
      maxStep,
      trips: w.founding.trips,
      reserves: w.founding.reserves,
    });
  }
});
test("one claustral clutch consumes maternal reserves even when inaccessible external stock exists", () => {
  const w = new World("closed", { humidity: 68 });
  w.predators = [];
  until(w, () => w.founding.phase === "claustral");
  w.food = 100;
  const before = w.founding.reserves;
  w.step(80);
  assert.equal(w.brood.length, 4);
  assert.equal(w.food, 100);
  assert.ok(w.founding.reserves < before - 0.84);
  assert.equal(w.founding.firstClutch, true);
});
test("insufficient maternal reserves cannot be replaced by stock before workers exist", () => {
  const w = new World("empty");
  w.founding.phase = "claustral";
  w.founding.reserves = 0;
  w.food = 100;
  w.step(850);
  assert.equal(w.founding.phase, "failed");
  assert.equal(w.brood.length, 0);
  assert.equal(w.workers.length, 0);
  assert.equal(w.founding.reserves, 0);
  assert.ok(!w.ants.some((a) => a.kind === "queen"));
});
test("flight, excavation and brood snapshots preserve the exact future and resource ledgers", () => {
  for (const ticks of [35, 650, 1900]) {
    const w = new World("SEMENTE-42", { humidity: 68 });
    w.predators = [];
    w.step(ticks);
    const before = w.snapshot(),
      restored = World.restore(before);
    w.step(160);
    restored.step(160);
    assert.equal(before.tick, ticks);
    assert.deepEqual(restored.snapshot(), w.snapshot());
  }
});
test("old nests retain their geometry and do not restart a flight on restore", () => {
  const w = new Established("legacy-foundation");
  w.step(30);
  const before = w.snapshot();
  const restored = World.restore(before);
  assert.equal(restored.founding, undefined);
  assert.deepEqual(restored.nest, before.nest);
  assert.equal(restored.nest.nodes.length, 9);
  assert.ok(restored.brood.length > 0);
});
test("new workers can forage and return food through the single founding entrance", () => {
  const w = new World("SEMENTE-42", { humidity: 68 });
  w.predators = [];
  until(w, () => w.founding.phase === "established");
  const m = w.nest.nodes[0];
  w.intervene("food", m.x - 0.85, m.z);
  const exited = new Set();
  let delivered = false;
  for (let i = 0; i < 1000; i++) {
    w.step();
    for (const a of w.workers) if (a.node === null) exited.add(a.id);
    if (w.food > 0.01) delivered = true;
  }
  assert.ok(exited.size >= 2);
  assert.ok(delivered);
  assert.ok(
    w.born > 4,
    "later reproduction must be paid by food returned by workers",
  );
});
