import * as THREE from "three";
import {
  renderProfile,
  type PerformanceMode,
  type RenderProfile,
} from "./performance-profile.ts";
import type { SoilMesher } from "../../services/SoilMesher.ts";
interface PerformanceScene {
  performance: Readonly<RenderProfile>;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  soilMesher: SoilMesher;
  soilRevision: number;
  resize(): void;
}
export function applyScenePerformance(
  host: PerformanceScene,
  mode: PerformanceMode,
) {
  host.performance = renderProfile(mode);
  host.renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, host.performance.pixelRatio),
  );
  host.renderer.shadowMap.enabled = host.performance.shadows;
  host.renderer.shadowMap.needsUpdate = true;
  host.scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    for (const material of materials) material.needsUpdate = true;
  });
  host.soilMesher.setDetail(host.performance.soilDetail);
  host.soilRevision = -1;
  host.resize();
}
