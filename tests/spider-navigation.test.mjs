import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { updatePredators } from "../src/modules/simulation/predator-step.js";
import { ensureEcology } from "../src/modules/ecology/initialize.ts";
import { plantClearance } from "../src/modules/predators/vegetation.ts";
function fixture(species = "tree") {
  const w = new World("spider-repro", {}, { founding: false });
  w.ants = [];
  w.brood = [];
  w.predators = [];
  w.nest.nodes = [];
  w.nest.links = [];
  w.nest.relief = [];
  w.landscape.logs = [];
  w.landscape.ponds = [];
  w.plants = [{ id: 900, x: 0, z: 0, kind: 2, species, biomass: 1, health: 1 }];
  ensureEcology(w).aphids = [
    { id: 1, plant: 900, count: 1000, honey: 0, visits: 0 },
  ];
  w.addPredator(0.7, 0, false);
  return { w, p: w.predators[0], plant: w.plants[0] };
}
for (const species of ["tree", "shrub"])
  test(
    "hunter leaves " +
      species +
      " rather than reversing forever inside its stem",
    () => {
      const { w, p, plant } = fixture(species);
      let flips = 0,
        maxRadius = 0,
        minRadius = Infinity,
        maxStep = 0,
        wait = 0;
      for (let i = 0; i < 1200; i++) {
        w.tick++;
        const before = { x: p.x, z: p.z, angle: p.angle };
        updatePredators(w, new Set());
        const step = Math.hypot(p.x - before.x, p.z - before.z);
        maxStep = Math.max(maxStep, step);
        if (step < 1e-9) wait++;
        minRadius = Math.min(minRadius, Math.hypot(p.x, p.z));
        if (i > 100) {
          maxRadius = Math.max(maxRadius, Math.hypot(p.x, p.z));
          if (Math.cos(before.angle - p.angle) < -0.5) flips++;
        }
      }
      console.log(
        JSON.stringify({ species, maxRadius, minRadius, flips, maxStep, wait }),
      );
      assert.ok(maxRadius > 1);
      assert.ok(minRadius >= plantClearance(plant) - 1e-8);
      assert.ok(flips < 50);
      assert.ok(maxStep <= 0.04 + 1e-8);
      assert.ok(wait < 300);
      assert.ok(p.energy > 0);
    },
  );
test("a newly grown stem allows continuous outward recovery without teleporting", () => {
  const { w, p, plant } = fixture();
  p.x = 0.01;
  p.z = 0;
  plant.biomass = 1.7;
  let before = p.x;
  for (let i = 0; i < 30; i++) {
    w.tick++;
    assert.equal(w.moveSurface(p, 0, 0.024, true), true);
    assert.ok(Math.hypot(p.x - before, p.z) <= 0.0240001);
    before = p.x;
  }
  assert.ok(p.x > plantClearance(plant));
});
test("a hunter can leave an entrance exclusion zone created beneath it", () => {
  const { w, p } = fixture();
  w.plants = [];
  w.nest.nodes = [
    { x: 0, y: 0, z: 0, r: 0.12, type: "entrance", name: "Nova entrada" },
  ];
  p.x = 0.4;
  p.z = 0;
  for (let i = 0; i < 45; i++) {
    w.tick++;
    const old = p.x;
    assert.equal(w.moveSurface(p, 0, 0.024, true), true);
    assert.ok(p.x - old <= 0.0240001);
  }
  assert.ok(p.x > 1.3);
});
test("woody stems block entry while grass and canopy alone do not become solid walls", () => {
  const { w, p, plant } = fixture();
  for (let i = 0; i < 120; i++) {
    w.tick++;
    w.moveSurface(p, Math.PI, 0.024, true);
    assert.ok(Math.hypot(p.x, p.z) >= plantClearance(plant) - 1e-8);
  }
  plant.species = "grass";
  assert.equal(plantClearance(plant), 0);
});
test("persistent hunting memory restores the same future and rejects malformed values", () => {
  const w = new World("spider-memory", {}, { founding: false });
  w.step(130);
  const copy = World.restore(w.snapshot());
  w.step(180);
  copy.step(180);
  assert.deepEqual(w.snapshot(), copy.snapshot());
  const bad = w.snapshot();
  bad.predators[0].predatorMemory.anchor.tick = -1;
  assert.throws(() => World.restore(bad), /predador/);
});
