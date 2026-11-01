import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { sealFixture } from "./fixtures/seal.mjs";
import {
  reclaimSpoil,
  fillPlug,
  removePlug,
} from "../src/modules/sealing/material.ts";
import { plugField } from "../src/modules/sealing/field.ts";
import { PlugView } from "../src/modules/renderer/PlugView.ts";
test("analytic rendering and physical plug agree on the closed face, a partially excavated opening and complete removal", () => {
  const { w, q, p } = sealFixture(),
    scene = new THREE.Scene(),
    view = new PlugView(scene);
  reclaimSpoil(w, q, p.capacity);
  fillPlug(w, q, p, 1);
  view.update(w.nest);
  scene.updateMatrixWorld(true);
  const axis = new THREE.Vector3(p.axis.x, p.axis.y, p.axis.z),
    center = new THREE.Vector3(p.x, p.y, p.z),
    origin = center.clone().addScaledVector(axis, 0.6);
  const ray = new THREE.Raycaster(origin, axis.clone().negate());
  const hits = ray.intersectObjects(scene.children);
  assert.ok(hits.length);
  assert.ok(Math.abs(hits[0].distance - (0.6 - p.depth / 2)) < 1e-7);
  assert.ok(Math.abs(plugField(p, hits[0].point).distance) < 1e-7);
  removePlug(w, q, p, p.capacity / 2);
  view.update(w.nest);
  scene.updateMatrixWorld(true);
  assert.equal(ray.intersectObjects(scene.children).length, 0);
  const tangent = new THREE.Vector3(0, 0, 1),
    offset = p.innerRadius + (p.radius - p.innerRadius) * 0.5;
  ray.set(
    origin.clone().addScaledVector(tangent, offset),
    axis.clone().negate(),
  );
  const ring = ray.intersectObjects(scene.children);
  assert.ok(ring.length);
  assert.ok(Math.abs(plugField(p, ring[0].point).distance) < 1e-7);
  removePlug(w, q, p, 1);
  view.update(w.nest);
  assert.equal(scene.children.length, 0);
  view.dispose();
});
