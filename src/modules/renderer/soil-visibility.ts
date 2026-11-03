import type { Terrarium } from "./scene.ts";
export function updateSoilVisibility(host: Terrarium) {
  const interior = host.showInterior && !host.followId;
  host.soil.material.forEach((mat, index) => {
    const transparent = !!interior && index !== 2,
      changed = mat.transparent !== transparent;
    mat.transparent = transparent;
    mat.opacity = transparent ? 0.06 : 1;
    mat.depthWrite = !transparent;
    if (changed) mat.needsUpdate = true;
  });
}
