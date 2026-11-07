import assert from "node:assert/strict";
import { test } from "node:test";
import { sealFixture } from "./fixtures/seal.mjs";
import { profileReference } from "../src/modules/biology/catalog.ts";
import {
  reclaimSpoil,
  fillPlug,
  removePlug,
} from "../src/modules/sealing/material.ts";
import { updateSealWorker } from "../src/modules/sealing/worker.ts";
import { sealDumpPoint } from "../src/modules/sealing/queen.ts";
import { projectSupport } from "../src/modules/terrain/surface-queries.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";

function firstDump(version) {
  const { w, q, p } = sealFixture();
  w.biologicalProfile = profileReference("messor-narbonne", version);
  reclaimSpoil(w, q, p.capacity);
  fillPlug(w, q, p, 1);
  const a = w.makeAnt("worker", 0, 0);
  w.ants.push(a);
  Object.assign(a, { ...q, id: a.id, kind: "worker", carryingSoil: 0 });
  removePlug(w, a, p, 0.04);
  const point = projectSupport(w.nest, sealDumpPoint(w));
  Object.assign(a, point.point, {
    normal: point.normal,
    node: null,
    route: [],
  });
  w.founding.phase = "claustral";
  Object.assign(w.founding.seal, { phase: "haul", workerId: a.id });
  return { w, a, p };
}

test("a physical pilot dump ends Narbonne v2 fasting while remaining plug work continues", () => {
  const { w, a, p } = firstDump(2);
  assert.equal(updateSealWorker(w, a), true);
  assert.equal(w.founding.phase, "established");
  assert.equal(w.founding.seal.phase, "return");
  assert.equal(w.founding.seal.trips, 1);
  assert.ok(p.mass > 0);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-8);
  const distance = a.distanceWalked || 0;
  assert.equal(updateSealWorker(w, a), true);
  assert.equal(w.founding.seal.phase, "return");
  assert.ok(a.distanceWalked > distance);
});

test("the archived Narbonne v1 keeps its full plug removal criterion", () => {
  const { w, a, p } = firstDump(1);
  assert.equal(updateSealWorker(w, a), true);
  assert.equal(w.founding.phase, "claustral");
  assert.equal(w.founding.seal.phase, "return");
  assert.ok(p.mass > 0);
});
