import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { family } from "./fixtures/family.mjs";
import {
  laySexualBrood,
  GYNE_COST,
  MALE_COST,
} from "../src/modules/colonies/sexual-brood.ts";
import { diffuseEvaporate } from "../src/modules/chemistry/reaction-diffusion.ts";
const mature = () => {
  const w = new World("budget");
  w.tick = 3000;
  w.ants[0].age = 30;
  w.ants = w.ants.filter((a) => a.kind === "queen");
  for (let i = 0; i < 12; i++) w.ants.push(w.makeAnt("worker", i * 0.5, 0));
  w.food = 0;
  return w;
};
test("small food returns can finance a cohort conservatively without a large instantaneous stock", () => {
  const w = mature();
  let delivered = 0,
    spent = 0;
  for (let i = 0; i < 30 && !w.brood.length; i++) {
    w.food += 0.65;
    delivered += 0.65;
    if (laySexualBrood(w)) spent += GYNE_COST + MALE_COST;
    assert.ok(
      Math.abs(delivered - w.food - (w.colony.reproductiveFood || 0) - spent) <
        1e-8,
    );
    w.tick++;
  }
  assert.equal(w.brood.length, 2);
  assert.ok(w.food >= 1.2 - 1e-9);
  assert.ok(w.food < 3);
  assert.equal(spent, GYNE_COST + MALE_COST);
});
test("reproductive savings return to ordinary food during a food or queen-health crisis", () => {
  const w = mature();
  w.colony.reproductiveFood = 5;
  w.food = 0;
  w.queenHealth = 20;
  assert.equal(laySexualBrood(w), false);
  assert.equal(w.food, 1.2);
  assert.equal(w.colony.reproductiveFood, 3.8);
  assert.equal(w.brood.length, 0);
});
test("shared landscape chemistry is integrated once per global tick, regardless of colony count", () => {
  const { w, child } = family("chemistry-family");
  w.ants = [];
  child.ants = [];
  w.food = child.food = 0;
  w.pheromones[3] = 1;
  const expected = [...w.pheromones],
    h = w.params.humidity / 100;
  diffuseEvaporate(expected, {
    width: 40,
    height: 26,
    cellSize: 0.5,
    diffusion: 0.008 + h * 0.008,
    decay: 0.012 + (1 - h) * 0.012,
    dt: 1,
    windX: 0,
    windZ: 0,
  });
  w.step();
  assert.deepEqual(w.pheromones, expected);
  assert.equal(child.pheromones, w.pheromones);
  assert.equal(child.tick, w.tick);
});

test("savings are released when the habitat reaches its colony limit", () => {
  const w = mature();
  w.colony.reproductiveFood = 4;
  w.food = 1;
  w.remainingFoundations = 0;
  assert.equal(laySexualBrood(w), false);
  assert.equal(w.food, 5);
  assert.equal(w.colony.reproductiveFood, 0);
});
