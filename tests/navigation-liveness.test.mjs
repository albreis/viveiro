import { timberLevel } from "../src/modules/landscape/queries.ts";
import { lerp } from "./fixtures/geometry.mjs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { tunnelFooting } from "../src/modules/terrain/surface-queries.ts";
import { sampleSupport } from "../src/modules/terrain/field.ts";
import {
  startSupportedMotion,
  advanceSupportedMotion,
} from "../src/modules/navigation/support-motion.ts";

test("an ant walks around a shaft wall instead of oscillating across its diameter", () => {
  const w = new World("wall-exit");
  const from = w.nest.nodes[7],
    to = w.nest.nodes[6];
  const center = lerp(from, to, 0.4);
  const first = tunnelFooting(w.nest, center, from, to, 0.35);
  const last = tunnelFooting(w.nest, center, from, to, Math.PI + 0.35);
  const ant = {
    id: 501,
    kind: "worker",
    ...first,
    speed: 0.09,
    angle: 0,
    energy: 100,
    carrying: 0,
    node: 7,
    route: [6],
    distanceWalked: 0,
  };
  w.ants = [ant];
  startSupportedMotion(w, ant, last, last.normal, center);
  for (let i = 0; i < 200 && ant.supportMotion; i++) {
    const p = { ...ant };
    w.tick++;
    advanceSupportedMotion(w, ant, 0.075);
    assert.ok(Math.hypot(ant.x - p.x, ant.y - p.y, ant.z - p.z) <= 0.07501);
    assert.ok(Math.abs(sampleSupport(w.nest, ant).distance - 0.008) < 0.035);
  }
  assert.equal(ant.supportMotion, undefined);
  assert.ok(Math.hypot(ant.x - last.x, ant.y - last.y, ant.z - last.z) < 0.025);
});

test("a crowded colony reaches the surface and no worker stays at one wall for days", () => {
  const w = new World("SEMENTE-42", { humidity: 68 });
  const positions = new Map(),
    stuck = new Map(),
    exited = new Set();
  let maxStill = 0;
  for (let i = 0; i < 1500; i++) {
    w.step();
    for (const ant of w.workers) {
      if (ant.node === null && !ant.route?.length && ant.y >= -0.04)
        exited.add(ant.id);
      const origin = positions.get(ant.id);
      if (
        !origin ||
        Math.hypot(ant.x - origin.x, ant.y - origin.y, ant.z - origin.z) > 0.25
      ) {
        positions.set(ant.id, { x: ant.x, y: ant.y, z: ant.z });
        stuck.set(ant.id, 0);
      } else {
        const still = (stuck.get(ant.id) || 0) + 1;
        stuck.set(ant.id, still);
        maxStill = Math.max(maxStill, still);
      }
    }
  }
  console.log(JSON.stringify({ exited: exited.size, maxStill }));
  assert.ok(
    exited.size >= 15,
    "workers must actually leave their birth chamber",
  );
  assert.ok(
    maxStill < 200,
    "a worker stayed within 0.25 units for two simulated days",
  );
});

test("an ant already inside a decorative log walks out with bounded steps", () => {
  const w = new World("log-recovery"),
    log = w.landscape.logs.find((p) => p.kind === "fallen"),
    ant = w.makeAnt("worker", log.x, log.z);
  w.ants = [ant];
  for (let i = 0; i < 50; i++) {
    const old = { x: ant.x, z: ant.z };
    w.tick++;
    w.moveSurface(ant, 0, ant.speed);
    assert.ok(
      Math.hypot(ant.x - old.x, ant.z - old.z) <= ant.speed * 1.2 + 0.002,
    );
  }
  assert.ok(timberLevel(w.landscape, ant.x, ant.z) >= 1);
});

test("a slow ant enters a shaft along the supported lip instead of raycasting above ground", () => {
  const w = new World("SEMENTE-42"),
    entry = w.nest.nodes[0];
  const ant = w.makeAnt("worker", entry.x - 0.16, entry.z - 0.55);
  w.ants = [ant];
  w.brood = [];
  w.predators = [];
  Object.assign(ant, {
    speed: 0.02,
    node: 0,
    route: [1],
    tunnelCenter: { x: entry.x, y: entry.y, z: entry.z },
    tunnelY: entry.y,
  });
  for (let i = 0; i < 400 && (ant.tunnelCenter?.y ?? 0) > -0.25; i++) {
    const before = { x: ant.x, y: ant.y, z: ant.z };
    w.tick++;
    w.moveInNest(ant);
    assert.ok(
      Math.hypot(ant.x - before.x, ant.y - before.y, ant.z - before.z) <=
        ant.speed * 1.2 + 0.002,
    );
    assert.ok(Math.abs(sampleSupport(w.nest, ant).distance - 0.008) < 0.035);
  }
  assert.ok(ant.y < -0.15, "the body must descend into the shaft");
  assert.ok(
    ant.tunnelCenter.y < -0.2,
    "the route must actually advance below the mouth",
  );
});
