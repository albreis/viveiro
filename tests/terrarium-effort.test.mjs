import {
  advanceSupportedMotion,
  startSupportedMotion,
} from "../src/modules/navigation/support-motion.ts";
import { tunnelFooting } from "../src/modules/terrain/surface-queries.ts";
import { lerp } from "./fixtures/geometry.mjs";
import assert from "node:assert/strict";
import { test } from "node:test";
import { profileReference } from "../src/modules/biology/catalog.ts";
import {
  EFFORT_PROFILE,
  climateCost,
  digReadiness,
  locomotionEffort,
  spendEffort,
} from "../src/modules/fatigue/effort-model.ts";
import {
  readyForDigBite,
  recordMotionEffort,
} from "../src/modules/fatigue/terrarium.ts";
import {
  createCheckpoint,
  decodeCheckpoint,
} from "../src/modules/persistence/codec.ts";
import { World } from "../src/modules/simulation/world.js";
import { digBite } from "../src/modules/soil/projects.ts";

const step = { x: 0.05, y: 0, z: 0 };
const profile = profileReference(EFFORT_PROFILE);
const testSession = (world) => ({
  version: 1,
  world: world.snapshot(),
  running: false,
});

test("work distinguishes ascent, supported descent, adhesion, loads, detours, and opposed wind", () => {
  const flat = locomotionEffort(step, 1, 0, false);
  assert.equal(locomotionEffort(step, 1, 1, false), 2 * flat);
  assert.equal(locomotionEffort(step, 1, 0, false, 4), flat);
  assert.equal(locomotionEffort(step, 1, 0, false, 0, 4), flat);
  assert.ok(locomotionEffort(step, 1, 0, false, -4) > flat);
  assert.ok(
    locomotionEffort(step, -1, 0, false) > locomotionEffort(step, 0, 0, false),
  );
  assert.ok(locomotionEffort(step, 0, 0, false) > flat);
  assert.ok(locomotionEffort(step, 1, 0, true) > flat);
  const up = locomotionEffort({ x: 0, y: 0.05, z: 0 }, 0, 0, false);
  const down = locomotionEffort({ x: 0, y: -0.05, z: 0 }, 0, 0, false);
  assert.ok(up > down && down > flat);
  assert.ok(locomotionEffort(null, 1, 0, false) < flat);
  assert.equal(locomotionEffort({ x: 0, y: 0, z: 0 }, 1, 0, false), 0);
  assert.ok(climateCost({ temperature: 16, water: 0.45 }) > 1);
  assert.ok(climateCost({ temperature: 24, water: 0.8 }) > 1);
  assert.equal(climateCost({ temperature: 24, water: 0.45 }), 1);
});

test("on a worker's next dig opportunity, debt can prevent a bite and a quiet interval restores readiness", () => {
  const worker = { kind: "worker", effort: spendEffort(undefined, 100, 8) };
  const world = { biologicalProfile: profile, tick: 100, random: () => 0.6 };
  assert.equal(digReadiness(worker.effort, 100), 0.5);
  assert.equal(readyForDigBite(world, worker), false);
  world.tick += 150;
  assert.ok(digReadiness(worker.effort, world.tick) > 0.6);
  assert.equal(readyForDigBite(world, worker), true);
  assert.deepEqual(worker.effort, { debt: 8, tick: 100 });
});

function scene(biologicalProfile) {
  const world = new World(
    "EFFORT-QA",
    { windX: -4 },
    {
      founding: false,
      biologicalProfile,
    },
  );
  world.landscape.logs = [];
  world.landscape.ponds = [];
  world.nest.relief = [];
  world.predators = [];
  const ant = world.makeAnt("worker", -8, -4);
  world.ants.push(ant);
  return { world, ant };
}

test("actual 3D locomotion and digging record work, and checkpoint restoration continues identically", () => {
  const { world, ant } = scene(profile);
  assert.ok(world.moveSurface(ant, 0, 0.05));
  assert.ok(ant.effort.debt > 0);
  const before = ant.effort.debt;
  const front = world.nest.nodes[2];
  const project = {
    id: 1,
    from: 0,
    front: 2,
    goal: { ...front, y: front.y - 1 },
    excavated: 0,
    completed: false,
  };
  digBite(world, ant, project);
  assert.ok(ant.effort.debt > before);

  const meta = {
    id: "effort",
    sequence: 1,
    createdAt: 1,
    kind: "manual",
    label: "Effort",
  };
  const checkpoint = createCheckpoint(testSession(world), meta);
  const restored = World.restore(decodeCheckpoint(checkpoint).world);
  assert.deepEqual(restored.ants.at(-1).effort, ant.effort);
  world.step(25);
  restored.step(25);
  assert.deepEqual(restored.snapshot(), world.snapshot());

  const invalid = testSession(world);
  invalid.world.ants.find((a) => a.id === ant.id).effort = {
    debt: 1,
    tick: world.tick + 1,
  };
  assert.throws(
    () => createCheckpoint(invalid, meta),
    /Estado de esforço inválido/,
  );
  assert.throws(
    () => World.restore(invalid.world),
    /Estado de esforço inválido/,
  );
});

test("surface wind does not charge the same motion in a deep tunnel and legacy workers retain no debt", () => {
  const { world, ant } = scene(profile);
  recordMotionEffort(world, ant, step, false, true);
  const exposed = ant.effort.debt;
  delete ant.effort;
  ant.y = -2;
  recordMotionEffort(world, ant, step);
  assert.ok(ant.effort.debt < exposed);

  const legacy = scene(profileReference("generic-microclimate-demo", 3));
  assert.ok(legacy.world.moveSurface(legacy.ant, 0, 0.05));
  assert.equal(Object.hasOwn(legacy.ant, "effort"), false);
});

test("a real wall detour consumes effort while respecting the navigation step limit", () => {
  const world = new World(
    "wall-exit",
    {},
    { founding: false, biologicalProfile: profile },
  );
  const from = world.nest.nodes[7];
  const to = world.nest.nodes[6];
  const center = lerp(from, to, 0.4);
  const first = tunnelFooting(world.nest, center, from, to, 0.35);
  const target = tunnelFooting(world.nest, center, from, to, Math.PI + 0.35);
  const ant = Object.assign(world.makeAnt("worker", first.x, first.z), first, {
    node: 7,
    route: [6],
    distanceWalked: 0,
  });
  world.ants = [ant];
  startSupportedMotion(world, ant, target, target.normal, center);
  for (let i = 0; i < 200 && ant.supportMotion; i++) {
    const before = { x: ant.x, y: ant.y, z: ant.z };
    world.tick++;
    advanceSupportedMotion(world, ant, 0.075);
    assert.ok(
      Math.hypot(ant.x - before.x, ant.y - before.y, ant.z - before.z) <=
        0.07501,
    );
  }
  assert.equal(ant.supportMotion, undefined);
  assert.ok(ant.distanceWalked > 0.1);
  assert.ok(ant.effort.debt > 0);
});
