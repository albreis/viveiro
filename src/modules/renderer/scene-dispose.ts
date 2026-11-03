import * as THREE from "three";
import type { Terrarium } from "./scene.ts";
/** Deduplicate shared GPU resources before releasing a scene. */
export function disposeScene(host: Terrarium) {
  host.plugView.dispose();
  host.soilMesher.dispose();
  host.resizeObserver.disconnect();
  host.controls.dispose();
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  host.scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Sprite))
      return;
    if (object instanceof THREE.Mesh) geometries.add(object.geometry);
    for (const material of Array.isArray(object.material)
      ? object.material
      : [object.material]) {
      materials.add(material);
      if ("map" in material && material.map instanceof THREE.Texture)
        textures.add(material.map);
    }
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
  textures.forEach((t) => t.dispose());
  host.renderer.dispose();
  host.renderer.domElement.remove();
}
