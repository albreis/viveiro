import { meshAxes } from "../src/modules/terrain/mesh-axes.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createSoilGeometry } from "../src/modules/terrain/soil.js";
import { sampleSoil } from "../src/modules/terrain/field.ts";
const make = (nodes, detail) => {
  const nest = { nodes, links: [], linkWidths: [], revision: 0 },
    geometry = createSoilGeometry(nest, detail),
    material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
    mesh = new THREE.Mesh(geometry, material);
  mesh.updateMatrixWorld();
  return {
    nest,
    mesh,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
};
const hit = (mesh, origin, direction) =>
  new THREE.Raycaster(
    new THREE.Vector3(...origin),
    new THREE.Vector3(...direction),
  ).intersectObject(mesh)[0]?.point;
const entry = (x, z, r = 0.22) => ({ x, y: 0, z, r, type: "entrance" });
for (const detail of ["full", "light"]) {
  test(
    "[" +
      detail +
      "] a small mouth between old grid columns is an actual opening rather than a false soil cap",
    () => {
      const n = entry(0.108333, 0.107813, 0.12),
        f = make([n], detail);
      try {
        const p = hit(f.mesh, [n.x, 1, n.z], [0, -1, 0]);
        assert.ok(p && p.y < -0.1, "expected cavity floor, got " + p?.y);
        assert.ok(Math.abs(sampleSoil(f.nest, p).distance) < 0.005);
        const ground = hit(f.mesh, [1, 1, 1], [0, -1, 0]);
        assert.ok(Math.abs(ground.y) < 0.002);
      } finally {
        f.dispose();
      }
    },
  );
  test(
    "[" +
      detail +
      "] openings reaching each of the four glass sides remain open from above and from that side",
    () => {
      const nodes = [
          entry(9.94, 2.19),
          entry(-9.94, -2.19),
          entry(2.19, 6.44),
          entry(-2.19, -6.44),
        ],
        f = make(nodes, detail);
      try {
        for (const n of nodes) {
          const floor = hit(f.mesh, [n.x, 1, n.z], [0, -1, 0]);
          assert.ok(floor && floor.y < -0.19, JSON.stringify({ n, floor }));
          const onX = Math.abs(n.x) > 9,
            sign = Math.sign(onX ? n.x : n.z),
            origin = onX ? [11 * sign, -0.05, n.z] : [n.x, -0.05, 7.5 * sign],
            direction = onX ? [-sign, 0, 0] : [0, 0, -sign],
            p = hit(f.mesh, origin, direction);
          assert.ok(p);
          assert.ok(
            (onX ? Math.abs(p.x) : Math.abs(p.z)) < (onX ? 9.85 : 6.35),
            JSON.stringify({ n, p }),
          );
          assert.ok(Math.abs(sampleSoil(f.nest, p).distance) < 0.005);
        }
      } finally {
        f.dispose();
      }
    },
  );

  test(
    "[" +
      detail +
      "] detail sampling stays bounded for the current maximum of 48 nest nodes",
    () => {
      const nodes = Array.from({ length: 48 }, (_, i) =>
          entry(
            -9.7 + (19.4 * i) / 47,
            -6.2 + (12.4 * ((i * 17) % 48)) / 47,
            0.08 + i * 0.003,
          ),
        ),
        nest = { nodes, links: [], revision: 0 },
        before = structuredClone(nest),
        a = meshAxes(nest, detail);
      assert.ok(a.x.length * a.y.length * a.z.length < 2e6);
      assert.deepEqual(nest, before);
    },
  );
}
