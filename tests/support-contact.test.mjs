import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "../src/modules/simulation/world.js";
import { sampleSupport } from "../src/modules/terrain/field.ts";

const nearestSupport = (nest, point) =>
  Math.abs(sampleSupport(nest, point).distance - 0.008);

test("workers keep bounded movement and reachable terrain support through tunnel transitions", () => {
  const w = new World("support-regression"),
    previous = new Map();
  let maxJump = 0,
    maxGap = 0,
    checked = 0;
  for (let tick = 0; tick < 650; tick++) {
    w.step();
    for (const ant of w.workers) {
      const old = previous.get(ant.id);
      if (old) {
        const displacement = Math.hypot(
          ant.x - old.x,
          ant.y - old.y,
          ant.z - old.z,
        );
        maxJump = Math.max(maxJump, displacement);
        assert.ok(
          displacement <= ant.speed * 1.2 + 0.002,
          "unbounded step for ant " + ant.id,
        );
      }
      if (tick % 5 === 0) {
        const gap = nearestSupport(w.nest, ant);
        maxGap = Math.max(maxGap, gap);
        checked++;
        assert.ok(
          gap <= 0.035,
          "unsupported ant " +
            ant.id +
            " gap " +
            gap.toFixed(3) +
            " in " +
            ant.state,
        );
      }
      previous.set(ant.id, { x: ant.x, y: ant.y, z: ant.z });
    }
  }
  console.log(JSON.stringify({ checked, maxJump, maxGap }));
});
