import { test } from "node:test";
import assert from "node:assert/strict";
import {
  diffuseEvaporate,
  depositPheromone,
} from "../src/modules/chemistry/reaction-diffusion.ts";
import { sampleACO } from "../src/modules/chemistry/aco.ts";
import {
  responseProbability,
  taskThresholds,
} from "../src/modules/colony/response.ts";
import { senseTaskStimuli } from "../src/modules/colony/stimuli.ts";
import { contactAcrossAir } from "../src/modules/colony/contact.ts";
import { World } from "../src/modules/simulation/world.js";
const sum = (a) => a.reduce((n, v) => n + v, 0);

test("diffusion spreads a deposit conservatively and evaporation matches exponential decay", () => {
  const field = Array(81).fill(0);
  field[40] = 1;
  const p = {
    width: 9,
    height: 9,
    cellSize: 0.5,
    diffusion: 0.03,
    decay: 0,
    dt: 10,
  };
  diffuseEvaporate(field, p);
  assert.ok(Math.abs(sum(field) - 1) < 1e-10);
  assert.ok(field[39] > 0 && field[40] < 1);
  diffuseEvaporate(field, { ...p, decay: 0.2, dt: 5 });
  assert.ok(Math.abs(sum(field) - Math.exp(-1)) < 1e-10);
  assert.ok(field.every((v) => Number.isFinite(v) && v >= 0));
});

test("wind advects the field without creating mass and large steps remain stable", () => {
  const field = Array(31 * 11).fill(0);
  field[5 * 31 + 6] = 1;
  const center = () =>
    field.reduce((n, v, i) => n + (i % 31) * v, 0) / sum(field);
  const before = center();
  diffuseEvaporate(field, {
    width: 31,
    height: 11,
    cellSize: 0.5,
    diffusion: 0.02,
    decay: 0,
    dt: 8,
    windX: 0.15,
  });
  assert.ok(center() > before + 1);
  assert.ok(Math.abs(sum(field) - 1) < 1e-10);
  diffuseEvaporate(field, {
    width: 31,
    height: 11,
    cellSize: 0.5,
    diffusion: 2,
    decay: 0,
    dt: 15,
    windZ: -0.3,
  });
  assert.ok(field.every((v) => Number.isFinite(v) && v >= 0));
  assert.ok(Math.abs(sum(field) - 1) < 1e-8);
  const saturated = [6];
  assert.equal(depositPheromone(saturated, 0, 0.25), 0);
  assert.equal(saturated[0], 6);
});

test("ACO samples the expected distribution while retaining exploration", () => {
  const w = new World("aco-samples");
  let preferred = 0;
  for (let i = 0; i < 12000; i++)
    preferred +=
      sampleACO([4, 1], [1, 1], () => w.random(), {
        alpha: 1,
        beta: 1,
        exploration: 0.1,
      }) === 0
        ? 1
        : 0;
  assert.ok(Math.abs(preferred / 12000 - 0.77) < 0.02);
  assert.ok(preferred < 12000 && preferred > 0);
});

test("stimulus response activates high-threshold ants as local demand rises", () => {
  assert.equal(responseProbability(1, 1), 0.5);
  assert.equal(responseProbability(0, 1), 0);
  assert.ok(responseProbability(10, 0.9) > responseProbability(0.1, 0.9));
  assert.equal(responseProbability(1e200, 1), 1);
  assert.deepEqual(taskThresholds("t", 4), taskThresholds("t", 4));
  assert.notDeepEqual(taskThresholds("t", 4), taskThresholds("t", 5));
  const w = new World("local-stimuli"),
    ant = w.makeAnt("worker", 0, 0);
  w.ants = [ant];
  w.brood = [];
  w.predators = [];
  const waste = {
    id: 999,
    kind: "corpse",
    mass: 2,
    stored: false,
    x: 8,
    y: 0,
    z: 5,
  };
  w.colony.waste = [waste];
  assert.equal(senseTaskStimuli(w, ant).cleaner, 0);
  waste.x = 0.2;
  waste.z = 0;
  assert.ok(senseTaskStimuli(w, ant).cleaner > 0);
});

test("social food cannot pass through a soil wall", () => {
  const nest = {
    revision: 2,
    links: [],
    nodes: [
      { x: -0.35, y: -1, z: 0, r: 0.3, type: "chamber", name: "a" },
      { x: 0.35, y: -1, z: 0, r: 0.3, type: "chamber", name: "b" },
    ],
  };
  const a = {
    id: 1,
    x: -0.058,
    y: -1,
    z: 0,
    angle: Math.PI / 2,
    speed: 0.09,
    energy: 100,
    carrying: 0,
    normal: { x: -1, y: 0, z: 0 },
    node: 0,
    route: [],
  };
  const b = { ...a, id: 2, x: 0.058, normal: { x: 1, y: 0, z: 0 }, node: 1 };
  assert.equal(contactAcrossAir(nest, a, b), false);
  nest.nodes = [{ x: 0, y: -1, z: 0, r: 0.4, type: "chamber", name: "c" }];
  Object.assign(a, { x: -0.1, y: -1.35, normal: { x: 0, y: 1, z: 0 } });
  Object.assign(b, { x: 0.1, y: -1.35, normal: { x: 0, y: 1, z: 0 } });
  assert.equal(contactAcrossAir(nest, a, b), true);
});
