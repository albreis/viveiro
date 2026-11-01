import { updateSoilVisibility } from "./soil-visibility.js";
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
  updateSoilVisibility(host);
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
  updateSoilVisibility(host);
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
  host.camera.fov = 37;
  host.camera.updateProjectionMatrix();
  host.followLight.intensity = 0;
  host.controls.minDistance = 9;
  const lateral = view === "side",
    top = view === true;
  if (lateral) {
    if (host.currentView === "side") host.sideFace = (host.sideFace + 1) % 4;
    else if (host.sideFace === undefined) {
      const q = host.world.nest.nodes.find((n) => n.type === "royal") ||
        host.world.founding?.chamber || { x: 0, z: 0 };
      host.sideFace =
        Math.abs(q.x) / 10 > Math.abs(q.z) / 6.5
          ? q.x > 0
            ? 1
            : 3
          : q.z > 0
            ? 0
            : 2;
    }
    const views = [
      [0, -1.2, 29],
      [32, -1.2, 0],
      [0, -1.2, -29],
      [-32, -1.2, 0],
    ];
    host.camera.position.set(...views[host.sideFace]);
    host.viewLabel = ["Frente", "Direita", "Fundo", "Esquerda"][host.sideFace];
  } else {
    host.camera.position.set(top ? 0.01 : 22, top ? 35 : 23, top ? 0.01 : 27);
    host.viewLabel = "";
  }
  host.currentView = view;
  host.controls.maxPolarAngle = lateral ? Math.PI * 0.62 : Math.PI * 0.47;
  host.controls.target.set(0, lateral ? -1.9 : -0.7, 0);
  host.controls.update();
}
