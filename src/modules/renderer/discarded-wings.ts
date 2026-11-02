import * as THREE from "three";
import type { Vec3 } from "../navigation/types.ts";
import { wingMesh } from "./founder-pose.ts";

interface WingView {
  mesh: THREE.Mesh;
  key: string;
  grounded: boolean;
}
const UP = new THREE.Vector3(0, 1, 0);
const DOWN = new THREE.Vector3(0, -1, 0);

/** Decorative remains rest on the drawn solids, never on a stale saved height. */
export class DiscardedWingsView {
  private views: WingView[] = [];
  private ray = new THREE.Raycaster(new THREE.Vector3(), DOWN, 0, 16);
  private normalMatrix = new THREE.Matrix3();
  private scene: THREE.Scene;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  update(points: readonly Vec3[], supports: THREE.Mesh[]): void {
    // Recast only when a solid/transform or a discarded position changes.
    // Mesh replacement follows the soil Worker, so support matches what is drawn.
    const geometryKey = supports
      .map((mesh) => {
        mesh.updateWorldMatrix(true, false);
        const g = mesh.geometry;
        const position = g.getAttribute("position");
        const version =
          position instanceof THREE.InterleavedBufferAttribute
            ? position.data.version
            : position?.version;
        return [
          g.uuid,
          version,
          g.index?.version,
          ...mesh.matrixWorld.elements,
        ].join(",");
      })
      .join("|");
    points.forEach((point, index) => {
      let view = this.views[index];
      if (!view) {
        const mesh = wingMesh();
        mesh.scale.multiplyScalar(0.7);
        this.scene.add(mesh);
        view = { mesh, key: "", grounded: false };
        this.views.push(view);
      }
      const key = [geometryKey, point.x, point.y, point.z].join(":");
      if (view.key !== key) {
        view.key = key;
        view.grounded = this.place(view.mesh, point, index, supports);
      }
      view.mesh.visible = view.grounded;
    });
    for (let i = points.length; i < this.views.length; i++)
      this.views[i].mesh.visible = false;
  }

  private place(
    mesh: THREE.Mesh,
    point: Vec3,
    index: number,
    supports: THREE.Mesh[],
  ): boolean {
    this.ray.set(new THREE.Vector3(point.x, 8, point.z), DOWN);
    const hit = this.ray.intersectObjects(supports, false)[0];
    if (!hit?.face) return false;
    const normal = hit.face.normal
      .clone()
      .applyMatrix3(this.normalMatrix.getNormalMatrix(hit.object.matrixWorld))
      .normalize();
    if (normal.y < 0) normal.negate();
    mesh.position
      .copy(hit.point)
      .addScaledVector(normal, mesh.scale.y + 0.0005);
    mesh.quaternion.setFromUnitVectors(UP, normal);
    mesh.rotateY(index * 1.2);
    return true;
  }

  dispose(): void {
    for (const { mesh } of this.views) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
    this.views = [];
  }
}
