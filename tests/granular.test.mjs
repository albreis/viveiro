import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { updateGranular } from "../src/modules/granular/update.ts";
import { integrateGrain } from "../src/modules/granular/support.ts";
import { grainContact } from "../src/modules/granular/contacts.ts";
import {
  createGranularState,
  grainRadius,
} from "../src/modules/granular/types.ts";
import { grainPairs } from "../src/modules/granular/neighbors.ts";
import { soilBalance } from "../src/modules/soil/ledger.ts";
import { sampleSupport } from "../src/modules/terrain/field.ts";
import { collapseEdge } from "../src/modules/soil/erosion.ts";
import { undergroundEdge } from "./fixtures/geometry.mjs";
const grain = (id, x, y, z = 0, r = 0.1) => ({
  id,
  x,
  y,
  z,
  mass: (4 / 3) * Math.PI * r ** 3,
  velocity: { x: 0, y: 0, z: 0 },
});
test("loose material falls, settles on real support and conserves its volume budget", () => {
  const w = new World("falling-grain");
  w.nest = { nodes: [], links: [], revision: 5 };
  w.ants = [];
  const g = grain(1, 0, 0.7);
  w.nest.rubble = [g];
  w.soil.eroded = g.mass;
  let maxStep = 0;
  for (let i = 0; i < 250; i++) {
    const p = { ...g };
    w.tick++;
    updateGranular(w);
    maxStep = Math.max(maxStep, Math.hypot(g.x - p.x, g.y - p.y, g.z - p.z));
    assert.ok(Math.abs(soilBalance(w).error) < 1e-12);
  }
  assert.ok(g.y < 0.12);
  assert.ok(Math.abs(g.y - grainRadius(g)) < 0.002);
  assert.ok(maxStep <= 0.016001);
  assert.ok(Math.hypot(...Object.values(g.velocity)) < 0.0001);
  assert.ok(w.soil.granular.steps === 250);
});
test("Coulomb friction separates a stable incline from a slipping incline at the repose threshold", () => {
  const slope = Math.PI / 6,
    n = { x: -Math.sin(slope), y: Math.cos(slope), z: 0 },
    plane = (_, p) => ({ distance: p.x * n.x + p.y * n.y, ...n });
  function run(mu) {
    const g = grain(1, 0, 0.1 / n.y),
      s = createGranularState();
    s.friction = mu;
    for (let i = 0; i < 400; i++) integrateGrain({}, g, s, 0.25, plane);
    return g;
  }
  const high = run(1),
    low = run(0.2);
  assert.ok(Math.abs(high.x) < 0.002);
  assert.ok(low.x < -0.2);
  assert.ok(Math.abs(plane(null, low).distance - 0.1) < 0.002);
});
test("pair contacts conserve momentum, dissipate relative motion and remain finite when centers coincide", () => {
  const a = grain(1, -0.09, 0.1),
    b = grain(2, 0.09, 0.1),
    s = createGranularState();
  a.velocity.x = 0.004;
  b.velocity.x = -0.004;
  const before = a.mass * a.velocity.x + b.mass * b.velocity.x;
  grainContact(a, b, s, 0.25);
  assert.ok(
    Math.abs(a.mass * a.velocity.x + b.mass * b.velocity.x - before) < 1e-15,
  );
  assert.ok(Math.abs(a.velocity.x - b.velocity.x) < 0.008);
  a.x = b.x = 0;
  grainContact(a, b, s, 0.25);
  assert.ok(
    [...Object.values(a.velocity), ...Object.values(b.velocity)].every(
      Number.isFinite,
    ),
  );
  assert.ok(s.contacts >= 2);
});
test("spatial cells emit local candidate pairs once without missing a contact across a cell boundary", () => {
  const a = grain(1, 0.2, 0),
    b = grain(2, 0.21, 0),
    c = grain(3, 4, 0);
  const pairs = grainPairs([a, b, c]);
  assert.equal(pairs.length, 1);
  assert.deepEqual(pairs[0], [a, b]);
});
test("a collapse starts near the removed ceiling, settles inside the tunnel and restores with the same future", () => {
  const w = new World("granular-collapse");
  w.ants = [];
  w.predators = [];
  const edge = undergroundEdge(w),
    p = collapseEdge(w, edge.i, true);
  assert.ok(p);
  const start = p.y;
  w.step(100);
  assert.ok(p.y < start - grainRadius(p) * 0.25);
  assert.ok(Math.abs(soilBalance(w).error) < 1e-10);
  const base = { ...w.nest, rubble: [] };
  assert.ok(sampleSupport(base, p).distance >= grainRadius(p) - 0.003);
  const restored = World.restore(w.snapshot());
  w.step(120);
  restored.step(120);
  assert.deepEqual(restored.snapshot(), w.snapshot());
});
test("the user repose parameter is bounded, saved and changes the physical friction coefficient", () => {
  const w = new World("repose-control");
  w.intervene("reposeAngle", 0, 0, 20);
  w.step();
  assert.ok(
    Math.abs(w.soil.granular.friction - Math.tan((20 * Math.PI) / 180)) < 1e-12,
  );
  w.intervene("reposeAngle", 0, 0, 80);
  assert.equal(w.params.reposeAngle, 55);
  assert.equal(World.restore(w.snapshot()).params.reposeAngle, 55);
});
