import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { SceneCore } from "../src/modules/renderer/scene-core.ts";
import {
  followAnt,
  stopFollowing,
  setView,
} from "../src/modules/renderer/camera.ts";
import { disposeScene } from "../src/modules/renderer/scene-dispose.ts";

test("render interpolation preserves the agent and uses the same endpoint arithmetic", () => {
  const ant = {
    id: 7,
    x: 4,
    y: -2,
    z: 6,
    angle: 0,
    previousX: 2,
    previousY: -3,
    previousZ: 2,
  };
  const before = structuredClone(ant);
  assert.deepEqual(
    SceneCore.prototype.pose.call({ alpha: 0.25 }, ant).toArray(),
    [2.5, -2.75, 3],
  );
  assert.deepEqual(
    SceneCore.prototype.pose.call({ alpha: 1 }, ant).toArray(),
    [4, -2, 6],
  );
  assert.deepEqual(ant, before);
});

test("follow and four side cameras restore the overview without changing biological positions", () => {
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 130);
  camera.position.set(22, 23, 27);
  const ant = { id: 7, x: 1, y: -2, z: 3, angle: 0 };
  const materials = [0, 1, 2].map(() => new THREE.MeshStandardMaterial());
  const host = {
    camera,
    world: { ants: [ant], nest: { nodes: [] } },
    followId: null,
    controls: {
      target: new THREE.Vector3(0, -0.2, 0),
      update() {},
      enabled: true,
    },
    soil: { material: materials },
    followLight: { intensity: 1 },
    setTool() {},
    stopFollowing() {
      stopFollowing(this);
    },
  };
  const before = structuredClone(ant);
  assert.equal(followAnt(host, 7), true);
  assert.equal(camera.near, 0.012);
  stopFollowing(host);
  assert.deepEqual(camera.position.toArray(), [22, 23, 27]);
  const faces = [];
  for (let i = 0; i < 4; i++) {
    setView(host, "side");
    faces.push(camera.position.toArray());
  }
  assert.equal(new Set(faces.map(JSON.stringify)).size, 4);
  assert.deepEqual(ant, before);
  materials.forEach((m) => m.dispose());
});

test("scene disposal releases shared sprite/mesh assets once", () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.SphereGeometry(1);
  const texture = new THREE.Texture();
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  scene.add(
    new THREE.Mesh(geometry, material),
    new THREE.Mesh(geometry, material),
    new THREE.Sprite(spriteMaterial),
  );
  const counts = { geometry: 0, material: 0, sprite: 0, texture: 0 };
  geometry.addEventListener("dispose", () => counts.geometry++);
  material.addEventListener("dispose", () => counts.material++);
  spriteMaterial.addEventListener("dispose", () => counts.sprite++);
  texture.addEventListener("dispose", () => counts.texture++);
  const calls = [];
  disposeScene({
    scene,
    plugView: { dispose() {} },
    soilMesher: { dispose() {} },
    resizeObserver: { disconnect() {} },
    controls: { dispose() {} },
    renderer: {
      dispose() {
        calls.push("renderer");
      },
      domElement: {
        remove() {
          calls.push("canvas");
        },
      },
    },
  });
  assert.deepEqual(counts, { geometry: 1, material: 1, sprite: 1, texture: 1 });
  assert.deepEqual(calls, ["renderer", "canvas"]);
});
