import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import {
  addStock,
  takeStock,
  stockBalance,
} from "../src/modules/stores/ledger.ts";
import { validateRoomStores } from "../src/modules/stores/validation.ts";
import { knownStorageRoom } from "../src/modules/stores/destination.ts";
import { ensureSoilClimate } from "../src/modules/microclimate/initialize.ts";
import { climateCell } from "../src/modules/microclimate/grid.ts";
import { spoilStocks } from "../src/modules/colony/waste.ts";
import { feedFromStock } from "../src/modules/colony/nutrition.ts";
const fresh = (founding = false) =>
  new World(
    "stock-fixture",
    { humidity: 68, temperatureC: 25, soilWaterInitial: 55 },
    {
      founding,
      biologicalProfile: profileReference("generic-microclimate-demo", 2),
    },
  );
const valid = (w) => {
  validateRoomStores(w, true);
  const b = stockBalance(w);
  assert.ok(Math.abs(b.ledger) < 1e-7 && Math.abs(b.rooms) < 1e-7);
};
test("initial food and every delivery, debit and refund have a conservative room ledger", () => {
  const w = fresh();
  assert.equal(w.colony.stores.initial, 18);
  valid(w);
  takeStock(w, 18, "brood");
  addStock(w, 2, "foraged", 2);
  addStock(w, 3, "foraged", 3);
  valid(w);
  assert.equal(takeStock(w, 4, "care", 2, true), 2);
  assert.equal(w.food, 3);
  assert.equal(takeStock(w, 8, "sexual"), 3);
  assert.equal(w.food, 0);
  addStock(w, 1, "refund", 3);
  valid(w);
  for (const edit of [
    (s) => (s.bins[0].amount += 1),
    (s) => (s.outgoing += 1),
    (s) => (s.flows.invalid = 1),
  ]) {
    const bad = w.snapshot();
    edit(bad.colony.stores);
    assert.throws(() => World.restore(bad), /alimentar/);
  }
});
test("a physical feeding visit cannot borrow food from another room", () => {
  const w = fresh();
  takeStock(w, 18, "brood");
  addStock(w, 2, "foraged", 3);
  const a = w.makeAnt("worker", 0, 0);
  a.node = 2;
  a.crop = 0;
  feedFromStock(w, a);
  assert.equal(a.crop, 0);
  assert.equal(w.food, 2);
  a.node = 3;
  feedFromStock(w, a);
  assert.equal(a.crop, 0);
  Object.assign(a, w.nest.nodes[3]);
  feedFromStock(w, a);
  assert.equal(a.crop, 0.3);
  assert.equal(w.food, 1.7);
  valid(w);
});
test("foragers prefer a drier visited room, while unseen changes never enter their choice", () => {
  const w = fresh(),
    a = w.makeAnt("worker", 0, 0);
  w.tick = 20;
  a.roomMemory = {
    version: 1,
    rooms: [
      { node: 2, tick: 20, reading: { water: 0.85, temperature: 25 } },
      { node: 3, tick: 20, reading: { water: 0.3, temperature: 25 } },
    ],
  };
  assert.equal(knownStorageRoom(w, a), 3);
  a.roomMemory.rooms.pop();
  assert.equal(knownStorageRoom(w, a), 2);
  w.tick = 421;
  assert.equal(knownStorageRoom(w, a), null);
});
test("local wet food spoils into counted waste while the drier batch remains intact", () => {
  const w = fresh(),
    soil = ensureSoilClimate(w);
  takeStock(w, 18, "brood");
  addStock(w, 2, "foraged", 2);
  addStock(w, 2, "foraged", 3);
  soil.water.fill(0.3 * soil.capacity);
  soil.temperature.fill(25);
  const wet = w.colony.stores.bins.find((b) => b.node === 2),
    dry = w.colony.stores.bins.find((b) => b.node === 3);
  assert.notEqual(climateCell(soil, wet.point), climateCell(soil, dry.point));
  soil.water[climateCell(soil, wet.point)] = 0.95 * soil.capacity;
  w.tick = 100;
  spoilStocks(w);
  assert.equal(dry.amount, 2);
  assert.ok(wet.amount < 2);
  assert.ok(w.colony.spoiled > 0);
  assert.ok(
    Math.abs(
      w.colony.waste
        .filter((x) => x.kind === "food")
        .reduce((n, b) => n + b.mass, 0) - w.colony.spoiled,
    ) < 1e-9,
  );
  valid(w);
});
test("spatial stocks retain their future after restore through feeding, clutches and ecological updates", () => {
  const w = fresh();
  w.predators = [];
  w.step(300);
  valid(w);
  const copy = World.restore(w.snapshot());
  w.step(250);
  copy.step(250);
  assert.deepEqual(w.snapshot(), copy.snapshot());
  valid(w);
});
test("older profiles have no room ledger and the new profile cannot omit it", () => {
  const old = new World(
    "old-stocks",
    {},
    {
      founding: false,
      biologicalProfile: profileReference("generic-microclimate-demo", 1),
    },
  );
  assert.equal(old.colony.stores, undefined);
  const bad = fresh().snapshot();
  delete bad.colony.stores;
  assert.throws(() => World.restore(bad), /espacial ausente/);
  valid(fresh(true));
});

