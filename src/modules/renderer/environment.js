import * as THREE from "three";
import { NEST, LIMIT, hashSeed } from "../simulation/world.js";
import { createSoilGeometry } from "../terrain/soil.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const UP = new THREE.Vector3(0, 1, 0);

export function buildGround(host, seed) {
  let state = hashSeed(seed + ":terrain");
  const rnd = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
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
    createSoilGeometry(host.world.nest),
    [
      host.material("#ffffff", { vertexColors: true }),
      host.material("#ffffff", { map: texture, vertexColors: true }),
    ],
    host.staticGroup,
  );
  host.soilRevision = host.world.nest.revision;
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
  const glassGeos = [
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
  const pondGeo = new THREE.CircleGeometry(1, 50);
  host.pond = host.mesh(
    pondGeo,
    new THREE.MeshPhysicalMaterial({
      color: "#7baf9e",
      roughness: 0.13,
      metalness: 0.16,
      transparent: true,
      opacity: 0.85,
    }),
    host.staticGroup,
    4.3,
    0.035,
    -2.5,
  );
  host.pond.rotation.x = -Math.PI / 2;
  host.pond.scale.set(1.9, 1.35, 1);
  const bank = host.mesh(
    new THREE.TorusGeometry(1, 0.045, 5, 60),
    host.material("#a2a778"),
    host.staticGroup,
    4.3,
    0.025,
    -2.5,
  );
  bank.rotation.x = -Math.PI / 2;
  bank.scale.set(1.94, 1.4, 0.7);
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    const rock = host.mesh(
      new THREE.DodecahedronGeometry(0.12 + rnd() * 0.18, 0),
      host.material(["#a7aa8b", "#868e72", "#bac0a1"][i % 3]),
      host.staticGroup,
      4.3 + Math.cos(t) * 2,
      0.07,
      -2.5 + Math.sin(t) * 1.45,
    );
    rock.scale.y = 0.6;
  }
  for (const entrance of host.world.nest.nodes.filter(
    (n) => n.type === "entrance",
  )) {
    const rim = host.mesh(
      new THREE.TorusGeometry(0.41, 0.095, 7, 22),
      host.material("#a18b60"),
      host.staticGroup,
      entrance.x,
      0.02,
      entrance.z,
    );
    rim.rotation.x = -Math.PI / 2;
  }
  for (let i = 0; i < 95; i++) {
    const x = (rnd() - 0.5) * 18.8,
      z = (rnd() - 0.5) * 11.8;
    if (host.world.inPond(x, z)) continue;
    const r = 0.055 + rnd() * 0.16,
      rock = host.mesh(
        new THREE.DodecahedronGeometry(r, 0),
        host.material(["#c0b28d", "#888f70", "#a59e78"][i % 3]),
        host.staticGroup,
        x,
        r * 0.4,
        z,
      );
    rock.scale.set(1, 0.55 + rnd() * 0.4, 1.3);
    rock.rotation.y = rnd() * 6;
  }
  const log = new THREE.Group();
  log.position.set(4.3, 0.28, 3.6);
  log.rotation.z = 0.09;
  log.rotation.y = 0.5;
  const timber = host.mesh(
    new THREE.CylinderGeometry(0.35, 0.42, 3.4, 9),
    host.material("#71634b"),
    log,
  );
  timber.rotation.z = Math.PI / 2;
  for (const x of [-1.72, 1.72]) {
    const cut = host.mesh(
      new THREE.CircleGeometry(0.33, 16),
      host.material("#c2aa7e"),
      log,
      x,
      0,
      0,
    );
    cut.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2;
  }
  host.staticGroup.add(log);
  // A few grass tufts add scale without requiring imported assets.
  const grassMat = host.material("#748a45", { side: THREE.DoubleSide });
  const blade = new THREE.ConeGeometry(0.045, 0.45, 3);
  for (let i = 0; i < 240; i++) {
    const x = (rnd() - 0.5) * 18.6,
      z = (rnd() - 0.5) * 11.5;
    if (host.world.inPond(x, z) || Math.hypot(x - NEST.x, z - NEST.z) < 1.2)
      continue;
    const g = host.mesh(blade, grassMat, host.staticGroup, x, 0.17, z);
    g.rotation.z = (rnd() - 0.5) * 0.6;
    g.scale.y = 0.4 + rnd();
  }
  host.nestLabel = host.label("ENTRADA", NEST.x, 0.9, NEST.z);
  host.label("ÁGUA", 4.3, 0.7, -2.5);
}

export function label(host, text, x, y, z) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#f5f8e5cc";
  ctx.beginPath();
  ctx.roundRect(4, 4, 248, 56, 20);
  ctx.fill();
  ctx.font = "500 21px Arial";
  ctx.fillStyle = "#64754e";
  ctx.textAlign = "center";
  ctx.fillText(text, 128, 41);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(c),
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
