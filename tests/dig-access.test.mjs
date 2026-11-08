import assert from "node:assert/strict";
import { test } from "node:test";
import {
  officialBiologicalProfile,
  profileReference,
  resolveBiologicalProfile,
} from "../src/modules/biology/catalog.ts";
import { geometricDigAccess } from "../src/modules/soil/access-rule.ts";
import {
  availableDigSite,
  diggingSites,
  touchingDigFace,
} from "../src/modules/soil/front-access.ts";
import { updateSoilWorker } from "../src/modules/soil/worker.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
import {
  recruitingProject,
  enableStigmergy,
} from "../src/modules/soil/stigmergy.ts";
import { invalidateNeighbors } from "../src/modules/navigation/sensors.ts";
import { sampleSoil, sampleSupport } from "../src/modules/terrain/field.ts";
import { digAccessFixture } from "./fixtures/dig-access.mjs";

const near = (a, b, eps = 1e-10) =>
  assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test("new Narbonne worlds opt in while archived profiles retain morphology and their own access rules", () => {
  assert.equal(officialBiologicalProfile().version, 3);
  const v2 = resolveBiologicalProfile(profileReference("messor-narbonne", 2));
  const v3 = resolveBiologicalProfile(officialBiologicalProfile());
  const { version: a, description: b, ...old } = v2;
  const { version: c, description: d, excavationAccess, ...current } = v3;
  assert.deepEqual(current, old);
  assert.equal(excavationAccess, "geometry-v1");
  assert.equal(geometricDigAccess({}), false);
  for (const version of [1, 2])
    assert.equal(
      geometricDigAccess({
        biologicalProfile: profileReference("messor-narbonne", version),
      }),
      false,
    );
});

test("a front finds real supported soil at different elevations; a logical node is insufficient", () => {
  const { world: w, project: p, sites, worker } = digAccessFixture();
  assert.ok(sites.length > 6);
  assert.ok(
    Math.max(...sites.map((s) => s.position.y)) -
      Math.min(...sites.map((s) => s.position.y)) >
      0.2,
  );
  for (const s of sites) {
    near(sampleSupport(w.nest, s.position).distance, 0.008, 0.015);
    near(sampleSoil(w.nest, s.position).distance, 0.008, 0.02);
  }
  const ant = worker();
  assert.equal(touchingDigFace(w, ant, p), true);
  ant.y += 2;
  w.tick++;
  assert.equal(touchingDigFace(w, ant, p), false);
  updateSoilWorker(w, ant);
  near(w.soil.removed, 0);
});

test("two supported bodies can bite in one tick, without duplicating a worker's bite or losing mass", () => {
  const { world: w, project: p, sites, worker } = digAccessFixture();
  const ants = [
    worker(sites[1], { bodyScale: 0.8, digPower: 0.25 }),
    worker(sites[7], { bodyScale: 0.8, digPower: 0.25 }),
  ];
  w.tick++;
  for (const ant of ants) {
    assert.equal(touchingDigFace(w, ant, p), true);
    updateSoilWorker(w, ant);
    assert.ok(ant.carryingSoil > 0);
    assert.equal(ant.soilTask.lastWorkedTick, w.tick);
  }
  const removed = w.soil.removed;
  for (let i = 0; i < 5; i++) for (const ant of ants) updateSoilWorker(w, ant);
  near(w.soil.removed, removed);
  near(soilBalance(w).error, 0);
  near(p.excavated, removed);
});

test("overlapping ants cannot both excavate; a blocked cap gives no free bite", () => {
  const { world: w, project: p, sites, worker } = digAccessFixture();
  const ant = worker(sites[1]),
    blocker = worker(sites[1]);
  w.tick++;
  assert.equal(touchingDigFace(w, ant, p), false);
  updateSoilWorker(w, ant);
  near(w.soil.removed, 0);
  assert.equal(ant.carryingSoil ?? 0, 0);
  assert.ok(
    Math.hypot(ant.x - blocker.x, ant.y - blocker.y, ant.z - blocker.z) <=
      ant.speed + 0.001,
  );
});

