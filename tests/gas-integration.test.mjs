import { test } from "node:test";
import assert from "node:assert/strict";
import { family } from "./fixtures/family.mjs";
import { World } from "./fixtures/established-world.mjs";
import { colonyWorlds } from "../src/modules/colonies/types.ts";
import { ensureSoilClimate } from "../src/modules/microclimate/initialize.ts";
import { updateErosion } from "../src/modules/soil/erosion.ts";
import { spoilStocks } from "../src/modules/colony/waste.ts";
import { gasBudget } from "../src/modules/ventilation/sensing.ts";
import { chooseLocalExit } from "../src/modules/navigation/local-route-policy.ts";
test("two colonies share one gas update, conservative ledgers and deterministic restored future", () => {
  const { w } = family("gas-family");
  w.step(30);
  assert.equal(w.gases.steps, 3);
  assert.equal(colonyWorlds(w).length, 2);
  assert.ok(colonyWorlds(w).every((c) => c.gases === w.gases));
  const restored = World.restore(w.snapshot());
  assert.ok(colonyWorlds(restored).every((c) => c.gases === restored.gases));
  w.intervene("windX", 0, 0, 3);
  restored.intervene("windX", 0, 0, 3);
  w.step(40);
  restored.step(40);
  assert.deepEqual(w.snapshot(), restored.snapshot());
  const budget = gasBudget(w.gases);
  assert.ok(Math.abs(budget.oxygen) < 1e-8);
  assert.ok(Math.abs(budget.carbon) < 1e-9);
  assert.ok(
    w.gases.cells.every(
      (c) => c.oxygen >= 0 && c.carbon >= 0 && Number.isFinite(c.oxygen),
    ),
  );
  assert.ok(w.gases.residual < 1e-9);
});
test("soil wear and food spoilage use local pore water rather than an air humidity shortcut", () => {
  const dry = new World("local-wear", { humidity: 100 }),
    wet = World.restore(dry.snapshot());
  const a = ensureSoilClimate(dry),
    b = ensureSoilClimate(wet);
  a.water.fill(a.capacity * 0.55);
  b.water.fill(b.capacity * 0.99);
  dry.tick = wet.tick = 100;
  dry.food = wet.food = 10;
  updateErosion(dry);
  updateErosion(wet);
  spoilStocks(dry);
  spoilStocks(wet);
  assert.equal(dry.params.humidity, wet.params.humidity);
  assert.ok(wet.soil.integrity[0] < dry.soil.integrity[0]);
  assert.ok(wet.colony.spoiled > 0);
  assert.equal(dry.colony.spoiled, 0);
  assert.ok(Math.abs(wet.food + wet.colony.spoiled - 10) < 1e-12);
  assert.ok(
    Math.abs(
      wet.colony.waste.reduce((n, c) => n + c.mass, 0) - wet.colony.spoiled,
    ) < 1e-12,
  );
});
test("ACO keeps exploration but strongly prefers a locally breathable equal exit", () => {
  let state = 7,
    healthy = 0;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
  const base = {
    signal: 0,
    visited: false,
    backtrack: false,
    goalVisible: false,
  };
  for (let i = 0; i < 2000; i++)
    if (
      chooseLocalExit(
        [
          { ...base, id: 1, comfort: 0.05 },
          { ...base, id: 2, comfort: 1 },
        ],
        rand,
      ) === 2
    )
      healthy++;
  assert.ok(healthy > 1900);
  assert.ok(healthy < 2000);
});
