import { locale, t } from "../../i18n/runtime.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import type { PerspectiveCamera, PointLight } from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
interface Host {
  world: FamilyWorld;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  followLight: PointLight;
  currentView: unknown;
  stopFollowing(): void;
  setInterior(value: boolean): void;
}
export function focusSealing(h: Host): string {
  const p = [...(h.world.nest.plugs || [])].sort((a, b) => b.mass - a.mass)[0];
  if (!p) return t("scene.seal.empty");
  h.stopFollowing();
  h.setInterior(true);
  h.currentView = "sealing";
  h.controls.minDistance = 0.12;
  h.controls.maxPolarAngle = Math.PI * 0.98;
  h.camera.position.set(
    p.x + p.axis.x * 0.95,
    p.y + p.axis.y * 0.95,
    p.z + p.axis.z * 0.95,
  );
  h.controls.target.set(p.x, p.y, p.z);
  h.followLight.position.copy(h.camera.position);
  h.followLight.intensity = 1.5;
  h.camera.fov = 55;
  h.camera.updateProjectionMatrix();
  h.controls.update();
  return t("scene.seal.summary", {
    id: p.owner,
    mass: locale.number(p.mass, { maximumFractionDigits: 3 }),
  });
}
