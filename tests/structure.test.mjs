import { isDeepStrictEqual } from "node:util";
import { test } from "node:test";
import assert from "node:assert/strict";
import { thinRoof } from "./fixtures/roof.mjs";
import { World } from "./fixtures/established-world.mjs";
import { roofGeometry } from "../src/modules/structure/geometry.ts";
import { roofStrength } from "../src/modules/structure/strength.ts";
import { solidVolume, releaseRoof } from "../src/modules/structure/release.ts";
import { updateStructure } from "../src/modules/structure/update.ts";
import { updateErosion } from "../src/modules/soil/erosion.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
import { updateGranular } from "../src/modules/granular/update.ts";
import { updateSoilWorker } from "../src/modules/soil/worker.ts";
import { tunnelFooting } from "../src/modules/terrain/surface-queries.ts";
const close = (n) => assert.ok(Math.abs(n) < 1e-9, n);
test("capacity responds to span, roof thickness, buttresses and local water rather than a collapse timeout", () => {
  const p = roofGeometry(thinRoof().nest)[0],
    score = (g, s = 0.55) => roofStrength(g, s, 36).safety;
  assert.ok(score({ ...p, span: p.span * 1.5 }) < score(p));
  assert.ok(score({ ...p, thickness: p.thickness * 0.5 }) < score(p));
  assert.ok(score({ ...p, abutment: 0 }) < score(p));
  assert.ok(score(p, 1) < score(p, 0.55));
  assert.ok(score(p, 0) < score(p, 0.55));
  assert.ok(
    roofStrength(p, 0.55, 55).capacity > roofStrength(p, 0.55, 15).capacity,
  );
});
test("excavating a cavity above a gallery removes real roof thickness and lowers its margin", () => {
  const w = thinRoof(),
    thin = roofGeometry(w.nest)[0];
  w.nest.nodes = w.nest.nodes.slice(0, 2);
  w.nest.links = [[0, 1]];
  w.nest.linkWidths = [0.55];
  w.nest.revision++;
  const thick = roofGeometry(w.nest)[0];
  assert.ok(thick.thickness > thin.thickness * 3);
  assert.ok(
    roofStrength(thick, 0.55, 36).safety > roofStrength(thin, 0.55, 36).safety,
  );
});
test("a sustained overloaded roof releases counted solid once and that aggregate falls under gravity", () => {
  const w = thinRoof();
  for (let i = 1; i <= 30 && !w.soil.structure?.failures; i++) {
    w.tick = i * 50;
    updateErosion(w);
  }
  assert.equal(w.soil.structure.failures, 1);
  const grain = w.nest.rubble[0],
    start = grain.y;
  assert.ok(grain.mass > 0);
  close(soilBalance(w).error);
  assert.equal(w.nest.erosionCuts.length, 1);
  const cut = w.nest.erosionCuts[0];
  assert.ok(solidVolume(w, cut, cut.r) < 1e-8);
  const patch = w.soil.structure.patches.find((p) => p.edge === grain.edge);
  assert.equal(releaseRoof(w, patch), null);
  for (let i = 0; i < 100; i++) updateGranular(w);
  assert.ok(grain.y < start - 0.15);
  close(soilBalance(w).error);
});
test("bodies near the release pocket defer detachment and are never displaced by the structural solver", () => {
  const w = thinRoof();
  updateStructure(w);
  const p = w.soil.structure.patches[0],
    a = w.makeAnt("worker", p.roof.x, p.roof.z);
  a.y = p.roof.y - 0.07;
  w.ants = [a];
  w.neighborAgents = [a];
  const before = { x: a.x, y: a.y, z: a.z };
  assert.equal(releaseRoof(w, p), null);
  assert.deepEqual({ x: a.x, y: a.y, z: a.z }, before);
  w.ants = [];
  w.neighborAgents = [];
  assert.ok(releaseRoof(w, p));
});
test("roof damage, grain state and future material budgets survive restore exactly", () => {
  const w = thinRoof();
  for (let i = 1; i <= 24; i++) {
    w.tick = i * 50;
    updateErosion(w);
  }
  assert.ok(w.soil.structure.patches.some((p) => p.damage > 0));
  assert.ok(
    w.nest.rubble?.length > 0,
    "restore fixture must contain a released moving aggregate",
  );
  updateGranular(w);
  const restored = World.restore(w.snapshot());
  w.step(80);
  restored.step(80);
  assert.ok(
    isDeepStrictEqual(w.snapshot(), restored.snapshot()),
    "structural restore must preserve the full future",
  );
  close(soilBalance(w).error);
});
test("an unsupported-to-supported change lowers overload and does not reset unrelated damage", () => {
  const w = thinRoof();
  updateStructure(w);
  const before = w.soil.structure.patches[0].safety;
  w.nest.nodes = w.nest.nodes.slice(0, 2);
  w.nest.links = [[0, 1]];
  w.nest.linkWidths = [0.55];
  w.nest.revision++;
  updateStructure(w);
  assert.ok(w.soil.structure.patches[0].safety > before);
  assert.ok(
    w.soil.structure.patches.every(
      (p) => Number.isFinite(p.safety) && p.damage >= 0 && p.damage <= 1,
    ),
  );
});

test("a repair worker collects a fallen structural chip without deleting its material", () => {
  const w = thinRoof();
  for (let i = 1; i <= 30 && !w.soil.structure?.failures; i++) {
    w.tick = i * 50;
    updateErosion(w);
  }
  const grain = w.nest.rubble[0];
  for (let i = 0; i < 100; i++) updateGranular(w);
  const center = { x: grain.x, y: -2, z: 0 },
    pose = tunnelFooting(w.nest, center, w.nest.nodes[0], w.nest.nodes[1], 0);
  const a = w.makeAnt("worker", pose.x, pose.z);
  Object.assign(a, pose, {
    normal: pose.normal,
    node: 0,
    route: [],
    tunnelCenter: center,
    tunnelY: -2,
    soilTask: {
      phase: "repair",
      rubbleId: grain.id,
      digTicks: 0,
      sourceNode: 0,
    },
  });
  w.ants = [a];
  w.neighborAgents = [a];
  const mass = grain.mass;
  for (let i = 0; i < 25 && !(a.carryingSoil > 0); i++) {
    w.tick++;
    updateSoilWorker(w, a);
  }
  assert.ok(a.carryingSoil > 0);
  assert.ok(Math.abs(grain.mass + a.carryingSoil - mass) < 1e-12);
  close(soilBalance(w).error);
});
