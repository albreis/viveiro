import { test } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { World } from "../src/modules/simulation/world.js";
import {
  profileReference,
  latestProfileReference,
  resolveBiologicalProfile,
} from "../src/modules/biology/catalog.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
import { maternalBalance } from "../src/modules/maternal/pools.ts";
import { sampleSoil, sampleSupport } from "../src/modules/terrain/field.ts";
import { normalizeSession } from "../src/modules/persistence/validation.ts";
const near = (x) => assert.ok(Math.abs(x) < 1e-7, String(x));
test("new model revision is explicit; old pooled and scalar profiles retain an open entrance", () => {
  assert.equal(latestProfileReference().version, 4);
  for (const v of [1, 2])
    assert.notEqual(
      resolveBiologicalProfile(profileReference("generic-demo", v))
        .entranceModel,
      "plug",
    );
  assert.equal(resolveBiologicalProfile().version, 1);
});
test("three seeds physically close, rear nanitics and reopen without unbounded body steps or free soil; closed saves preserve their complete future", () => {
  for (const seed of ["a", "RESERVAS-QA", "SEMENTE-42"]) {
    const w = new World(
      seed,
      { humidity: 68 },
      { biologicalProfile: profileReference("generic-demo", 3) },
    );
    let closed,
      restored,
      maxStep = 0,
      clearDuringClosure = true;
    while (
      w.tick < 7000 &&
      !["failed", "established"].includes(w.founding.phase)
    ) {
      const old = new Map(
        w.ants.map((a) => [a.id, { x: a.x, y: a.y, z: a.z }]),
      );
      w.step();
      for (const a of w.ants) {
        const p = old.get(a.id);
        if (p)
          maxStep = Math.max(
            maxStep,
            Math.hypot(a.x - p.x, a.y - p.y, a.z - p.z),
          );
      }
      const f = w.founding,
        p = w.nest.plugs?.[0];
      if (f.seal?.phase === "build" || f.seal?.phase === "closed")
        for (const a of w.ants)
          clearDuringClosure &&= sampleSoil(w.nest, a).distance >= -0.02;
      if (!closed && f.seal?.phase === "closed") {
        closed = w.tick;
        assert.ok(p.mass > 0 && p.innerRadius === 0);
        assert.ok(sampleSoil(w.nest, p).distance < 0);
        restored = World.restore(w.snapshot());
        normalizeSession({
          version: 1,
          world: w.snapshot(),
          scenario: "a",
          comparison: null,
          initial: {
            seed,
            params: { ...w.params },
            biologicalProfile: profileReference("generic-demo", 3),
          },
          interventions: [],
          running: false,
          replaying: false,
          replayIndex: 0,
        });
      } else if (restored) restored.step();
      near(soilBalance(w).error);
      near(maternalBalance(f.maternal).error);
    }
    assert.equal(
      w.founding.phase,
      "established",
      seed + ": " + w.ants[0]?.state,
    );
    assert.equal(w.founding.seal.phase, "opened");
    assert.ok(w.founding.nanitics > 0 && w.founding.seal.trips > 0);
    assert.ok(closed && w.founding.seal.openedTick > closed);
    assert.ok(maxStep < 0.13);
    assert.ok(clearDuringClosure);
    assert.ok(
      isDeepStrictEqual(w.snapshot(), restored.snapshot()),
      seed + " restored future differs",
    );
    console.log(
      JSON.stringify({
        seed,
        closed,
        opened: w.tick,
        trips: w.founding.seal.trips,
        maxStep,
        reserve: w.founding.reserves,
        soilError: soilBalance(w).error,
      }),
    );
  }
});
