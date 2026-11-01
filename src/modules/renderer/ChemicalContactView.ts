import * as THREE from "three";
import type { ColonyAgent } from "../colony/types.ts";
export class ChemicalContactView {
  private rings: THREE.InstancedMesh;
  private d = new THREE.Object3D();
  constructor(scene: THREE.Scene, capacity: number) {
    const geo = new THREE.TorusGeometry(0.24, 0.012, 5, 24);
    geo.rotateX(-Math.PI / 2);
    this.rings = new THREE.InstancedMesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
      capacity,
    );
    this.rings.count = 0;
    this.rings.frustumCulled = false;
    scene.add(this.rings);
  }
  update(
    ants: ColonyAgent[],
    tick: number,
    pose: (a: ColonyAgent) => THREE.Vector3,
    follow: number | null,
  ) {
    let count = 0;
    const color = new THREE.Color(),
      up = new THREE.Vector3(0, 1, 0);
    for (const a of ants) {
      if (
        a.id === follow ||
        (!(a.odorMask?.strength! > 0.3) && !(a.encounter?.until! >= tick))
      )
        continue;
      const n = new THREE.Vector3(
        a.normal?.x || 0,
        a.normal?.y ?? 1,
        a.normal?.z || 0,
      ).normalize();
      this.d.position.copy(pose(a)).addScaledVector(n, 0.025);
      this.d.quaternion.setFromUnitVectors(up, n);
      this.d.scale.setScalar(a.bodyScale || 1);
      this.d.updateMatrix();
      this.rings.setMatrixAt(count, this.d.matrix);
      color.set(a.encounter?.until! >= tick ? "#c7644c" : "#d4a447");
      this.rings.setColorAt(count++, color);
      if (count >= this.rings.instanceMatrix.count) break;
    }
    this.rings.count = count;
    this.rings.instanceMatrix.needsUpdate = true;
    if (this.rings.instanceColor) this.rings.instanceColor.needsUpdate = true;
  }
}
