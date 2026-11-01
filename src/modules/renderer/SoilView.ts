import * as THREE from "three";
import type { SoilAgent, SoilState } from "../soil/types.ts";

export class SoilView {
  private carried: THREE.InstancedMesh;
  private heaps: THREE.InstancedMesh;
  private dummy = new THREE.Object3D();
  constructor(scene: THREE.Scene, capacity: number) {
    this.carried = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x9d7148, roughness: 1 }),
      capacity,
    );
    this.heaps = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(1, 1),
      new THREE.MeshStandardMaterial({ color: 0xa18b60, roughness: 1 }),
      64,
    );
    for (const mesh of [this.carried, this.heaps]) {
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(mesh);
    }
  }
  update(
    world: { ants: SoilAgent[]; soil?: SoilState },
    pose: (a: SoilAgent) => THREE.Vector3,
    followId: number | null,
  ) {
    const d = this.dummy;
    let count = 0;
    for (const ant of world.ants) {
      if (!(ant.carryingSoil! > 0) || ant.id === followId) continue;
      const normal = new THREE.Vector3(
        ant.normal?.x || 0,
        ant.normal?.y ?? 1,
        ant.normal?.z || 0,
      );
      const forward = new THREE.Vector3(
        Math.cos(ant.angle) * Math.cos(ant.pitch || 0),
        Math.sin(ant.pitch || 0),
        Math.sin(ant.angle) * Math.cos(ant.pitch || 0),
      );
      d.position
        .copy(pose(ant))
        .addScaledVector(normal, 0.13)
        .addScaledVector(forward, 0.23);
      d.rotation.set(0, ant.id, 0);
      d.scale.setScalar(
        Math.min(0.075, 0.025 + Math.cbrt(ant.carryingSoil!) * 0.1),
      );
      d.updateMatrix();
      this.carried.setMatrixAt(count++, d.matrix);
      if (count === this.carried.instanceMatrix.count) break;
    }
    this.carried.count = count;
    this.carried.instanceMatrix.needsUpdate = true;
    const piles = (world.soil?.deposits || []).slice(0, 64);
    piles.forEach((p, i) => {
      const radius = Math.min(0.32, 0.06 + Math.cbrt(p.mass) * 0.2);
      d.position.set(p.x, p.y + radius * 0.2, p.z);
      d.rotation.set(0, p.id, 0);
      d.scale.set(radius, radius * 0.45, radius);
      d.updateMatrix();
      this.heaps.setMatrixAt(i, d.matrix);
    });
    this.heaps.count = piles.length;
    this.heaps.instanceMatrix.needsUpdate = true;
  }
}
