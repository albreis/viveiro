import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import {
  beginSiteSurvey,
  updateSiteSurvey,
} from "../src/modules/chambers/survey.ts";
import {
  rememberRoomClimate,
  knownBroodRoom,
} from "../src/modules/chambers/memory.ts";
import { validateChamberChoice } from "../src/modules/chambers/validation.ts";
import { chamberQuality } from "../src/modules/chambers/score.ts";
import { ensureSoilClimate } from "../src/modules/microclimate/initialize.ts";
import { climateCell } from "../src/modules/microclimate/grid.ts";
import { maternalBalance } from "../src/modules/maternal/pools.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
const ref = () => profileReference("generic-microclimate-demo", 1);
const newWorld = (founding = true) =>
  new World(
    "a",
    { humidity: 68, temperatureC: 25, soilWaterInitial: 55 },
    { founding, biologicalProfile: ref() },
  );
test("preference compares pore water and local temperature, with different queen and brood targets", () => {
  assert.equal(chamberQuality({ water: 0.55, temperature: 25 }, "queen"), 1);
  assert.ok(
    chamberQuality({ water: 0.65, temperature: 25 }, "brood") >
      chamberQuality({ water: 0.2, temperature: 25 }, "brood"),
  );
  assert.ok(chamberQuality({ water: 0.55, temperature: 45 }, "queen") < 1);
});
test("physical site survey and founding remain bounded, conserve resources and restore exactly", () => {
  const w = newWorld();
  w.predators = [];
  const before = { ...w.founding.site };
  let saved = false,
    maxStep = 0,
    saw = false;
  while (
    w.tick < 7000 &&
    !["established", "failed"].includes(w.founding.phase)
  ) {
    const q = w.ants[0],
      old = { x: q.x, y: q.y, z: q.z },
      phase = w.founding.phase;
    w.step();
    if (phase === "surveying") {
      saw = true;
      maxStep = Math.max(
        maxStep,
        Math.hypot(q.x - old.x, q.y - old.y, q.z - old.z),
      );
      if (!saved) {
        const copy = World.restore(w.snapshot());
        w.step(15);
        copy.step(15);
        assert.deepEqual(w.snapshot(), copy.snapshot());
        saved = true;
      }
    }
    if (w.tick % 100 === 0) {
      validateChamberChoice(w, true);
      assert.ok(Math.abs(maternalBalance(w.founding.maternal).error) < 1e-7);
      assert.ok(Math.abs(soilBalance(w).error) < 1e-7);
    }
  }
  const f = w.founding;
  assert.ok(saw && saved);
  assert.equal(f.survey.mode, "done");
  assert.ok(maxStep < 0.13);
  assert.notDeepEqual(f.site, before);
  assert.equal(
    f.phase,
    "established",
    JSON.stringify({
      tick: w.tick,
      phase: f.phase,
      events: w.events.slice(0, 3),
    }),
  );
  assert.ok(f.nanitics > 0);
  validateChamberChoice(w, true);
  for (const alter of [
    (s) => (s.best.water = -1),
    (s) => (s.steps = NaN),
    (s) => (s.mode = "omniscient"),
  ]) {
    const bad = w.snapshot();
    alter(bad.founding.survey);
    assert.throws(() => World.restore(bad), /Sondagem/);
  }
  console.log(
    JSON.stringify({
      tick: w.tick,
      site: f.site,
      survey: f.survey,
      maxStep,
      nanitics: f.nanitics,
    }),
  );
});
test("only physically visited rooms enter climate memory; unvisited improvements do not affect the decision", () => {
  const w = newWorld(false),
    soil = ensureSoilClimate(w),
    a = w.makeAnt("worker", 0, 0);
  w.ants.push(a);
  w.tick = 10;
  const visit = (id) => {
    const n = w.nest.nodes[id];
    Object.assign(a, { x: n.x, y: n.y - n.r * 0.9, z: n.z, node: id });
    rememberRoomClimate(w, a);
  };
  soil.temperature.fill(25);
  soil.water.fill(0.55 * soil.capacity);
  visit(2);
  assert.equal(a.roomMemory.rooms.length, 1);
  assert.equal(knownBroodRoom(w, a), 2);
  const unknown = climateCell(soil, w.nest.nodes[3]);
  soil.water[unknown] = 0.65 * soil.capacity;
  assert.equal(knownBroodRoom(w, a), 2);
  visit(3);
  const cell = climateCell(soil, a);
  soil.water[cell] = 0.65 * soil.capacity;
  rememberRoomClimate(w, a);
  assert.equal(knownBroodRoom(w, a), 3);
  w.tick += 401;
  assert.equal(knownBroodRoom(w, a), null);
  a.node = 2;
  a.x = 9;
  a.z = 6;
  rememberRoomClimate(w, a);
  assert.ok(a.roomMemory.rooms.every((r) => r.tick < w.tick));
  const bad = w.snapshot();
  bad.ants.find((x) => x.id === a.id).roomMemory.rooms[0].reading.water = -1;
  assert.throws(() => World.restore(bad), /Memória/);
});
test("previous profiles gain no survey or climate memory and reject incompatible new records", () => {
  const w = new World(
    "legacy",
    { humidity: 68 },
    { biologicalProfile: profileReference("generic-demo", 5) },
  );
  assert.equal(beginSiteSurvey(w), false);
  assert.equal(w.founding.survey, undefined);
  const a = w.makeAnt("worker", 0, 0);
  rememberRoomClimate(w, a);
  assert.equal(a.roomMemory, undefined);
});

test("nurse actually carries nearby brood toward a better remembered room without changing the goal at a similar chamber", async () => {
  const { makeBrood } = await import("../src/modules/colony/brood.ts");
  const { updateColonyWorker } =
    await import("../src/modules/colony/worker.ts");
  const { arriveColony } = await import("../src/modules/colony/arrival.ts");
  const w = newWorld(false),
    soil = ensureSoilClimate(w);
  soil.temperature.fill(25);
  soil.water.fill(0.55 * soil.capacity);
  w.tick = 10;
  const b = makeBrood(w, w.nextId++, 2);
  w.brood = [b];
  const a = w.makeAnt("worker", b.x, b.z);
  Object.assign(a, {
    x: b.x,
    y: b.y,
    z: b.z,
    node: 2,
    role: "nurse",
    nextTaskChoice: 10000,
    rest: 0,
    roomMemory: {
      version: 1,
      rooms: [{ node: 3, tick: 10, reading: { water: 0.65, temperature: 25 } }],
    },
  });
  w.ants.push(a);
  assert.equal(updateColonyWorker(w, a), true);
  assert.equal(a.bioTask.kind, "brood");
  assert.equal(a.bioTask.destination, 3);
  assert.equal(b.carrier, a.id);
  w.nest.nodes[4].type = "nursery";
  a.node = 4;
  arriveColony(w, a, 4);
  assert.equal(a.bioTask.destination, 3);
});
