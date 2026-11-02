import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { profileReference } from "../src/modules/biology/catalog.ts";
import { ensureSoilClimate } from "../src/modules/microclimate/initialize.ts";
const fresh = (version = 3, params = {}) =>
  new World(
    "material-fixture",
    { humidity: 68, ...params },
    {
      founding: false,
      biologicalProfile: profileReference("generic-microclimate-demo", version),
    },
  );
test("material profile initializes explicit bounded inputs and rejects invalid construction or recovery", () => {
  const w = fresh();
  assert.equal(w.params.soilClayPercent, 35);
  assert.equal(w.params.soilCompactionPercent, 50);
  for (const value of [-1, 101, NaN])
    assert.throws(
      () => fresh(3, { soilClayPercent: value }),
      /material do solo/,
    );
  for (const edit of [
    (p) => delete p.soilClayPercent,
    (p) => (p.soilCompactionPercent = 101),
  ]) {
    const bad = w.snapshot();
    edit(bad.params);
    assert.throws(() => World.restore(bad), /material do solo/);
  }
});
test("neutral material keeps the complete previous numerical future apart from its pinned identity and two inputs", () => {
  const a = fresh(2),
    b = fresh(3);
  a.step(250);
  b.step(250);
  const x = a.snapshot(),
    y = b.snapshot();
  delete x.biologicalProfile;
  delete y.biologicalProfile;
  delete y.params.soilClayPercent;
  delete y.params.soilCompactionPercent;
  assert.deepEqual(x, y);
});
test("material interventions are bounded, preserve instantaneous water/heat and restore the same future", () => {
  const w = fresh(),
    s = ensureSoilClimate(w),
    before = structuredClone(s);
  assert.equal(w.intervene("soilClayPercent", 0, 0, 500), true);
  assert.equal(w.params.soilClayPercent, 100);
  assert.equal(w.intervene("soilCompactionPercent", 0, 0, -20), true);
  assert.equal(w.params.soilCompactionPercent, 0);
  assert.deepEqual(s, before);
  const frozen = w.snapshot();
  assert.equal(w.intervene("soilClayPercent", 0, 0, NaN), false);
  assert.deepEqual(w.snapshot(), frozen);
  const copy = World.restore(w.snapshot());
  w.step(150);
  copy.step(150);
  assert.deepEqual(w.snapshot(), copy.snapshot());
  const old = fresh(2),
    oldState = old.snapshot();
  assert.equal(old.intervene("soilClayPercent", 0, 0, 50), false);
  assert.deepEqual(old.snapshot(), oldState);
});
test("child colonies recover the same shared material inputs rather than silently creating another mixture", async () => {
  const { family } = await import("./fixtures/family.mjs"),
    { initializeRoomStores } =
      await import("../src/modules/stores/initialize.ts"),
    { initializeSeason } = await import("../src/modules/seasons/update.ts"),
    { initializeMaternalReserves } =
      await import("../src/modules/maternal/initialize.ts"),
    { initializeSoilMaterial } =
      await import("../src/modules/soil-material/initialize.ts");
  const { w, child } = family("material-family");
  for (const c of [w, child]) {
    c.biologicalProfile = profileReference("generic-microclimate-demo", 3);
    initializeSoilMaterial(c);
    initializeMaternalReserves(c);
    initializeSeason(c);
    initializeRoomStores(c);
  }
  w.intervene("soilCompactionPercent", 0, 0, 75);
  const raw = w.snapshot();
  delete raw.colonies[0].params;
  const copy = World.restore(raw);
  assert.equal(copy.params, copy.colonies[0].params);
  assert.equal(copy.colonies[0].params.soilCompactionPercent, 75);
});
