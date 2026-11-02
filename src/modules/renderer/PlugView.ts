import * as THREE from "three";
import type { NestState } from "../navigation/types.ts";
/** Analytic annular solids match plugField; drawing the union avoids coarse voxel edges. */
export class PlugView {
  private meshes = new Map<number, { mesh: THREE.Mesh; inner: number }>();
  private material = new THREE.MeshStandardMaterial({
    color: 0x775034,
    roughness: 1,
  });
  private scene: THREE.Scene;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  update(nest: NestState): void {
    const active = new Set<number>();
    for (const p of nest.plugs || []) {
      if (p.mass <= 1e-10) continue;
      active.add(p.id);
      let view = this.meshes.get(p.id);
      if (!view || Math.abs(view.inner - p.innerRadius) > 1e-9) {
        if (view) {
          this.scene.remove(view.mesh);
          view.mesh.geometry.dispose();
        }
        const shape = new THREE.Shape();
        shape.absarc(0, 0, p.radius, 0, Math.PI * 2, false);
        if (p.innerRadius > 1e-9) {
          const hole = new THREE.Path();
          hole.absarc(0, 0, p.innerRadius, 0, Math.PI * 2, true);
          shape.holes.push(hole);
        }
        const mesh = new THREE.Mesh(
          new THREE.ExtrudeGeometry(shape, {
            depth: p.depth,
            bevelEnabled: false,
            curveSegments: 48,
            steps: 1,
          }),
          this.material,
        );
        mesh.position.set(
          p.x - (p.axis.x * p.depth) / 2,
          p.y - (p.axis.y * p.depth) / 2,
          p.z - (p.axis.z * p.depth) / 2,
        );
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(p.axis.x, p.axis.y, p.axis.z),
        );
        this.scene.add(mesh);
        view = { mesh, inner: p.innerRadius };
        this.meshes.set(p.id, view);
      }
    }
    for (const [id, view] of this.meshes)
      if (!active.has(id)) {
        this.scene.remove(view.mesh);
        view.mesh.geometry.dispose();
        this.meshes.delete(id);
      }
  }
  objects(): THREE.Mesh[] {
    return [...this.meshes.values()].map((view) => view.mesh);
  }
  dispose(): void {
    for (const { mesh } of this.meshes.values()) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
    }
    this.meshes.clear();
    this.material.dispose();
  }
}
