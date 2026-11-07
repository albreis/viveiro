import assert from "node:assert/strict";
import { test } from "node:test";
import {
  officialBiologicalProfile,
  profileReference,
  resolveBiologicalProfile,
} from "../src/modules/biology/catalog.ts";
import {
  producesSeeds,
  seedDetectionRange,
} from "../src/modules/biology/seed-foraging.ts";
import { surfaceWalkingSpeed } from "../src/modules/biology/worker-reference.ts";
import { ensureEcology } from "../src/modules/ecology/initialize.ts";
import { World } from "../src/modules/simulation/world.js";

const biologicalProfile = officialBiologicalProfile();
const create = (params = {}) =>
  new World("NARBONNE-QA", params, { founding: false, biologicalProfile });

test("the reference profile has deterministic continuous worker sizes without forcing a soldier caste", () => {
  const world = create();
  const repeated = create();
  const reference = resolveBiologicalProfile(biologicalProfile);
  assert.equal(reference.cocoon, "absent");
  assert.equal(reference.modelSpecies, null);
  const lengths = Array.from({ length: 120 }, () => {
    const ant = world.makeAnt("worker", 0, 0);
    assert.deepEqual(ant, repeated.makeAnt("worker", 0, 0));
    assert.equal(ant.caste, "minor");
    return ant.bodyScale * reference.workerReference.bodyMm;
  });
  assert.ok(Math.min(...lengths) >= 4);
  assert.ok(Math.max(...lengths) <= 8 && Math.max(...lengths) > 7);
  assert.ok(lengths.filter((length) => length < 5.5).length > 60);
});

test("surface navigation follows the observed temperature ranking only in reference workers", () => {
  const world = create();
  const worker = world.makeAnt("worker", -8, -4);
  world.nest.relief = [];
  world.landscape.logs = [];
  world.landscape.ponds = [];
  const position = { x: -8, y: 0.008, z: -4 };
  const travel = [16, 25, 30].map((temperatureC) => {
    world.params.temperatureC = temperatureC;
    Object.assign(worker, position);
    delete worker.navigation;
    assert.ok(world.moveSurface(worker, 0, worker.speed));
    return Math.hypot(worker.x - position.x, worker.z - position.z);
  });
  assert.ok(Math.abs(travel[1] / travel[0] - 11.4 / 8) < 1e-10);
  assert.ok(Math.abs(travel[2] / travel[1] - 15 / 11.4) < 1e-10);
  const legacy = new World(
    "NARBONNE-QA",
    {},
    { founding: false, biologicalProfile: profileReference("generic-demo", 5) },
  );
  assert.equal(
    surfaceWalkingSpeed(legacy, worker, worker.speed, 16),
    worker.speed,
  );
  assert.equal(surfaceWalkingSpeed(world, world.ants[0], 0.1, 16), 0.1);
});

test("reference foraging generates seed sources and varies local search and loaded walking by size", () => {
  const world = create();
  assert.ok(world.patches.length > 0);
  assert.ok(
    world.patches.every((p) =>
      producesSeeds(world.plants.find((plant) => plant.id === p.sourcePlant)),
    ),
  );
  const eco = ensureEcology(world);
  assert.deepEqual(eco.aphids, []);
  assert.deepEqual(eco.mimics, []);
  const small = { kind: "worker", bodyScale: 0.8, carrying: 0.2 };
  const large = { ...small, bodyScale: 1.6 };
  assert.ok(
    seedDetectionRange(world, small, 2.3) >
      seedDetectionRange(world, large, 2.3),
  );
  assert.ok(
    surfaceWalkingSpeed(world, small, 0.06, 25) <
      surfaceWalkingSpeed(world, large, 0.06, 25),
  );
  assert.equal(world.intervene("food", 1, 1), true);
  assert.ok(world.patches.at(-1).supplemental);
  world.step(15);
  const restored = World.restore(world.snapshot());
  world.step(15);
  restored.step(15);
  assert.deepEqual(world.snapshot(), restored.snapshot());
});
