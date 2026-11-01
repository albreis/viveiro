import { test } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { World } from "../src/modules/simulation/world.js";
import {
  createMaternalState,
  histolyzeMuscle,
  withdrawMaternal,
  maternalBalance,
  accessibleReserve,
} from "../src/modules/maternal/pools.ts";
import { validateMaternalState } from "../src/modules/maternal/validation.ts";
import {
  profileReference,
  latestProfileReference,
  biologicalProfileKey,
  biologicalReferenceFromKey,
} from "../src/modules/biology/catalog.ts";
import { advanceMaternalReserves } from "../src/modules/maternal/initialize.ts";
import { spendReserve } from "../src/modules/founding/types.ts";
import { updateBroodLifecycle } from "../src/modules/colony/lifecycle.ts";
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, a + " vs " + b);
test("histolysis transfers existing reserves and arbitrary paid requests conserve each nutrient without negative pools", () => {
  const state = createMaternalState(8);
  assert.deepEqual(state.stores, { lipid: 3, protein: 3, muscle: 2 });
  for (let i = 0; i < 4000; i++) {
    histolyzeMuscle(state);
    withdrawMaternal(state, i % 3 ? "maintenance" : "larvae", 0.003);
    close(maternalBalance(state).error, 0);
    validateMaternalState(state);
  }
  close(state.converted, 2);
  close(maternalBalance(state).remaining, 0);
  close(maternalBalance(state).consumed, 8);
  assert.equal(withdrawMaternal(state, "eggs", 1), 0);
});
test("lipid cannot create eggs or feed larvae and unconverted muscle is unavailable to spending", () => {
  const state = createMaternalState(8);
  withdrawMaternal(state, "eggs", 3);
  assert.equal(accessibleReserve(state, "eggs"), 0);
  assert.equal(withdrawMaternal(state, "larvae", 1), 0);
  assert.equal(state.stores.lipid, 3);
  assert.equal(state.stores.muscle, 2);
  close(withdrawMaternal(state, "maintenance", 4), 3);
  histolyzeMuscle(state, 100);
  close(withdrawMaternal(state, "eggs", 0.2), 0.1);
  close(maternalBalance(state).error, 0);
});
test("revision one remains scalar while revision two pins separate stores and histolysis starts after wing loss", () => {
  const old = new World(
      "revision",
      {},
      { biologicalProfile: profileReference() },
    ),
    next = new World(
      "revision",
      {},
      { biologicalProfile: profileReference("generic-demo", 2) },
    );
  assert.equal(old.founding.maternal, undefined);
  assert.ok(next.founding.maternal);
  const state = next.founding.maternal;
  advanceMaternalReserves(next);
  assert.equal(state.converted, 0);
  next.ants.find((a) => a.kind === "queen").winged = false;
  next.founding.phase = "digging";
  advanceMaternalReserves(next);
  close(state.converted, 0.001);
  close(next.founding.reserves, 8);
  spendReserve(next, "maintenance", 0.1);
  close(next.founding.reserves, 7.9);
  close(next.founding.spent.maintenance, 0.1);
  assert.equal(latestProfileReference().version, 3);
  assert.deepEqual(
    biologicalReferenceFromKey(biologicalProfileKey(next.biologicalProfile)),
    next.biologicalProfile,
  );
});
test("a queen with only lipids cannot produce free brood even when total reserves exceed the laying threshold", () => {
  const w = new World(
    "protein-limit",
    {},
    { founding: false, biologicalProfile: profileReference("generic-demo", 2) },
  );
  const state = createMaternalState(8);
  state.initial = { lipid: 8, protein: 0, muscle: 0 };
  state.stores = { ...state.initial };
  w.founding = {
    phase: "claustral",
    firstClutch: false,
    reserves: 8,
    initialReserves: 8,
    maternal: state,
    spent: { maintenance: 0, eggs: 0, larvae: 0, excavation: 0 },
  };
  w.food = 0;
  w.tick = 100;
  w.lastLaying = 0;
  updateBroodLifecycle(w, 1);
  assert.equal(w.brood.length, 0);
  close(w.founding.reserves, 8);
});
test("snapshot restore retains exact nutrient flows and rejects inconsistent stores without changing the source", () => {
  const w = new World(
    "pool-restore",
    { humidity: 68 },
    { biologicalProfile: profileReference("generic-demo", 2) },
  );
  w.step(100);
  const before = w.snapshot(),
    other = World.restore(before);
  w.step(40);
  other.step(40);
  assert.ok(isDeepStrictEqual(w.snapshot(), other.snapshot()));
  const sourceProtein = before.founding.maternal.stores.protein;
  const wrongRevision = structuredClone(before);
  wrongRevision.biologicalProfile.version = 1;
  assert.throws(() => World.restore(wrongRevision), /revisão/);
  const broken = structuredClone(before);
  broken.founding.maternal.stores.protein += 1;
  assert.throws(() => World.restore(broken), /materno/);
  assert.equal(before.founding.maternal.stores.protein, sourceProtein);
  assert.throws(
    () =>
      validateMaternalState({
        ...createMaternalState(8),
        stores: { lipid: -1, protein: 3, muscle: 2 },
      }),
    /Nutrientes/,
  );
});
