import * as THREE from "three";
import type { ColonyAgent } from "../colony/types.ts";
export function wingMesh() {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 12, 6),
    new THREE.MeshStandardMaterial({
      color: 0xe9e6d3,
      transparent: true,
      opacity: 0.58,
      roughness: 0.4,
      depthWrite: false,
    }),
  );
  mesh.scale.set(0.38, 0.008, 0.15);
  return mesh;
}
export function queenWings() {
  const group = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const m = wingMesh(),
      side = i % 2 ? 1 : -1;
    m.position.set(i < 2 ? -0.12 : 0.05, 0.24, side * 0.2);
    m.rotation.y = side * (i < 2 ? 0.5 : 0.9);
    group.add(m);
  }
  return group;
}
export function poseFounder(
  view: THREE.Group,
  a: ColonyAgent,
  position: THREE.Vector3,
) {
  const n = new THREE.Vector3(
      a.normal?.x || 0,
      a.normal?.y ?? 1,
      a.normal?.z || 0,
    ).normalize(),
    p = a.pitch || 0;
  const forward = new THREE.Vector3(
      Math.cos(a.angle) * Math.cos(p),
      Math.sin(p),
      Math.sin(a.angle) * Math.cos(p),
    ),
    side = forward.clone().cross(n).normalize();
  forward.copy(n).cross(side).normalize();
  view.quaternion.setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(forward, n, side),
  );
  view.position.copy(position).addScaledVector(n, 0.015);
  view.scale.setScalar(a.bodyScale || 1);
}
