import {
  Vector3,
  Raycaster,
  type Group,
  type Object3D,
  type PerspectiveCamera,
  type PointLight,
} from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { FamilyWorld } from "../colonies/types.ts";
import { sampleSoil } from "../terrain/field.ts";
import { broodStage } from "../colony/brood.ts";
interface Host {
  world: FamilyWorld;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  followLight: PointLight;
  antGroup: Group;
  foundersView: { objects(includeHidden?: boolean): Object3D[] };
  currentView: unknown;
  stopFollowing(): void;
  setInterior(value: boolean): void;
}
export function focusBrood(h: Host): string {
  const available = h.world.brood.filter((b) => b.carrier === undefined),
    cocoons = available.filter((b) => b.cocoon?.built),
    brood = cocoons.length ? cocoons : available;
  if (!brood.length)
    return "As crias estão em transporte ou ainda não existem neste terrário.";
  const living = new Set(h.world.ants.map((a) => a.id)),
    actors = [
      h.antGroup,
      ...h.foundersView
        .objects(true)
        .filter((o) => living.has(o.userData.antId)),
    ];
  for (const o of actors) o.updateWorldMatrix(true, true);
  const ray = new Raycaster();
  let view: { eye: Vector3; target: Vector3; index: number } | undefined;
  for (let index = 0; index < brood.length && !view; index++) {
    const b = brood[index],
      target = new Vector3(b.x, b.y + 0.025, b.z);
    for (const radius of [0.65, 0.5, 0.35]) {
      for (let i = 0; i < 32; i++) {
        const y = 1 - (2 * (i + 0.5)) / 32,
          theta = i * Math.PI * (3 - Math.sqrt(5)),
          r = Math.sqrt(1 - y * y);
        const eye = target
          .clone()
          .addScaledVector(
            new Vector3(r * Math.cos(theta), y, r * Math.sin(theta)),
            radius,
          );
        if (sampleSoil(h.world.nest, eye).distance < 0.11) continue;
        let clear = true;
        for (let j = 1; j < 8; j++)
          if (
            sampleSoil(h.world.nest, eye.clone().lerp(target, j / 8)).distance <
            0.005
          ) {
            clear = false;
            break;
          }
        if (!clear) continue;
        ray.set(eye, target.clone().sub(eye).normalize());
        ray.far = radius - 0.07;
        if (ray.intersectObjects(actors, true).length) continue;
        view = { eye, target, index };
        break;
      }
      if (view) break;
    }
  }
  if (!view)
    return "As cuidadoras cobrem as crias agora. Observe novamente quando abrirem espaço.";
  h.stopFollowing();
  h.setInterior(true);
  h.currentView = "brood";
  h.controls.minDistance = 0.12;
  h.controls.maxPolarAngle = Math.PI * 0.98;
  h.camera.position.copy(view.eye);
  h.controls.target.copy(view.target);
  h.camera.fov = 55;
  h.camera.updateProjectionMatrix();
  h.followLight.position.copy(view.eye);
  h.followLight.intensity = 0.25;
  h.controls.update();
  const b = brood[view.index],
    stage = { egg: "ovo", larva: "larva", pupa: "pupa" }[broodStage(b.age)];
  return (
    "Cria #" + b.id + " · " + stage + (b.cocoon?.built ? " com casulo." : ".")
  );
}
