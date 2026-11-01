import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import {
  createMaternalState,
  maternalBalance,
} from "../src/modules/maternal/pools.ts";
import { validateMaternalState } from "../src/modules/maternal/validation.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
test("maintenance consumes released muscle credits first when no accessible reserve remains, so no unpaid seed cavity is created", () => {
  const w = new World(
      "unpaid-dig",
      { humidity: 68 },
      { biologicalProfile: profileReference("generic-demo", 2) },
    ),
    f = w.founding;
  const state = createMaternalState(2);
  state.initial = { lipid: 0, protein: 0, muscle: 2 };
  state.stores = { ...state.initial };
  f.maternal = state;
  f.initialReserves = f.reserves = 2;
  f.phase = "digging";
  w.ants.find((a) => a.kind === "queen").winged = false;
  w.step(30);
  assert.equal(w.nest.nodes.length, 0);
  assert.equal(w.soil.removed, 0);
  assert.equal(f.spent.excavation, 0);
  assert.ok(f.spent.maintenance > 0);
  assert.ok(state.unmet.excavation > 0);
  assert.ok(Math.abs(maternalBalance(state).error) < 1e-8);
});
test("pooled reserves finance physical founding, eggs and larvae through the first nanitics with conservative material and nutrient ledgers", () => {
  const w = new World(
    "a",
    { humidity: 68 },
    { biologicalProfile: profileReference("generic-demo", 2) },
  );
  let maxError = 0;
  while (
    w.tick < 6000 &&
    !["established", "failed"].includes(w.founding.phase)
  ) {
    w.step();
    if (w.tick % 25 === 0) {
      validateMaternalState(w.founding.maternal);
      maxError = Math.max(
        maxError,
        Math.abs(maternalBalance(w.founding.maternal).error),
      );
    }
  }
  const f = w.founding;
  assert.equal(f.phase, "established");
  assert.ok(f.nanitics > 0);
  assert.ok(f.trips > 0);
  assert.ok(f.spent.eggs > 0 && f.spent.larvae > 0 && f.spent.excavation > 0);
  assert.ok(maxError < 1e-7);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-7);
  assert.ok(f.reserves >= 0);
  console.log(
    JSON.stringify({
      profile: 2,
      firstNaniticsTick: w.tick,
      nanitics: f.nanitics,
      reserveRemaining: f.reserves,
      nutrientError: maternalBalance(f.maternal).error,
      soilError: soilBalance(w).error,
    }),
  );
});
