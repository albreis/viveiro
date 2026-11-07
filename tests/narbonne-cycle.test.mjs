import assert from "node:assert/strict";
import { test } from "node:test";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import { reproductiveWindow } from "../src/modules/biology/reproductive-calendar.ts";
import { modeledLength } from "../src/modules/biology/founder-reference.ts";
import { tunnelWalkingSpeed } from "../src/modules/biology/tunnel-reference.ts";
import {
  takeSeedRation,
  serveSeedRation,
} from "../src/modules/colony/seed-rations.ts";
import { arriveColony } from "../src/modules/colony/arrival.ts";
import { leaveCorpse } from "../src/modules/colony/waste.ts";
import {
  stockBalance,
  takeStock,
  addStock,
} from "../src/modules/stores/ledger.ts";
import { World as EstablishedWorld } from "./fixtures/established-world.mjs";
import {
  startSupportedMotion,
  advanceSupportedMotion,
} from "../src/modules/navigation/support-motion.ts";
import { tunnelFooting } from "../src/modules/terrain/surface-queries.ts";
import { lerp } from "./fixtures/geometry.mjs";
import { maternalBalance } from "../src/modules/maternal/pools.ts";

const make = (version = 2) =>
  new World(
    "NARBONNE-CYCLE-QA",
    {},
    {
      founding: false,
      biologicalProfile: profileReference("messor-narbonne", version),
    },
  );
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, a + " != " + b);

test("reproductive caste sizes reflect the modeled mesh and pinned profile", () => {
  const world = make();
  for (const [kind, length] of [
    ["queen", 11],
    ["gyne", 11],
    ["male", 8],
  ]) {
    const ant = world.makeAnt(kind, 0, 0);
    near(modeledLength(world, ant), length);
  }
  assert.equal(modeledLength(make(1), world.ants[0]), undefined);
});

test("seasonal laying and rain-conditioned flights use separate windows across year boundaries", () => {
  const world = make();
  assert.equal(reproductiveWindow(world, "flight"), true);
  assert.equal(reproductiveWindow(world, "laying"), false);
  world.tick = 11 * 100;
  assert.equal(reproductiveWindow(world, "flight"), false);
  world.tick = 38 * 100;
  assert.equal(reproductiveWindow(world, "laying"), true);
  assert.equal(reproductiveWindow(world, "alates"), false);
  world.tick = 64 * 100;
  assert.equal(reproductiveWindow(world, "alates"), true);
  world.tick = 76 * 100;
  assert.equal(reproductiveWindow(world, "flight"), true);
  const legacy = make(1);
  legacy.tick = 11 * 100;
  assert.equal(reproductiveWindow(legacy, "laying"), true);
  assert.equal(reproductiveWindow(legacy, "flight"), true);
});

test("a care visit withdraws food once and routes the portion to the queen; loss becomes food waste", () => {
  const world = make(),
    queen = world.ants[0];
  const storage = world.nest.nodes.findIndex((n) => n.type === "storage");
  const ant = world.makeAnt("worker", 0, 0);
  world.ants.push(ant);
  queen.crop = 0.1;
  const room = world.nest.nodes[storage];
  Object.assign(ant, {
    ...room,
    node: storage,
    bioTask: { kind: "care", destination: storage },
  });
  takeStock(world, world.food, "care");
  addStock(world, 1, "foraged", storage);
  arriveColony(world, ant, storage);
  near(ant.seedRation, 0.18);
  assert.equal(ant.bioTask.destination, queen.node);
  assert.ok(ant.route.length > 0);
  const food = world.food;
  serveSeedRation(world, ant, queen);
  near(queen.crop, 0.1);
  Object.assign(ant, { x: queen.x, y: queen.y, z: queen.z, node: queen.node });
  serveSeedRation(world, ant, queen);
  near(queen.crop, 0.28);
  assert.equal(ant.seedRation, undefined);
  near(world.food, food);
  near(stockBalance(world).ledger, 0);
  near(stockBalance(world).rooms, 0);
  Object.assign(ant, room, { node: storage });
  takeSeedRation(world, ant);
  near(ant.seedRation, 0.18);
  const restored = World.restore(world.snapshot());
  near(restored.ants.at(-1).seedRation, 0.18);
  leaveCorpse(world, ant);
  assert.equal(ant.seedRation, undefined);
  near(
    world.colony.waste
      .filter((w) => w.kind === "food")
      .reduce((n, w) => n + w.mass, 0),
    0.18,
  );
  near(stockBalance(world).ledger, 0);
  const invalid = restored.snapshot();
  invalid.ants.at(-1).seedRation = 2;
  assert.throws(() => World.restore(invalid), /Porção de sementes inválida/);
});

test("underground motion responds to temperature and load with continuous supported steps", () => {
  const world = make(),
    ant = world.makeAnt("worker", 0, 0);
  Object.assign(ant, { normal: { x: 0, y: 1, z: 0 }, carrying: 0 });
  const fast = tunnelWalkingSpeed(world, ant, 0.06);
  world.params.temperatureC = 16;
  assert.ok(tunnelWalkingSpeed(world, ant, 0.06) < fast);
  ant.carryingSoil = 0.022;
  ant.normal.y = 0;
  assert.ok(tunnelWalkingSpeed(world, ant, 0.06) < fast);
  assert.equal(tunnelWalkingSpeed(make(1), ant, 0.06), 0.06);
  const nestWorld = new EstablishedWorld("wall-exit");
  nestWorld.biologicalProfile = profileReference("messor-narbonne", 2);
  const from = nestWorld.nest.nodes[7],
    to = nestWorld.nest.nodes[6],
    center = lerp(from, to, 0.4);
  const first = tunnelFooting(nestWorld.nest, center, from, to, 0.35);
  const last = tunnelFooting(nestWorld.nest, center, from, to, Math.PI + 0.35);
  const walker = Object.assign(
    nestWorld.makeAnt("worker", first.x, first.z),
    first,
    { node: 7, route: [6] },
  );
  nestWorld.ants = [walker];
  startSupportedMotion(nestWorld, walker, last, last.normal, center);
  for (let i = 0; i < 300 && walker.supportMotion; i++) {
    const previous = { ...walker };
    advanceSupportedMotion(nestWorld, walker, 0.06);
    assert.ok(
      Math.hypot(
        walker.x - previous.x,
        walker.y - previous.y,
        walker.z - previous.z,
      ) <= 0.06001,
    );
  }
  assert.equal(walker.supportMotion, undefined);
});

test("founding waits for spring, funds the first clutch and reproduces its future after restore", () => {
  const world = new World(
    "SEMENTE-42",
    {},
    { biologicalProfile: profileReference("messor-narbonne", 2) },
  );
  world.step(3600);
  assert.equal(world.founding.phase, "claustral");
  assert.equal(world.founding.firstClutch, false);
  near(maternalBalance(world.founding.maternal).error, 0);
  const restored = World.restore(world.snapshot());
  world.step(200);
  restored.step(200);
  assert.deepEqual(restored.snapshot(), world.snapshot());
  assert.equal(world.founding.firstClutch, true);
  world.step(1800);
  assert.equal(world.founding.phase, "established");
  assert.ok(world.founding.nanitics > 0);
  near(maternalBalance(world.founding.maternal).error, 0);
});
