import * as THREE from "three";
import type { ColonyWorld } from "../colony/types.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import { colonyWorlds } from "../colonies/types.ts";
import { sampleClimate } from "../microclimate/grid.ts";
/** One visual marker per coarse food batch; not a grain or body-physics solver. */
export class FoodStoresView {
  private mesh: THREE.InstancedMesh;
  private dummy = new THREE.Object3D();
  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 7, 5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }),
      4096,
    );
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.mesh);
  }
  update(w: ColonyWorld): void {
    const batches = colonyWorlds(w as FamilyWorld)
        .flatMap((c) => c.colony.stores?.bins ?? [])
        .filter((b) => b.amount > 1e-6)
        .slice(0, this.mesh.instanceMatrix.count),
      d = this.dummy;
    batches.forEach((b, i) => {
      const size = Math.min(0.26, 0.05 + Math.cbrt(b.amount) * 0.065),
        water = sampleClimate(w.microclimate, b.point)?.water ?? 0.55;
      d.position.set(b.point.x, b.point.y + size * 0.4, b.point.z);
      d.rotation.set(0, b.node * 1.7, 0);
      d.scale.set(size, size * 0.35, size * 0.8);
      d.updateMatrix();
      this.mesh.setMatrixAt(i, d.matrix);
      this.mesh.setColorAt(
        i,
        new THREE.Color(water > 0.65 ? 0x8c7754 : 0xd3b86d),
      );
    });
    this.mesh.count = batches.length;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}
