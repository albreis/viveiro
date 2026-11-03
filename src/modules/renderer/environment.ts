import type { Terrarium } from "./scene.ts";
import { localizedLabelTexture } from "./localized-label.ts";
import { LandscapeView } from "./LandscapeView.ts";
import { EntranceView } from "./EntranceView.ts";
import * as THREE from "three";
import { hashSeed } from "../simulation/world.js";
import { createSoilGeometry } from "../terrain/soil.js";

export function buildGround(host: Terrarium, seed: string) {
  let state = hashSeed(seed + ":terrain");
  const rnd = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#6d7549";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 20000; i++) {
    ctx.fillStyle = ["#52613b", "#8b8c59", "#838450", "#778353", "#646e43"][
      Math.floor(rnd() * 5)
    ];
    ctx.globalAlpha = 0.25 + rnd() * 0.4;
    const s = 1 + rnd() * 5;
    ctx.fillRect(rnd() * 512, rnd() * 512, s, s);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1.3);
  host.soil = host.mesh(
    createSoilGeometry(host.world.nest, host.performance.soilDetail),
    [
      host.material("#ffffff", { vertexColors: true }),
      host.material("#ffffff", { map: texture, vertexColors: true }),
      host.material("#ffffff", { vertexColors: true }),
    ],
    host.staticGroup,
  );
  host.soilRevision = host.world.nest.revision;
  host.soilNest = host.world.nest;
  host.lastSoilBuild = 0;
  host.mesh(
    new THREE.BoxGeometry(20.5, 0.17, 13.5),
    host.material("#5c624c"),
    host.staticGroup,
    0,
    -4.31,
    0,
  );
  host.mesh(
    new THREE.BoxGeometry(20.8, 0.12, 13.8),
    host.material("#aab295"),
    host.staticGroup,
    0,
    -4.46,
    0,
  );
  const floor = host.mesh(
    new THREE.PlaneGeometry(180, 180),
    host.material("#e5e9da"),
    host.scene,
    0,
    -4.55,
    0,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.castShadow = false;
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xc5dac1,
    transparent: true,
    opacity: 0.065,
    roughness: 0.08,
    metalness: 0.05,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const edge = new THREE.LineBasicMaterial({
    color: 0xa5b89b,
    transparent: true,
    opacity: 0.4,
  });
  const glassGeos: {
    size: [number, number, number];
    p: [number, number, number];
    top?: boolean;
  }[] = [
    { size: [20, 0.01, 13], p: [0, 4.1, 0], top: true },
    { size: [20, 8.3, 0.035], p: [0, -0.05, -6.5] },
    { size: [0.035, 8.3, 13], p: [10, -0.05, 0] },
    { size: [0.035, 8.3, 13], p: [-10, -0.05, 0] },
    { size: [20, 8.3, 0.035], p: [0, -0.05, 6.5] },
  ];
  for (const box of glassGeos) {
    const geo = new THREE.BoxGeometry(...box.size);
    if (!box.top) {
      const m = host.mesh(geo, glass, host.staticGroup, ...box.p);
      m.castShadow = false;
      m.receiveShadow = false;
    }
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge);
    edges.position.set(...box.p);
    host.staticGroup.add(edges);
  }
  host.landscapeView = new LandscapeView(host);
  host.entranceView = new EntranceView(host);
  host.entranceView.update(host.world);
  const entry = host.world.nest.nodes.find((n) => n.type === "entrance");
  host.nestLabel = host.label(
    "ENTRADA",
    entry?.x || 0,
    (entry?.y || 0) + 0.6,
    entry?.z || 0,
  );
}

export function label(
  host: Terrarium,
  text: string,
  x: number,
  y: number,
  z: number,
) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: localizedLabelTexture(text),
      transparent: true,
      depthTest: false,
      opacity: 0.85,
    }),
  );
  sprite.scale.set(1.3, 0.325, 1);
  sprite.position.set(x, y, z);
  host.staticGroup.add(sprite);
  return sprite;
}
