import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { World as NewWorld } from "../src/modules/simulation/world.js";
import { surfaceHeight } from "../src/modules/landscape/queries.ts";
import { projectSupport } from "../src/modules/terrain/surface-queries.ts";
test("a body already beyond the lip completes its exit even if the abstract center lags behind", () => {
  const w = new World("arrival-body"),
    mouth = w.nest.nodes[0];
  let support;
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI) / 12,
      x = mouth.x + Math.cos(angle) * (mouth.r + 0.24),
      z = mouth.z + Math.sin(angle) * (mouth.r + 0.24);
    const s = projectSupport(w.nest, {
      x,
      y: surfaceHeight(w.nest.relief, x, z) + 0.008,
      z,
    });
    if (
      s.normal.y > 0.85 &&
      Math.hypot(s.point.x - mouth.x, s.point.z - mouth.z) > mouth.r + 0.08
    ) {
      support = s;
      break;
    }
  }
  assert.ok(support);
  const a = w.makeAnt("worker", support.point.x, support.point.z);
  Object.assign(a, support.point, {
    normal: support.normal,
    node: 1,
    route: [0],
    tunnelCenter: { x: mouth.x, y: mouth.y - 0.16, z: mouth.z },
  });
  w.ants = [a];
  const before = { x: a.x, y: a.y, z: a.z };
  w.moveInNest(a);
  assert.equal(a.node, null);
  assert.ok(Math.hypot(a.x - before.x, a.y - before.y, a.z - before.z) < 0.001);
});
test("a save from 0.6 mid-excavation infers its existing entry IDs and resumes instead of digging a duplicate", () => {
  const w = new NewWorld("entry-migration", { humidity: 68 });
  w.step(600);
  const s = w.snapshot();
  delete s.founding.entry;
  delete s.founding.front;
  const restored = NewWorld.restore(s);
  assert.equal(restored.founding.entry, 0);
  assert.equal(restored.founding.front, 1);
  w.step(100);
  restored.step(100);
  assert.deepEqual(restored.snapshot(), w.snapshot());
});
