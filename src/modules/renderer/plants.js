import * as THREE from "three";
import { NEST, LIMIT, hashSeed } from "../simulation/world.js";
import { createSoilGeometry } from "../terrain/soil.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const UP = new THREE.Vector3(0, 1, 0);

export function buildPlant(host, plant) {
  const g = new THREE.Group();
  g.position.set(plant.x, 0, plant.z);
  const greens = ["#5d7c38", "#708c45", "#496c3c", "#8a9b53"];
  const leafMat = host.material(greens[plant.kind % 4]),
    stem = host.material("#7b8550");
  const trunk = host.mesh(
    new THREE.CylinderGeometry(0.025, 0.045, 1, 5),
    stem,
    g,
    0,
    0.5,
    0,
  );
  const count = plant.kind === 3 ? 9 : 6;
  for (let i = 0; i < count; i++) {
    const angle = i * 2.4 + plant.id;
    const height = 0.2 + i * 0.1,
      spread = 0.18 + (i % 3) * 0.05;
    const leaf = host.mesh(
      new THREE.SphereGeometry(1, 7, 4),
      leafMat,
      g,
      Math.cos(angle) * spread,
      height,
      Math.sin(angle) * spread,
    );
    leaf.scale.set(0.09, 0.035, 0.28);
    leaf.rotation.y = -angle + Math.PI / 2;
    leaf.rotation.z = 0.35;
  }
  if (plant.kind === 2) {
    trunk.scale.y = 1.6;
    for (let i = 0; i < 3; i++) {
      const crown = host.mesh(
        new THREE.IcosahedronGeometry(0.28, 1),
        leafMat,
        g,
        (i - 1) * 0.16,
        1.2 + i * 0.22,
        0,
      );
      crown.scale.set(1.2, 1, 0.9);
    }
  }
  host.plantGroup.add(g);
  return g;
}
