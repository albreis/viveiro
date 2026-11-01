import * as THREE from "three";
import type { FamilyWorld } from "../colonies/types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import { surfaceHeight } from "../landscape/queries.ts";
export class EcologyView {
  private aphids: THREE.InstancedMesh;
  private drops: THREE.InstancedMesh;
  private larvae: THREE.InstancedMesh;
  private d = new THREE.Object3D();
  private color = new THREE.Color();
  constructor(scene: THREE.Scene) {
    this.aphids = this.mesh(scene, 0x79964c, 64);
    this.drops = this.mesh(scene, 0xd2ab52, 8);
    this.larvae = this.mesh(scene, 0xb5c596, 24);
  }
  private mesh(scene: THREE.Scene, color: number, capacity: number) {
    const m = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 9, 6),
      new THREE.MeshStandardMaterial({ color, roughness: 0.7 }),
      capacity,
    );
    m.count = 0;
    m.frustumCulled = false;
    scene.add(m);
    return m;
  }
  update(
    w: FamilyWorld,
    pose: (a: ColonyAgent) => THREE.Vector3,
    follow: number | null,
  ) {
    const e = w.ecology;
    let aphids = 0,
      drops = 0,
      larvae = 0;
    for (const a of e?.aphids || []) {
      const p = w.plants.find((p) => p.id === a.plant);
      if (!p || a.count < 1) continue;
      const y = surfaceHeight(w.nest.relief, p.x, p.z);
      for (let i = 0; i < Math.min(8, Math.ceil(a.count / 3)); i++) {
        const angle = i * 2.4 + a.id;
        this.d.position.set(
          p.x + Math.cos(angle) * 0.15,
          y + 0.06 + (i % 2) * 0.05,
          p.z + Math.sin(angle) * 0.15,
        );
        this.d.rotation.set(0, angle, 0);
        this.d.scale.set(0.035, 0.045, 0.06);
        this.d.updateMatrix();
        this.aphids.setMatrixAt(aphids++, this.d.matrix);
      }
      if (a.honey > 0.008 && drops < 8) {
        const size = 0.035 + Math.sqrt(a.honey) * 0.1;
        this.d.position.set(p.x + 0.27, y + 0.035, p.z);
        this.d.scale.set(size, 0.025, size);
        this.d.rotation.set(0, 0, 0);
        this.d.updateMatrix();
        this.drops.setMatrixAt(drops++, this.d.matrix);
      }
    }
    for (const m of e?.mimics || []) {
      if (m.status === "dead" || m.carrier === follow) continue;
      const carrier = w.ants.find((a) => a.id === m.carrier),
        angle = carrier?.angle || m.id * 2.4,
        position = carrier ? pose(carrier) : new THREE.Vector3(m.x, m.y, m.z);
      const normal = new THREE.Vector3(
        carrier?.normal?.x ?? m.normal?.x ?? 0,
        carrier?.normal?.y ?? m.normal?.y ?? 1,
        carrier?.normal?.z ?? m.normal?.z ?? 0,
      ).normalize();
      if (carrier)
        position
          .addScaledVector(normal, 0.14)
          .add(
            new THREE.Vector3(
              Math.cos(angle) * 0.25,
              Math.sin(carrier.pitch || 0) * 0.25,
              Math.sin(angle) * 0.25,
            ),
          );
      else position.addScaledVector(normal, 0.045);
      this.color.set(m.status === "adopted" ? 0xd8c78e : 0xa8bc85);
      for (let i = 0; i < 5; i++) {
        const offset = (i - 2) * 0.045;
        this.d.position
          .copy(position)
          .add(
            new THREE.Vector3(
              Math.cos(angle) * offset,
              0,
              Math.sin(angle) * offset,
            ),
          );
        this.d.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          normal,
        );
        this.d.scale.set(0.042, 0.035, 0.042);
        this.d.updateMatrix();
        this.larvae.setMatrixAt(larvae, this.d.matrix);
        this.larvae.setColorAt(larvae++, this.color);
      }
    }
    for (const [mesh, count] of [
      [this.aphids, aphids],
      [this.drops, drops],
      [this.larvae, larvae],
    ] as const) {
      mesh.count = count;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }
}
