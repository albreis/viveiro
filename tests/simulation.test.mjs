import { waterScale } from "../src/modules/landscape/queries.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { tunnelFooting } from "../src/modules/terrain/surface-queries.ts";
import {
  World,
  forecast,
  LIMIT,
  nestPath,
} from "./fixtures/established-world.mjs";
test("same seed and timed actions reproduce the same complete state", () => {
  const a = new World("reproducible"),
    b = new World("reproducible");
  for (let i = 0; i < 650; i++) {
    if (i === 130) {
      a.intervene("rain");
      b.intervene("rain");
    }
    if (i === 230) {
      a.intervene("food", -2, 1);
      b.intervene("food", -2, 1);
    }
    a.step();
    b.step();
  }
  assert.deepEqual(a.snapshot(), b.snapshot());
});
test("the colony starts with a reproductive pair and workers hatch after development", () => {
  const w = new World("life");
  assert.equal(w.population, 2);
  w.step(30);
  assert.ok(w.brood.length > 0);
  assert.equal(w.workers.length, 0);
  w.step(180);
  assert.ok(w.workers.length > 0);
  assert.equal(
    w.ants.some((a) => a.kind === "male"),
    false,
  );
});
test("snapshot restoration preserves future behavior without mutating the original", () => {
  const w = new World("snapshot");
  w.step(250);
  const s = w.snapshot(),
    restored = World.restore(s);
  restored.step(200);
  assert.equal(w.tick, 250);
  w.step(200);
  assert.deepEqual(w.snapshot(), restored.snapshot());
});
test("forecasts are repeatable, ordered and leave the live world untouched", () => {
  const w = new World("prediction");
  w.step(350);
  const before = w.snapshot(),
    f = forecast(before, 12, 3);
  assert.deepEqual(f, forecast(before, 12, 3));
  assert.deepEqual(w.snapshot(), before);
  assert.ok(f.low <= f.median && f.median <= f.high);
  assert.equal(f.values.length, 12);
});
test("food, entities and positions remain bounded through a long ecological run", () => {
  for (const seed of ["a", "b", "c"]) {
    const w = new World(seed);
    w.step(4000);
    assert.ok(w.food >= 0 && Number.isFinite(w.food));
    assert.ok(w.population + w.brood.length <= LIMIT);
    assert.ok(
      w.patches.every((p) => p.amount >= 0 && Number.isFinite(p.amount)),
    );
    assert.ok(
      w.ants.every(
        (a) =>
          Math.abs(a.x) <= 10 &&
          Math.abs(a.z) <= 6.5 &&
          a.y >= -4.2 &&
          Number.isFinite(a.energy),
      ),
    );
    assert.ok(w.plants.every((p) => p.biomass >= 0 && p.biomass <= 1.1));
  }
});
test("predators can catch workers while the nest remains a refuge", () => {
  const w = new World("predator");
  w.step(210);
  const prey = w.workers[0];
  prey.x = 5;
  prey.y = 0;
  prey.z = 3;
  prey.route = [];
  prey.speed = 0;
  w.predators = [
    { id: 9999, x: 5, z: 3, angle: 0, energy: 100, cooldown: 0, prey: 0 },
  ];
  w.step(50);
  assert.ok(!w.ants.some((a) => a.id === prey.id));
  assert.ok(w.deaths > 0);
  assert.ok(w.ants.some((a) => a.kind === "queen"));
  assert.equal(w.addPredator(5, 5), true);
  assert.equal(
    w.intervene("predator", w.nest.nodes[0].x, w.nest.nodes[0].z),
    false,
  );
});
test("underground routes deliver food in the storage chamber and lead back to an entrance", () => {
  const w = new World("galleries");
  w.step(210);
  const storage = w.nest.nodes[4],
    ant = w.makeAnt("worker", storage.x, storage.z);
  w.ants.push(ant);
  const footing = tunnelFooting(
    w.nest,
    storage,
    w.nest.nodes[8],
    storage,
    0.35,
  );
  assert.ok(w.ants.find((a) => a.kind === "queen").y < 0);
  Object.assign(ant, {
    x: footing.x,
    y: footing.y,
    z: footing.z,
    normal: footing.normal,
    node: 4,
    route: [4],
    carrying: 1,
    bioTask: undefined,
    soilTask: undefined,
    carryingBrood: 0,
    carryingWaste: 0,
    role: "forager",
    nextTaskChoice: 1000000,
    supportMotion: undefined,
    navigation: undefined,
    tunnelY: storage.y,
    tunnelCenter: { x: storage.x, y: storage.y, z: storage.z },
  });
  const nutrition = () =>
    w.food + w.ants.reduce((n, a) => n + (a.crop || 0), 0);
  const before = nutrition();
  w.step();
  assert.ok(nutrition() > before + 0.8);
  assert.equal(ant.carrying, 0);
  assert.ok(ant.route.length > 0);
  w.step(250);
  assert.ok(ant.y >= -0.1 || ant.carrying > 0 || ant.route.length > 0);
  assert.ok(nestPath(w.nest, 0, 3).length >= 3);
});
test("a worker approaching water can bypass it instead of remaining stuck at its edge", () => {
  const w = new World("water");
  const pond = w.landscape.ponds[0],
    r = pond.rx * waterScale(pond) * 1.04;
  const ant = w.makeAnt(
    "worker",
    pond.x - Math.cos(pond.angle) * r,
    pond.z - Math.sin(pond.angle) * r,
  );
  w.ants = [ant];
  const origin = { ...ant };
  for (let i = 0; i < 100; i++)
    w.moveSurface(
      ant,
      Math.atan2(
        pond.z + Math.sin(pond.angle) * 2.5 - ant.z,
        pond.x + Math.cos(pond.angle) * 2.5 - ant.x,
      ),
      0.09,
    );
  assert.ok(Math.hypot(ant.x - origin.x, ant.z - origin.z) > 2);
  assert.ok(
    Math.hypot(
      ant.x - (pond.x + Math.cos(pond.angle) * 2.5),
      ant.z - (pond.z + Math.sin(pond.angle) * 2.5),
    ) < 0.35,
    "the worker must reach the far side of its actual seeded pond",
  );
  assert.ok(!w.inPond(ant.x, ant.z));
});