test("carriers away from the cap do not consume crew places; local physical blockers do", () => {
  for (const version of [2, 3]) {
    const { world: w, project: p, sites, worker } = digAccessFixture(version);
    enableStigmergy(w, { perFront: 1 });
    const recruit = worker(sites[0]);
    delete recruit.soilTask;
    const carrier = worker(sites[7], {
      x: 0,
      y: 0.008,
      z: 0,
      soilTask: { projectId: p.id, phase: "dump", digTicks: 0 },
      carryingSoil: 0.02,
    });
    w.tick++;
    assert.equal(
      recruitingProject(w, recruit)?.id ?? null,
      version === 3 ? p.id : null,
    );
    if (version === 3) {
      for (const s of sites) worker(s);
      invalidateNeighbors(w);
      assert.equal(availableDigSite(w, recruit, p), null);
      assert.equal(recruitingProject(w, recruit), null);
    }
    assert.equal(carrier.carryingSoil, 0.02);
  }
});

test("a reached goal advances the segment instead of leaving a zero-length face stuck", () => {
  const { world: w, project: p, front, worker } = digAccessFixture();
  const ant = worker();
  Object.assign(front, p.goal);
  w.nest.revision++;
  w.tick++;
  for (let i = 0; i < 30 && !p.completed && p.front === ant.node; i++) {
    w.tick++;
    updateSoilWorker(w, ant);
  }
  assert.ok(p.completed || p.front !== ant.node);
  near(soilBalance(w).error, 0);
  assert.ok(diggingSites(w, p).every((s) => Number.isFinite(s.position.x)));
});

test("local recruitment uses the face instead of counting two distant return trips", () => {
  for (const version of [2, 3]) {
    const { world: w, project: p, sites, worker } = digAccessFixture(version);
    for (let i = 0; i < 2; i++)
      worker(sites[7], {
        x: i + 2,
        y: 0.008,
        z: 0,
        soilTask: { projectId: p.id, phase: "dump", digTicks: 0 },
        carryingSoil: 0.02,
      });
    const recruit = worker(sites[0], { node: p.from, role: "excavator" });
    delete recruit.soilTask;
    w.tick++;
    updateSoilWorker(w, recruit);
    assert.equal(
      recruit.soilTask?.projectId ?? null,
      version === 3 ? p.id : null,
    );
  }
});

test("the archived project-wide bite guard is preserved for Narbonne v2", () => {
  const { world: w, project: p, sites, worker } = digAccessFixture(2);
  const ants = [
    worker(sites[1], { digPower: 0.25 }),
    worker(sites[7], { digPower: 0.25 }),
  ];
  w.tick++;
  for (const ant of ants) updateSoilWorker(w, ant);
  assert.equal(p.lastWorkedTick, w.tick);
  assert.ok(ants[0].carryingSoil > 0);
  assert.equal(ants[1].carryingSoil ?? 0, 0);
});

test("the real World loop carries two loads outside, stays supported and resumes an identical restored future", () => {
  const { world: w, sites, worker } = digAccessFixture();
  const ant = worker(sites[10]);
  let maxJump = 0;
  for (let i = 0; i < 2000; i++) {
    const old = { ...ant };
    w.step();
    maxJump = Math.max(
      maxJump,
      Math.hypot(ant.x - old.x, ant.y - old.y, ant.z - old.z),
    );
    assert.ok(maxJump <= ant.speed * 1.2 + 0.002);
    if (ant.y < -0.04)
      assert.ok(Math.abs(sampleSupport(w.nest, ant).distance - 0.008) < 0.035);
    near(soilBalance(w).error, 0, 1e-8);
  }
  assert.ok(
    w.soil.deposited > 0.044,
    "at least two actual loads must leave the nest",
  );
  const copy = w.constructor.restore(w.snapshot());
  w.step(80);
  copy.step(80);
  assert.deepEqual(copy.snapshot(), w.snapshot());
});
