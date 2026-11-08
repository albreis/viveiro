import { positionClear } from "../src/modules/navigation/collision.ts";
import { seededRandom } from "../src/libs/seeded-random.ts";
import assert from "node:assert/strict";
import { test } from "node:test";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import { referenceWorkerMorphology } from "../src/modules/biology/worker-morphology.ts";
import { BuhlWorkerProfile } from "../src/modules/benchmarks/buhl-arena/worker-profile.ts";
import { BuhlBodyContacts } from "../src/modules/benchmarks/buhl-arena/body-contacts.ts";
import { BuhlArena } from "../src/modules/benchmarks/buhl-arena/geometry.ts";
import { runBuhlLab } from "../src/modules/benchmarks/buhl-arena/run.ts";
import { normalizeBuhlLabPlan } from "../src/modules/benchmarks/buhl-arena/settings.ts";

const climate = {
  temperatureC: 24,
  initialSandWaterFraction: 0.08,
  airRelativeHumidity: 0.8,
  airflowIndex: 0,
  drying: false,
};
const plan = (extra = {}) => ({
  seed: "BUHL-NARBONNE-QA",
  workers: 50,
  separationMm: 5,
  dryDensityMgPerMm3: 1.5,
  mechanism: "edge-follow",
  contactAccess: 0.35,
  digFatigue: "work-recovery",
  workerProfile: profileReference("messor-narbonne", 2),
  microclimate: climate,
  ...extra,
});
test("arena workers use the terrarium size mapping and temperature/load rules", () => {
  const normalized = normalizeBuhlLabPlan(plan());
  const profile = new BuhlWorkerProfile(normalized);
  const world = new World(
    "BUHL-NARBONNE-QA",
    {},
    { founding: false, biologicalProfile: normalized.workerProfile },
  );
  for (let i = 1; i <= 200; i++) {
    const shape = profile.body(world.seed, i);
    assert.deepEqual(
      shape,
      referenceWorkerMorphology(profile.reference, world.seed, i),
    );
    assert.ok(shape.bodyScale * 5 >= 4 && shape.bodyScale * 5 <= 8);
  }
  const a = world.makeAnt("worker", 0, 0),
    expected = profile.body(world.seed, a.id);
  // Genetic phenotype applies after reference morphology in the 3D factory.
  assert.ok(Math.abs(a.bodyScale - expected.bodyScale) < 0.07);
  assert.ok(
    Math.abs(profile.walkingSpeed(0, false) - (8 + (8 * (11.4 - 8)) / 9)) <
      1e-12,
  );
  assert.equal(profile.walkingSpeed(1, false), profile.walkingSpeed(0, false));
  assert.equal(
    profile.walkingSpeed(1, true),
    profile.walkingSpeed(0, true) * 0.85,
  );
  assert.ok(
    new BuhlWorkerProfile(
      normalizeBuhlLabPlan(
        plan({ microclimate: { ...climate, temperatureC: 16 } }),
      ),
    ).walkingMmPerSecond < profile.walkingMmPerSecond,
  );
  const old = { ...plan() };
  delete old.workerProfile;
  delete old.microclimate;
  assert.equal(normalizeBuhlLabPlan(old).workerProfile, undefined);
  assert.throws(
    () =>
      normalizeBuhlLabPlan({ ...old, workerProfile: normalized.workerProfile }),
    /microclima explícito/,
  );
});
test("the planar contact ellipse blocks approach and allows escape across spatial buckets", () => {
  const arena = new BuhlArena(1),
    at = (x, z) => arena.indexAt({ xMm: x, zMm: z });
  const ants = [
    { cell: at(150, 0), bodyScale: 1, headScale: 1 },
    { cell: at(153, 0), bodyScale: 1, headScale: 1 },
  ];
  const contacts = new BuhlBodyContacts(arena, ants, 5 / 0.445);
  assert.equal(contacts.clear(0, at(151, 0), 0), false);
  assert.equal(contacts.clear(0, at(149, 0), 0), true);
  ants[0].cell = at(180, 10);
  contacts.moved(0);
  assert.equal(contacts.clear(1, at(154, 0), 0), true);
  ants[0].cell = at(156, 0);
  contacts.moved(0);
  assert.equal(contacts.clear(1, at(154, 0), 0), false);
});
test("a real profiled arena run exposes the applied phenotype, contact effect and conserved budgets", () => {
  const input = plan({ durationSeconds: 600, sampleEverySeconds: 300 });
  const run = runBuhlLab(input);
  assert.deepEqual(run, runBuhlLab(input));
  assert.equal(run.workerPhenotypes.length, 50);
  assert.ok(run.samples.at(-1).bodyRejectedCandidates > 0);
  assert.ok(new Set(run.workerPhenotypes.map((a) => a.bodyMm)).size > 40);
  for (const s of run.samples) {
    assert.equal(s.dugMicrograms, s.carriedMicrograms + s.depositedMicrograms);
    assert.equal(s.initialSandCells, s.remainingSandCells + s.openedCells);
    assert.equal(s.trafficOpenedCells, 0);
  }
});

test("spatial contact updates agree with the actual 3D rule on flat support", () => {
  const arena = new BuhlArena(0.8),
    rng = seededRandom("BODY-INDEX-CROSSCHECK");
  const profile = new BuhlWorkerProfile(normalizeBuhlLabPlan(plan()));
  const scale = profile.mmPerModelUnit;
  const point = (cell) => {
    const p = arena.center(cell);
    return { x: p.xMm / scale, y: 0, z: p.zMm / scale };
  };
  const agents = Array.from({ length: 200 }, (_, i) => {
    const cell = arena.indexAt({
      xMm: 140 + rng.random() * 35,
      zMm: -18 + rng.random() * 36,
    });
    return {
      id: i + 1,
      kind: "worker",
      cell,
      ...point(cell),
      ...profile.body("BODY-INDEX-CROSSCHECK", i + 1),
    };
  });
  const contacts = new BuhlBodyContacts(arena, agents, scale);
  const world = { ants: agents, nest: { nodes: [], links: [] }, tick: 0 };
  for (let i = 0; i < 2000; i++) {
    const id = Math.floor(rng.random() * agents.length),
      a = agents[id],
      heading = Math.floor(rng.random() * 4);
    const cell = arena.neighbor(a.cell, heading),
      destination = point(cell);
    const expected = positionClear(
      world,
      a,
      destination,
      (heading * Math.PI) / 2,
    );
    const actual = contacts.clear(id, cell, heading);
    assert.equal(
      actual,
      expected,
      "contact mismatch after spatial update " + i,
    );
    if (actual) {
      a.cell = cell;
      Object.assign(a, destination);
      contacts.moved(id);
    }
    world.tick++;
  }
});
