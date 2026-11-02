import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { DiscardedWingsView } from "../src/modules/renderer/discarded-wings.ts";
import { createSoilGeometry } from "../src/modules/terrain/soil.js";

function setup(geometry = new THREE.PlaneGeometry(4, 4)) {
  const scene = new THREE.Scene();
  const ground = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
  );
  const view = new DiscardedWingsView(scene);
  const wing = () => scene.children[0];
  return {
    scene,
    ground,
    view,
    wing,
    close() {
      view.dispose();
      ground.geometry.dispose();
      ground.material.dispose();
    },
  };
}
test("discarded wings use the drawn slope instead of the saved founder altitude", () => {
  const f = setup();
  f.ground.rotation.x = -Math.PI / 2 + 0.2;
  f.ground.position.y = 0.35;
  const points = [{ x: 0, y: 1.7, z: 0 }];
  const before = structuredClone(points);
  try {
    f.view.update(points, [f.ground]);
    const mesh = f.wing();
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(
      f.ground.quaternion,
    );
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(mesh.quaternion);
    assert.ok(mesh.visible);
    assert.ok(up.distanceTo(normal) < 1e-9);
    assert.ok(
      Math.abs(mesh.position.y - 0.35 - normal.y * (mesh.scale.y + 0.0005)) <
        1e-7,
    );
    assert.deepEqual(points, before, "rendering cannot change saved positions");
    const pose = mesh.position.clone();
    f.view.update(points, [f.ground]);
    assert.deepEqual(mesh.position, pose, "no time-dependent shaking");
  } finally {
    f.close();
  }
});
for (const detail of ["full", "light"]) {
  test(`[${detail}] excavation under a wing removes its old support and places it on the real cavity floor`, () => {
    const nest = { nodes: [], links: [], revision: 0 };
    const f = setup(createSoilGeometry(nest, detail));
    const points = [{ x: 0.108333, y: 0.5, z: 0.107813 }];
    try {
      f.view.update(points, [f.ground]);
      assert.ok(Math.abs(f.wing().position.y - 0.0061) < 0.003);
      nest.nodes.push({ ...points[0], y: 0, r: 0.38, type: "entrance" });
      f.ground.geometry.dispose();
      f.ground.geometry = createSoilGeometry(nest, detail);
      f.view.update(points, [f.ground]);
      assert.ok(f.wing().visible);
      assert.ok(
        f.wing().position.y < -0.36,
        "old airborne height must not survive remeshing",
      );
      assert.ok(f.wing().position.y > -0.39);
      assert.equal(points[0].y, 0.5);
    } finally {
      f.close();
    }
  });
}
test("a plug provides support, and removing it exposes the floor without stale mesh caching", () => {
  const f = setup();
  f.ground.rotation.x = -Math.PI / 2;
  f.ground.position.y = -0.8;
  const plug = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 1),
    f.ground.material,
  );
  const points = [{ x: 0, y: 3, z: 0 }];
  try {
    f.view.update(points, [f.ground, plug]);
    assert.ok(Math.abs(f.wing().position.y - 0.0561) < 1e-6);
    f.view.update(points, [f.ground]);
    assert.ok(Math.abs(f.wing().position.y + 0.7939) < 1e-6);
    f.ground.position.y = -0.4;
    f.view.update(points, [f.ground]);
    assert.ok(Math.abs(f.wing().position.y + 0.3939) < 1e-6);
    f.view.update(points, []);
    assert.equal(
      f.wing().visible,
      false,
      "no support means no invented floating plane",
    );
    f.view.update(points, [f.ground]);
    assert.equal(f.wing().visible, true);
    f.view.update([], [f.ground]);
    assert.equal(f.wing().visible, false);
  } finally {
    plug.geometry.dispose();
    f.close();
  }
});
