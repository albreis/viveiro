import { test } from "node:test";
import assert from "node:assert/strict";
import { World } from "./fixtures/established-world.mjs";
import { createSoilGeometry } from "../src/modules/terrain/soil.js";
import { sampleSoil } from "../src/modules/terrain/field.ts";

test("rounded mesh vertices follow the same continuous field as support queries", () => {
  const nest = new World("mesh-procedural").nest,
    geometry = createSoilGeometry(nest);
  const positions = geometry.attributes.position,
    normals = geometry.attributes.normal;
  let maximumError = 0,
    curved = 0;
  assert.ok(positions.count > 1000);
  for (let i = 0; i < positions.count; i += 197) {
    const point = {
      x: positions.getX(i),
      y: positions.getY(i),
      z: positions.getZ(i),
    };
    maximumError = Math.max(
      maximumError,
      Math.abs(sampleSoil(nest, point).distance),
    );
    if (Math.abs(normals.getX(i)) > 0.15 && Math.abs(normals.getY(i)) > 0.15)
      curved++;
  }
  assert.ok(curved > 5);
  console.log(
    JSON.stringify({ vertices: positions.count, maximumError, curved }),
  );
  assert.ok(maximumError < 0.005, "mesh/field mismatch " + maximumError);
  geometry.dispose();
});
