import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { ecologyFixture } from "./fixtures/ecology.mjs";
import { ensureEcology } from "../src/modules/ecology/initialize.ts";
import { prepareSocialChemistry } from "../src/modules/social-chemistry/profile.ts";
import { visitMimic } from "../src/modules/ecology/mimic-worker.ts";
import { updateMimics } from "../src/modules/ecology/mimics.ts";
import { sampleSupport } from "../src/modules/terrain/field.ts";
const larva = (profile = [1, 0, 0, 0]) => ({
  id: 1,
  x: 0.12,
  y: 0.008,
  z: 0,
  profile,
  energy: 0.8,
  age: 0,
  status: "searching",
});
test("adoption depends on a nearby compatible chemical body, not hidden species or colony identity", () => {
  const { w, a, e } = ecologyFixture();
  e.mimics = [larva([0, 1, 0, 0])];
  assert.equal(visitMimic(w, a), false);
  assert.equal(e.rejections, 1);
  assert.equal(a.carryingMimic, undefined);
  a.mimicRejectedUntil = 0;
  e.mimics[0].profile = [1, 0, 0, 0];
  assert.equal(visitMimic(w, a), true);
  assert.equal(e.mimics[0].carrier, a.id);
  assert.equal(a.carryingMimic, 1);
  const blocked = ecologyFixture();
  blocked.a.y = -0.5;
  blocked.e.mimics = [{ ...larva(), y: -0.5 }];
  assert.equal(visitMimic(blocked.w, blocked.a), false);
  assert.equal(blocked.e.mimics[0].carrier, undefined);
});
test("an adopted cuckoo larva receives existing liquid food only through a compatible local contact", () => {
  const { w, a, e } = ecologyFixture(),
    m = larva();
  e.mimics = [m];
  m.status = "adopted";
  m.owner = 1;
  a.crop = 0.3;
  const before = m.energy + a.crop;
  updateMimics(w);
  assert.ok(e.parasiteFed > 0);
  assert.ok(Math.abs(before - m.energy - a.crop - e.parasiteRespired) < 1e-12);
  assert.equal(w.food, 0);
  a.x = 4;
  const fed = e.parasiteFed;
  updateMimics(w);
  assert.equal(e.parasiteFed, fed);
  a.x = 0;
  m.profile = [0, 1, 0, 0];
  updateMimics(w);
  assert.equal(e.parasiteFed, fed);
});
test("a dead carrier drops its larva at the actual body rather than teleporting it to the nursery", () => {
  const { w, a, e } = ecologyFixture(),
    m = larva();
  e.mimics = [m];
  visitMimic(w, a);
  a.x = 0.3;
  a.health = 0;
  updateMimics(w);
  assert.equal(m.carrier, undefined);
  assert.equal(m.status, "searching");
  assert.equal(m.x, a.x);
  assert.equal(m.y, a.y);
  assert.equal(e.adoptions, 0);
});
test("a worker physically carries a compatible mimic from the surface to the nursery with bounded support", () => {
  const w = new World("mimic-transport");
  prepareSocialChemistry(w);
  const e = ensureEcology(w),
    entry = w.nest.nodes[0];
  e.aphids = [];
  w.predators = [];
  w.food = 0;
  const a = w.makeAnt("worker", entry.x + 0.55, entry.z);
  w.ants = [a];
  a.lastEntrance = { node: 0, x: entry.x, z: entry.z };
  a.crop = 0.4;
  a.nextTaskChoice = 1000000;
  e.mimics = [
    { ...larva([...w.socialChemistry.profiles["1"]]), x: a.x, y: a.y, z: a.z },
  ];
  const m = e.mimics[0];
  let maxStep = 0,
    maxGap = 0;
  let saved;
  for (let i = 0; i < 1600 && m.status !== "adopted"; i++) {
    const before = { x: a.x, y: a.y, z: a.z };
    w.step();
    maxStep = Math.max(
      maxStep,
      Math.hypot(a.x - before.x, a.y - before.y, a.z - before.z),
    );
    if (i % 5 === 0)
      maxGap = Math.max(
        maxGap,
        Math.abs(sampleSupport(w.nest, a).distance - 0.008),
      );
    if (i === 45) saved = w.snapshot();
  }
  console.log("mimic transport", {
    status: m.status,
    tick: w.tick,
    maxStep,
    maxGap,
    node: m.node,
  });
  assert.equal(m.status, "adopted");
  assert.equal(e.adoptions, 1);
  assert.equal(m.carrier, undefined);
  assert.equal(a.carryingMimic, undefined);
  assert.ok(w.nest.nodes[m.node]);
  assert.ok(maxStep < a.speed * 1.2 + 0.002);
  assert.ok(maxGap < 0.035);
  const replay = World.restore(saved),
    other = World.restore(saved);
  replay.step(100);
  other.step(100);
  assert.deepEqual(replay.snapshot(), other.snapshot());
});
