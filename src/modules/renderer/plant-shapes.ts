import type { Species } from "../landscape/types.ts";
import type { Terrarium } from "./scene.ts";
import * as THREE from "three";
export function buildPlantShape(
  host: Terrarium,
  g: THREE.Group,
  type: Species,
  leaf: THREE.MeshStandardMaterial,
  stem: THREE.MeshStandardMaterial,
  id: number,
) {
  const mesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => host.mesh(geo, mat, g, x, y, z);
  const sphere = (
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
  ) => {
    const m = mesh(new THREE.SphereGeometry(1, 12, 8), leaf, x, y, z);
    m.scale.set(sx, sy, sz);
    return m;
  };
  const stalk = (height: number, radius = 0.025) =>
    mesh(
      new THREE.CylinderGeometry(radius * 0.7, radius, height, 10),
      stem,
      0,
      height / 2,
    );
  if (type === "cactus") {
    const trunk = mesh(
      new THREE.CapsuleGeometry(0.16, 0.85, 6, 12),
      leaf,
      0,
      0.58,
    );
    for (const side of [-1, 1]) {
      const arm = mesh(
        new THREE.CapsuleGeometry(0.075, 0.4, 4, 10),
        leaf,
        side * 0.32,
        0.65 + side * 0.12,
      );
      const joint = mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.3, 10),
        leaf,
        side * 0.18,
        0.48 + side * 0.12,
      );
      joint.rotation.z = (side * Math.PI) / 2;
    }
    const spikes = host.material("#e6d5ac");
    for (let i = 0; i < 18; i++) {
      const a = i * 2.4,
        y = 0.2 + (i % 6) * 0.14;
      const n = mesh(
        new THREE.ConeGeometry(0.012, 0.09, 4),
        spikes,
        Math.cos(a) * 0.17,
        y,
        Math.sin(a) * 0.17,
      );
      n.rotation.set(
        (Math.sin(a) * Math.PI) / 2,
        0,
        (-Math.cos(a) * Math.PI) / 2,
      );
    }
    return;
  }
  if (type === "succulent") {
    for (let i = 0; i < 15; i++) {
      const a = i * 2.4,
        layer = Math.floor(i / 5);
      const m = sphere(
        Math.cos(a) * (0.12 + layer * 0.05),
        0.12 + layer * 0.08,
        Math.sin(a) * (0.12 + layer * 0.05),
        0.1,
        0.07,
        0.32 - layer * 0.05,
      );
      m.rotation.y = -a + Math.PI / 2;
      m.rotation.z = 0.4;
    }
    return;
  }
  if (type === "moss") {
    for (let i = 0; i < 7; i++) {
      const a = i * 2.4;
      sphere(Math.cos(a) * 0.18, 0.07, Math.sin(a) * 0.18, 0.22, 0.09, 0.18);
    }
    return;
  }
  if (type === "grass") {
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      const m = mesh(
        new THREE.ConeGeometry(0.035, 0.5 + (i % 3) * 0.15, 5),
        leaf,
        Math.cos(a) * 0.08,
        0.27,
        Math.sin(a) * 0.08,
      );
      m.rotation.z = Math.cos(a) * 0.22;
      m.rotation.x = Math.sin(a) * 0.22;
    }
    return;
  }
  if (type === "tree") {
    stalk(1.55, 0.065);
    for (let i = 0; i < 5; i++) {
      const a = i * 2.4;
      sphere(
        Math.cos(a) * 0.22,
        1.35 + (i % 3) * 0.26,
        Math.sin(a) * 0.22,
        0.38,
        0.4,
        0.35,
      );
    }
    return;
  }
  if (type === "shrub") {
    stalk(0.8, 0.045);
    for (let i = 0; i < 6; i++) {
      const a = i * 2.4;
      sphere(
        Math.cos(a) * 0.2,
        0.5 + (i % 3) * 0.18,
        Math.sin(a) * 0.2,
        0.28,
        0.23,
        0.28,
      );
    }
    return;
  }
  if (type === "flower") {
    stalk(0.75);
    const petal = host.material(["#d5ac88", "#c88d9c", "#e3d094"][id % 3]);
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const m = mesh(
        new THREE.SphereGeometry(1, 10, 6),
        petal,
        Math.cos(a) * 0.15,
        0.77,
        Math.sin(a) * 0.15,
      );
      m.scale.set(0.12, 0.04, 0.08);
      m.rotation.y = -a;
    }
    mesh(
      new THREE.SphereGeometry(0.065, 10, 8),
      host.material("#d7ad4a"),
      0,
      0.8,
    );
  } else stalk(0.95);
  // Ferns have branching fronds; flowering herbs have paired leaves.
  const count = type === "fern" ? 8 : 4;
  for (let i = 0; i < count; i++) {
    const a = i * 2.4 + id,
      y = 0.2 + i * 0.075;
    for (let j = 0; j < (type === "fern" ? 4 : 1); j++) {
      const r = 0.12 + j * 0.08,
        m = sphere(
          Math.cos(a) * r,
          y + j * 0.015,
          Math.sin(a) * r,
          0.065,
          0.025,
          0.15,
        );
      m.rotation.y = -a + Math.PI / 2;
    }
  }
}
