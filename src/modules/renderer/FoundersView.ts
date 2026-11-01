import * as THREE from "three";
import type { ColonyAgent } from "../colony/types.ts";
import type { FoundingState } from "../founding/types.ts";
function wingMesh() {
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
export class FoundersView {
  private wings = new THREE.Group();
  private discarded: THREE.Mesh[] = [];
  private legs: { mesh: THREE.Object3D; x: number; z: number }[] = [];
  constructor(
    private scene: THREE.Scene,
    private queen: THREE.Group,
    private male: THREE.Group,
  ) {
    this.legs = queen.children
      .filter(
        (m) =>
          m instanceof THREE.Mesh && m.geometry.type === "CylinderGeometry",
      )
      .map((mesh) => ({ mesh, x: mesh.rotation.x, z: mesh.rotation.z }));
    for (let i = 0; i < 4; i++) {
      const wing = wingMesh(),
        side = i % 2 ? 1 : -1;
      wing.position.set(i < 2 ? -0.12 : 0.05, 0.24, side * 0.2);
      wing.rotation.y = side * (i < 2 ? 0.5 : 0.9);
      this.wings.add(wing);
    }
    queen.add(this.wings);
  }
  private pose(view: THREE.Group, ant: ColonyAgent, position: THREE.Vector3) {
    const normal = new THREE.Vector3(
        ant.normal?.x || 0,
        ant.normal?.y ?? 1,
        ant.normal?.z || 0,
      ).normalize(),
      pitch = ant.pitch || 0;
    const forward = new THREE.Vector3(
      Math.cos(ant.angle) * Math.cos(pitch),
      Math.sin(pitch),
      Math.sin(ant.angle) * Math.cos(pitch),
    );
    const side = forward.clone().cross(normal).normalize();
    forward.copy(normal).cross(side).normalize();
    view.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(forward, normal, side),
    );
    view.position.copy(position).addScaledVector(normal, 0.015);
    view.scale.setScalar(ant.bodyScale || 1);
  }
  update(
    ants: ColonyAgent[],
    founding: FoundingState | undefined,
    pose: (a: ColonyAgent) => THREE.Vector3,
    follow: number | null,
    time: number,
  ) {
    const queen = ants.find((a) => a.kind === "queen"),
      male = ants.find((a) => a.kind === "male");
    this.queen.visible = !!queen && queen.id !== follow;
    this.male.visible = !!male && male.id !== follow;
    if (queen) {
      this.pose(this.queen, queen, pose(queen));
      this.wings.visible = !!queen.winged;
      this.legs.forEach((leg, i) => {
        const swing = queen.airborne
          ? 0
          : Math.sin((queen.distanceWalked || 0) * 22 + (i * Math.PI) / 2) *
            0.22;
        leg.mesh.rotation.x = leg.x + swing;
        leg.mesh.rotation.z = leg.z + swing * 0.4;
      });
      this.wings.children.forEach((w, i) => {
        w.rotation.x = queen.airborne
          ? Math.sin(time * 42 + (i % 2) * Math.PI) * 0.35
          : 0;
      });
    }
    if (male) this.pose(this.male, male, pose(male));
    const wings = founding?.discardedWings || [];
    wings.forEach((p, i) => {
      let mesh = this.discarded[i];
      if (!mesh) {
        mesh = wingMesh();
        mesh.scale.multiplyScalar(0.7);
        mesh.rotation.y = i * 1.2;
        this.scene.add(mesh);
        this.discarded.push(mesh);
      }
      mesh.position.set(p.x, p.y, p.z);
    });
    this.discarded.forEach((m, i) => (m.visible = i < wings.length));
  }
}
