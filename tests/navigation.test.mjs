import { isolatedGallery, lerp } from "./fixtures/geometry.mjs";
import { sampleSupport } from "../src/modules/terrain/field.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { socialForces } from "../src/modules/navigation/social-forces.ts";
import {
  navigationState,
  contactResponse,
  widenCongestedTunnel,
} from "../src/modules/navigation/contact.ts";
import { World } from "./fixtures/established-world.mjs";
import {
  tunnelEnvelope,
  tunnelFooting,
} from "../src/modules/terrain/terrain.js";
import {
  startSupportedMotion,
  advanceSupportedMotion,
} from "../src/modules/navigation/support-motion.ts";

const ant = (id, x = 0) => ({
  id,
  kind: "worker",
  x,
  y: 0,
  z: 0,
  speed: 0.09,
  angle: 0,
  energy: 100,
  carrying: 0,
  route: [],
  node: null,
});
const forward = { x: 1, y: 0, z: 0 },
  up = { x: 0, y: 1, z: 0 };
const magnitude = (v) => Math.hypot(v.x, v.y, v.z);

test("a loaded neighbor exerts twice the repulsion on an empty worker", () => {
  const a = ant(1),
    b = ant(2, 0.3);
  const empty = socialForces(a, [b], forward, 0.09);
  b.carrying = 0.5;
  const loaded = socialForces(a, [b], forward, 0.09);
  assert.ok(
    Math.abs(magnitude(loaded.repulsion) - 2 * magnitude(empty.repulsion)) <
      1e-10,
  );
  assert.ok(loaded.velocity.z !== 0);
});

test("coincident agents produce finite bounded force and velocity", () => {
  const result = socialForces(ant(1), [ant(2)], forward, 0.09, { climb: true });
  assert.ok(Object.values(result.velocity).every(Number.isFinite));
  assert.ok(magnitude(result.velocity) <= 0.09 * 1.15 + 1e-10);
});

test("persistent antennal contact triggers an asymmetric bypass, and an empty ant yields to cargo", () => {
  const w = new World("contact"),
    a = ant(101),
    b = ant(102, 0.3);
  for (let i = 0; i < 5; i++) {
    w.tick++;
    contactResponse(w, a, socialForces(a, [b], forward, 0.09), forward, up);
  }
  assert.equal(a.state, "Contato Antenal");
  assert.ok(
    a.navigation.turnAngle >= Math.PI / 6 &&
      a.navigation.turnAngle <= Math.PI / 2,
  );
  b.carrying = 0.5;
  const direction = contactResponse(
    w,
    a,
    socialForces(a, [b], forward, 0.09),
    forward,
    up,
  );
  assert.equal(a.state, "Cedendo passagem à carga");
  assert.ok(direction.x < 0);
});

test("congestion widening changes terrain width and revision rather than only an animation", () => {
  const w = new World("dig"),
    a = ant(400),
    revision = w.nest.revision;
  navigationState(a).stagnantTicks = 70;
  w.tick = 4;
  assert.equal(widenCongestedTunnel(w, a, 0), true);
  assert.equal(a.state, "Escavar");
  assert.ok(w.nest.linkWidths[0] > 0.38);
  assert.ok(w.nest.revision > revision);
  assert.ok(a.carryingSoil > 0);
});

test("floor and wall poses share the actual terrain envelope", () => {
  const w = new World("ground"),
    [from, to] = isolatedGallery(w);
  const center = lerp(from, to, 0.5);
  const floor = tunnelFooting(w.nest, center, from, to, 0.35);
  const envelope = tunnelEnvelope(w.nest, floor.x, floor.z, center.y);
  assert.ok(Math.abs(floor.y - envelope.floor) < 0.02);
  const wall = tunnelFooting(w.nest, center, from, to, 1.2);
  assert.equal(wall.inside, true);
  assert.ok(wall.y > floor.y);
  assert.ok(Math.abs(wall.normal.z) > 0.5);
});
test("changing floor height is walked along support points with a bounded step", () => {
  const w = new World("continuous"),
    a = ant(500);
  const [from, to] = isolatedGallery(w);
  const first = tunnelFooting(w.nest, lerp(from, to, 0.1), from, to, 0.35);
  const last = tunnelFooting(w.nest, lerp(from, to, 0.9), from, to, 0.35);
  Object.assign(a, {
    x: first.x,
    y: first.y,
    z: first.z,
    normal: first.normal,
  });
  w.ants = [a];
  startSupportedMotion(w, a, last, last.normal, lerp(from, to, 0.9));
  let wallSeen = false;
  for (let i = 0; i < 200 && a.supportMotion; i++) {
    const previous = { x: a.x, y: a.y, z: a.z };
    w.tick++;
    advanceSupportedMotion(w, a, 0.06);
    assert.ok(
      Math.hypot(a.x - previous.x, a.y - previous.y, a.z - previous.z) <=
        0.060001,
    );
    assert.ok(Math.abs(sampleSupport(w.nest, a).distance - 0.008) < 0.035);
  }
  assert.equal(a.supportMotion, undefined);
  assert.ok(Math.hypot(a.x - last.x, a.y - last.y, a.z - last.z) < 0.001);
});
