import * as THREE from "three";
import { NEST, LIMIT, hashSeed } from "../simulation/world.js";
import { createSoilGeometry } from "../terrain/soil.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const UP = new THREE.Vector3(0, 1, 0);

export function buildInsects(host, max, spider) {
  const group = spider ? host.predatorGroup : host.antGroup,
    mat = host.material(spider ? "#51483d" : "#553b2c");
  const parts = [],
    counts = spider ? 11 : 9;
  for (let i = 0; i < counts; i++) {
    const geo =
      i < 3
        ? new THREE.SphereGeometry(1, 8, 6)
        : new THREE.CylinderGeometry(0.012, 0.009, 1, 3);
    const m = new THREE.InstancedMesh(geo, mat, max);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.count = 0;
    m.castShadow = true;
    m.frustumCulled = false;
    group.add(m);
    parts.push(m);
  }
  return parts;
}

export function buildQueen(host) {
  const g = new THREE.Group(),
    mat = host.material("#75432a", { roughness: 0.55 });
  const abdomen = host.mesh(
    new THREE.SphereGeometry(1, 12, 8),
    mat,
    g,
    -0.23,
    0.19,
    0,
  );
  abdomen.scale.set(0.31, 0.19, 0.22);
  host.mesh(new THREE.SphereGeometry(0.12, 10, 7), mat, g, 0.07, 0.15, 0);
  const head = host.mesh(
    new THREE.SphereGeometry(0.14, 10, 7),
    mat,
    g,
    0.29,
    0.17,
    0,
  );
  head.scale.x = 1.1;
  for (let side of [-1, 1])
    for (let i = 0; i < 3; i++) {
      const leg = host.mesh(
        new THREE.CylinderGeometry(0.015, 0.01, 0.45, 4),
        mat,
        g,
        (i - 1) * 0.12,
        0.08,
        side * 0.19,
      );
      leg.rotation.x = side * 1.1;
      leg.rotation.z = (i - 1) * 0.6;
    }
  return g;
}

export function buildMale(host) {
  const g = new THREE.Group(),
    mat = host.material("#816341");
  const body = host.mesh(new THREE.SphereGeometry(0.15, 8, 6), mat, g);
  body.scale.set(1.5, 0.6, 0.7);
  for (const side of [-1, 1]) {
    const wing = host.mesh(
      new THREE.SphereGeometry(1, 8, 5),
      host.material("#dbe5cd", { transparent: true, opacity: 0.6 }),
      g,
      0,
      0.1,
      side * 0.16,
    );
    wing.scale.set(0.23, 0.012, 0.13);
    wing.rotation.y = side * 0.7;
  }
  return g;
}

export function updateAnts(host, agents, parts, spider, time) {
  const d = new THREE.Object3D(),
    q = new THREE.Quaternion(),
    axis = new THREE.Vector3(),
    basis = new THREE.Matrix4();
  for (const m of parts)
    m.count = Math.min(agents.length, m.instanceMatrix.count);
  agents.slice(0, parts[0].count).forEach((a, i) => {
    const angle =
      (a.previousAngle ?? a.angle) +
      Math.atan2(
        Math.sin(a.angle - (a.previousAngle ?? a.angle)),
        Math.cos(a.angle - (a.previousAngle ?? a.angle)),
      ) *
        (host.alpha ?? 1);
    const c = Math.cos(angle),
      s = Math.sin(angle),
      scale = spider ? 1.6 : a.bodyScale || 1;
    const base = host.pose(a),
      normal = new THREE.Vector3(
        a.normal?.x || 0,
        a.normal?.y ?? 1,
        a.normal?.z || 0,
      ).normalize();
    const forward = new THREE.Vector3(
      c * Math.cos(a.pitch || 0),
      Math.sin(a.pitch || 0),
      s * Math.cos(a.pitch || 0),
    ).normalize();
    const side = forward.clone().cross(normal).normalize();
    q.setFromRotationMatrix(basis.makeBasis(forward, normal, side));
    for (let p = 0; p < 3; p++) {
      const offset = (p - 1) * 0.12 * scale;
      d.position
        .copy(base)
        .addScaledVector(forward, offset)
        .addScaledVector(
          normal,
          (0.12 +
            (p === 2 && a.state?.startsWith("Escavando")
              ? Math.sin(time * 22 + a.id) * 0.014
              : 0)) *
            scale,
        );
      d.quaternion.copy(q);
      d.scale.set(
        (p === 0 ? 0.12 : p === 1 ? 0.065 : 0.085) * scale,
        0.055 * scale,
        0.06 * scale,
      );
      if (p === 2 && !spider) d.scale.multiplyScalar(a.headScale || 1);
      if (spider && p === 0) d.scale.set(0.18, 0.12, 0.14);
      d.updateMatrix();
      parts[p].setMatrixAt(i, d.matrix);
    }
    const legs = spider ? 8 : 6;
    for (let p = 0; p < legs; p++) {
      const sign = p % 2 ? 1 : -1,
        along = Math.floor(p / 2) - 1;
      const travel =
        (a.previousDistance ?? a.distanceWalked ?? 0) +
        ((a.distanceWalked || 0) -
          (a.previousDistance ?? a.distanceWalked ?? 0)) *
          (host.alpha ?? 1);
      const walk = Math.sin(travel * 25 + a.id + along * 2) * 0.035;
      const start = base
        .clone()
        .addScaledVector(forward, along * 0.07 * scale)
        .addScaledVector(side, sign * 0.045 * scale)
        .addScaledVector(normal, 0.12 * scale);
      const end = base
        .clone()
        .addScaledVector(forward, (along * 0.12 + walk) * scale)
        .addScaledVector(side, sign * 0.16 * scale)
        .addScaledVector(normal, 0.012 * scale);
      axis.copy(end).sub(start);
      const len = axis.length();
      d.quaternion.setFromUnitVectors(UP, axis.normalize());
      d.position.copy(start).add(end).multiplyScalar(0.5);
      d.scale.set(1, len, 1);
      d.updateMatrix();
      parts[p + 3].setMatrixAt(i, d.matrix);
    }
  });
  for (const m of parts) m.instanceMatrix.needsUpdate = true;
}