test("a digger is not refilled by a distant bin or by a stale logical node", async () => {
  const { arriveWithSoil } = await import("../src/modules/soil/routing.ts");
  const w = fresh();
  takeStock(w, 18, "brood");
  addStock(w, 2, "foraged", 3);
  w.nest.nodes[2].type = "storage";
  w.nest.nodes[3].type = "storage";
  const a = w.makeAnt("worker", 0, 0);
  a.node = 2;
  a.energy = 40;
  a.soilTask = { phase: "repair", digTicks: 0 };
  Object.assign(a, {
    x: w.nest.nodes[2].x,
    y: w.nest.nodes[2].y,
    z: w.nest.nodes[2].z,
  });
  arriveWithSoil(w, a, 2);
  assert.equal(a.energy, 40);
  a.node = 3;
  arriveWithSoil(w, a, 3);
  assert.equal(a.energy, 40);
  Object.assign(a, {
    x: w.nest.nodes[3].x,
    y: w.nest.nodes[3].y,
    z: w.nest.nodes[3].z,
  });
  arriveWithSoil(w, a, 3);
  assert.equal(a.energy, 100);
  valid(w);
});

test("a logical stock arrival walks the body to the room before depositing its finite load", async () => {
  const { finishSegment } =
    await import("../src/modules/navigation/tunnel-arrival.ts");
  const w = fresh();
  w.predators = [];
  takeStock(w, 18, "brood");
  const a = w.makeAnt("worker", 0, 0),
    royal = w.nest.nodes[2];
  Object.assign(a, {
    x: royal.x,
    y: royal.y - royal.r * 0.9,
    z: royal.z,
    node: 2,
    carrying: 0.4,
    stockGoal: 3,
    route: [3],
  });
  w.ants.push(a);
  const before = { x: a.x, y: a.y, z: a.z };
  finishSegment(w, a, 3, false, [2, 3]);
  assert.equal(w.colony.stores.incoming, 0);
  assert.equal(a.carrying, 0.4);
  assert.deepEqual({ x: a.x, y: a.y, z: a.z }, before);
  assert.ok(a.supportMotion);
  let maxStep = 0;
  for (let i = 0; i < 500 && w.colony.stores.incoming < 0.39; i++) {
    const old = { x: a.x, y: a.y, z: a.z };
    w.step();
    maxStep = Math.max(
      maxStep,
      Math.hypot(a.x - old.x, a.y - old.y, a.z - old.z),
    );
  }
  assert.ok(
    w.colony.stores.incoming >= 0.4 - 1e-9,
    JSON.stringify({
      node: a.node,
      state: a.state,
      position: { x: a.x, y: a.y, z: a.z },
    }),
  );
  assert.equal(a.carrying, 0);
  assert.ok(maxStep < 0.13);
  valid(w);
});

test("shared-habitat restore preserves separate stores and rejects a child's food inside the parent room", async () => {
  const { family } = await import("./fixtures/family.mjs"),
    { initializeRoomStores } =
      await import("../src/modules/stores/initialize.ts"),
    { initializeSeason } = await import("../src/modules/seasons/update.ts"),
    { initializeMaternalReserves } =
      await import("../src/modules/maternal/initialize.ts");
  const { w, child } = family("stock-family");
  for (const c of [w, child]) {
    c.biologicalProfile = profileReference("generic-microclimate-demo", 2);
    initializeMaternalReserves(c);
    initializeSeason(c);
    initializeRoomStores(c);
  }
  const copy = World.restore(w.snapshot());
  assert.equal(copy.food, w.food);
  assert.equal(copy.colonies[0].food, 0);
  valid(copy);
  valid(copy.colonies[0]);
  const raw = w.snapshot(),
    c = raw.colonies[0],
    n = w.nest.nodes[2];
  c.food = 1;
  c.colony.stores = {
    version: 1,
    initial: 1,
    incoming: 0,
    outgoing: 0,
    flows: {},
    bins: [
      { node: 2, amount: 1, point: { x: n.x, y: n.y - n.r * 0.9, z: n.z } },
    ],
  };
  assert.throws(() => World.restore(raw), /Localização alimentar/);
});
