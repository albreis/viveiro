import * as THREE from "three";
import type { NestState } from "../navigation/types.ts";
import { grainRadius } from "../granular/types.ts";
export class GranularView {
  private grains: THREE.InstancedMesh;
  private d = new THREE.Object3D();
  constructor(scene: THREE.Scene) {
    this.grains = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xac8b5f, roughness: 1 }),
      512,
    );
    this.grains.count = 0;
    this.grains.frustumCulled = false;
    scene.add(this.grains);
  }
  update(nest: NestState) {
    let count = 0;
    for (const p of nest.rubble || []) {
      if (!p.mobile || p.mass <= 0) continue;
      this.d.position.set(p.x, p.y, p.z);
      this.d.rotation.set(0, p.id * 2.4, 0);
      this.d.scale.setScalar(grainRadius(p));
      this.d.updateMatrix();
      this.grains.setMatrixAt(count++, this.d.matrix);
      if (count >= 512) break;
    }
    this.grains.count = count;
    this.grains.instanceMatrix.needsUpdate = true;
  }
}
