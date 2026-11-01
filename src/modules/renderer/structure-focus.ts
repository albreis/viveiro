import type { FamilyWorld } from "../colonies/types.ts";
import type { PerspectiveCamera, PointLight } from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
interface Host {
  world: FamilyWorld;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  followLight?: PointLight;
  currentView: unknown;
  stopFollowing(): void;
  setInterior(value: boolean): void;
}
export function focusStructure(h: Host) {
  const patch = [...(h.world.soil.structure?.patches || [])].sort(
    (a, b) => a.safety - b.safety,
  )[0];
  if (!patch) return "Ainda não há tetos avaliados.";
  h.stopFollowing();
  h.setInterior(true);
  h.currentView = "structure";
  h.controls.minDistance = 0.16;
  const p = patch.roof;
  h.camera.position.set(p.x + 0.15, p.y - 0.2, p.z + 0.15);
  h.controls.target.set(p.x, p.y, p.z);
  if (h.followLight) {
    h.followLight.position.copy(h.camera.position);
    h.followLight.intensity = 1.5;
  }
  h.controls.update();
  return (
    "Teto com menor suporte · margem " +
    patch.safety.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) +
    "× no modelo exploratório."
  );
}
