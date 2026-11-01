import * as THREE from "three";
import { NEST, LIMIT, hashSeed } from "../simulation/world.js";
import { createSoilGeometry } from "../terrain/soil.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const UP = new THREE.Vector3(0, 1, 0);

export function pickAnt(host, e) {
  host.groundPoint(e);
  const hits = host.raycaster.intersectObjects(
    [
      ...host.antParts,
      ...host.foundersView.objects(),
      ...(host.showInterior ? [] : [host.soil]),
    ],
    true,
  );
  if (hits.length) {
    const hit = hits[0];
    if (host.antParts.includes(hit.object))
      return host.visibleWorkers[hit.instanceId]?.id;
    const founder = host.foundersView.pickId(hit.object);
    if (founder) return founder;
  }
  // A modest screen-space tolerance keeps tiny ants selectable without selecting through soil.
  const rect = host.element.getBoundingClientRect();
  let nearest = null,
    best = 12;
  for (const ant of host.world.ants) {
    const v = new THREE.Vector3(ant.x, (ant.y || 0) + 0.13, ant.z).project(
      host.camera,
    );
    if (v.z < 0 || v.z > 1) continue;
    const px = rect.left + ((v.x + 1) / 2) * rect.width,
      py = rect.top + ((1 - v.y) / 2) * rect.height,
      d = Math.hypot(e.clientX - px, e.clientY - py);
    if (d < best) {
      nearest = ant;
      best = d;
    }
  }
  if (!nearest) return null;
  const point = new THREE.Vector3(
      nearest.x,
      (nearest.y || 0) + 0.13,
      nearest.z,
    ),
    delta = point.clone().sub(host.camera.position),
    length = delta.length();
  host.raycaster.set(host.camera.position, delta.normalize());
  const soil = host.showInterior
    ? []
    : host.raycaster.intersectObject(host.soil);
  return soil[0] && soil[0].distance < length - 0.15 ? null : nearest.id;
}

export function groundPoint(host, e) {
  const r = host.element.getBoundingClientRect();
  host.pointer.set(
    ((e.clientX - r.left) / r.width) * 2 - 1,
    (-(e.clientY - r.top) / r.height) * 2 + 1,
  );
  host.raycaster.setFromCamera(host.pointer, host.camera);
  const v = new THREE.Vector3();
  if (
    !host.raycaster.ray.intersectPlane(host.plane, v) ||
    Math.abs(v.x) > 9.3 ||
    Math.abs(v.z) > 5.8
  )
    return null;
  return v;
}
