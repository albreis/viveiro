import * as THREE from "three";
import type { SoilWorld } from "../soil/types.ts";
export class StructureView {
  private cracks: THREE.InstancedMesh;
  private pose = new THREE.Object3D();
  constructor(scene: THREE.Scene) {
    this.cracks = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.13, 0.004),
      new THREE.MeshBasicMaterial({
        color: 0x614627,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      512,
    );
    this.cracks.count = 0;
    this.cracks.frustumCulled = false;
    scene.add(this.cracks);
  }
  update(w: SoilWorld) {
    let count = 0;
    for (const p of w.soil.structure?.patches || []) {
      if (p.damage < 0.025) continue;
      for (const angle of [-0.65, 0, 0.75]) {
        this.pose.position.set(p.roof.x, p.roof.y - 0.008, p.roof.z);
        this.pose.rotation.set(-Math.PI / 2, 0, angle + p.edge * 1.7);
        this.pose.scale.set(0.4 + p.damage, 0.4 + p.damage * 0.8, 1);
        this.pose.updateMatrix();
        this.cracks.setMatrixAt(count++, this.pose.matrix);
        if (count >= 512) break;
      }
      if (count >= 512) break;
    }
    this.cracks.count = count;
    this.cracks.instanceMatrix.needsUpdate = true;
  }
}
