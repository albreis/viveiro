import * as THREE from "three";
import { NEST, LIMIT, hashSeed } from "../simulation/world.js";
import { createSoilGeometry } from "../terrain/soil.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const UP = new THREE.Vector3(0, 1, 0);

export function followAnt(host, id) {
  const ant = host.world.ants.find((a) => a.id === Number(id));
  if (!ant) return false;
  if (!host.followId)
    host.previousView = {
      position: host.camera.position.clone(),
      target: host.controls.target.clone(),
    };
  host.followId = ant.id;
  host.lookYaw = 0;
  host.lookPitch = 0;
  host.controls.enabled = false;
  host.camera.fov = 72;
  host.camera.near = 0.012;
  host.camera.updateProjectionMatrix();
  host.camera.position.set(ant.x, (ant.y || 0) + 0.17, ant.z);
  host.setTool(null);
  return true;
}

export function stopFollowing(host) {
  if (!host.followId) return;
  host.followId = null;
  host.controls.enabled = true;
  host.followLight.intensity = 0;
  host.camera.fov = 37;
  host.camera.near = 0.1;
  host.camera.updateProjectionMatrix();
  if (host.previousView) {
    host.camera.position.copy(host.previousView.position);
    host.controls.target.copy(host.previousView.target);
  }
  host.controls.update();
}

export function setView(host, view) {
  host.stopFollowing();
  const lateral = view === "side",
    top = view === true;
  host.controls.maxPolarAngle = lateral ? Math.PI * 0.6 : Math.PI * 0.47;
  host.camera.position.set(
    lateral ? 0 : top ? 0.01 : 22,
    lateral ? -1.2 : top ? 35 : 23,
    lateral ? 29 : top ? 0.01 : 27,
  );
  host.controls.target.set(0, lateral ? -1.9 : -0.7, lateral ? 2 : 0);
  host.controls.update();
}
