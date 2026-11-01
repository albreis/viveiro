import assert from "node:assert/strict";
import { World } from "./established-world.mjs";
import { laySexualBrood } from "../../src/modules/colonies/sexual-brood.ts";
import { updateBroodLifecycle } from "../../src/modules/colony/lifecycle.ts";
import { spawnDaughter } from "../../src/modules/colonies/spawn.ts";
export const cohort = (seed = "daughter") => {
  const w = new World(seed, { humidity: 68 });
  w.predators = [];
  w.tick = 2600;
  w.food = 30;
  w.lastLaying = 1e7;
  w.ants[0].age = 26;
  w.ants = w.ants.filter((a) => a.kind === "queen");
  for (let i = 0; i < 12; i++)
    w.ants.push(w.makeAnt("worker", -5 + i * 0.4, -3));
  assert.equal(laySexualBrood(w), true);
  const embryos = structuredClone(w.brood);
  for (const b of w.brood) b.age = 1.31;
  updateBroodLifecycle(w, 1);
  const gyne = w.ants.find((a) => a.kind === "gyne"),
    male = w.ants.find((a) => a.kind === "male");
  w.ants = w.ants.filter((a) => a.kind !== "worker");
  return { w, gyne, male, embryos };
};
export const family = (seed = "daughter") => {
  const f = cohort(seed),
    m = f.w.nest.nodes[0];
  for (const [i, a] of [f.gyne, f.male].entries())
    Object.assign(a, {
      x: m.x + 0.6,
      y: m.y + 0.01,
      z: m.z + i * 0.3,
      node: null,
      route: [],
      age: 1.2,
    });
  const child = spawnDaughter(f.w, f.w, f.gyne, f.male);
  assert.ok(child);
  return { ...f, child };
};
