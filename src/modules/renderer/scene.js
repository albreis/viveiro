import { buildGround, label } from "./environment.js";
import { buildInsects, buildQueen, buildMale, updateAnts } from "./insects.js";
import { buildPlant } from "./plants.js";
import { followAnt, stopFollowing, setView } from "./camera.js";
import { pickAnt, groundPoint } from "./picking.js";
import { update } from "./world-view.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { NEST, LIMIT, hashSeed } from "../simulation/world.js";
import { createSoilGeometry } from "../terrain/soil.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const UP = new THREE.Vector3(0, 1, 0);
export class Terrarium {
  constructor(element, world, onPlace) {
    this.element = element;
    this.onPlace = onPlace;
    this.world = world;
    this.tool = null;
    this.showTrails = false;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#e5e9da");
    this.scene.fog = new THREE.Fog("#e5e9da", 35, 76);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    element.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(37, 1, 0.1, 130);
    this.camera.position.set(22, 23, 27);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, -0.2, 0);
    this.controls.enableDamping = true;
    this.controls.minDistance = 9;
    this.controls.maxDistance = 53;
    this.controls.maxPolarAngle = Math.PI * 0.47;
    this.controls.minPolarAngle = 0.07;
    this.controls.enablePan = true;
    this.scene.add(new THREE.HemisphereLight(0xf4f4da, 0x6d7357, 3.2));
    this.followLight = new THREE.PointLight(0xffe5b5, 0, 4, 1.5);
    this.scene.add(this.followLight);
    this.followId = null;
    this.selectedId = null;
    this.lookYaw = 0;
    this.lookPitch = 0;
    const sun = new THREE.DirectionalLight(0xfff0c6, 4.3);
    sun.position.set(-6, 18, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 15;
    sun.shadow.camera.bottom = -15;
    sun.shadow.normalBias = 0.04;
    sun.shadow.bias = -0.0002;
    this.scene.add(sun);
    this.sun = sun;
    const fill = new THREE.DirectionalLight(0xd9ead4, 1.2);
    fill.position.set(12, 8, -15);
    this.scene.add(fill);
    this.staticGroup = new THREE.Group();
    this.scene.add(this.staticGroup);
    this.plantGroup = new THREE.Group();
    this.scene.add(this.plantGroup);
    this.foodGroup = new THREE.Group();
    this.scene.add(this.foodGroup);
    this.antGroup = new THREE.Group();
    this.scene.add(this.antGroup);
    this.predatorGroup = new THREE.Group();
    this.scene.add(this.predatorGroup);
    this.buildGround(world.seed);
    this.antParts = this.buildInsects(LIMIT, false);
    this.predatorParts = this.buildInsects(10, true);
    this.queen = this.buildQueen();
    this.scene.add(this.queen);
    this.male = this.buildMale();
    this.scene.add(this.male);
    this.broodMesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.075, 7, 5),
      this.material("#ded7aa"),
      LIMIT,
    );
    this.broodMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.broodMesh.count = 0;
    this.scene.add(this.broodMesh);
    const trailPositions = new Float32Array(1040 * 3),
      trailColors = new Float32Array(1040 * 3);
    for (let z = 0; z < 26; z++)
      for (let x = 0; x < 40; x++) {
        const i = z * 40 + x;
        trailPositions[i * 3] = ((x + 0.5) / 40) * 20 - 10;
        trailPositions[i * 3 + 1] = 0.055;
        trailPositions[i * 3 + 2] = ((z + 0.5) / 26) * 13 - 6.5;
      }
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3),
    );
    trailGeo.setAttribute("color", new THREE.BufferAttribute(trailColors, 3));
    this.trails = new THREE.Points(
      trailGeo,
      new THREE.PointsMaterial({
        size: 0.27,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.trails.visible = false;
    this.scene.add(this.trails);
    this.marker = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.36, 32),
      new THREE.MeshBasicMaterial({
        color: 0x567b35,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      }),
    );
    this.marker.rotation.x = -Math.PI / 2;
    this.marker.position.y = 0.045;
    this.marker.visible = false;
    this.scene.add(this.marker);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.plane = new THREE.Plane(UP, 0);
    let down = null;
    this.renderer.domElement.addEventListener("pointerdown", (e) => {
      down = { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY };
    });
    this.renderer.domElement.addEventListener("pointermove", (e) => {
      if (this.followId && down) {
        this.lookYaw += (e.clientX - down.lastX) * 0.004;
        this.lookPitch = Math.max(
          -0.8,
          Math.min(0.8, this.lookPitch - (e.clientY - down.lastY) * 0.004),
        );
        down.lastX = e.clientX;
        down.lastY = e.clientY;
        return;
      }
      const p = this.groundPoint(e);
      this.marker.visible = !!this.tool && !!p;
      if (p) this.marker.position.set(p.x, 0.045, p.z);
    });
    this.renderer.domElement.addEventListener(
      "pointerleave",
      () => (this.marker.visible = false),
    );
    this.renderer.domElement.addEventListener("pointerup", (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (this.followId || moved > 6) return;
      const p = this.groundPoint(e);
      if (this.tool) {
        if (p) this.onPlace(this.tool, p.x, p.z);
        return;
      }
      const id = this.pickAnt(e);
      if (id) {
        this.selectedId = id;
        this.onSelect?.(id);
      }
    });
    this.renderer.domElement.addEventListener("dblclick", (e) => {
      if (this.tool || this.followId) return;
      const id = this.pickAnt(e);
      if (!id) return;
      e.preventDefault();
      this.selectedId = id;
      this.onSelect?.(id);
      this.followAnt(id);
      this.onFollowStarted?.(id);
    });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(element);
    this.resize();
    this.plantViews = new Map();
    this.foodViews = new Map();
    this.lastTick = -1;
  }
  material(color, extra = {}) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });
  }
  mesh(geometry, material, parent, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(geometry, material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  buildGround(seed) {
    return buildGround(this, seed);
  }
  label(text, x, y, z) {
    return label(this, text, x, y, z);
  }
  buildInsects(max, spider) {
    return buildInsects(this, max, spider);
  }
  buildQueen() {
    return buildQueen(this);
  }
  buildMale() {
    return buildMale(this);
  }
  buildPlant(plant) {
    return buildPlant(this, plant);
  }
  pose(ant) {
    const t = this.alpha ?? 1;
    return new THREE.Vector3(
      (ant.previousX ?? ant.x) + (ant.x - (ant.previousX ?? ant.x)) * t,
      (ant.previousY ?? ant.y ?? 0) +
        ((ant.y || 0) - (ant.previousY ?? ant.y ?? 0)) * t,
      (ant.previousZ ?? ant.z) + (ant.z - (ant.previousZ ?? ant.z)) * t,
    );
  }
  update(world, time, alpha = 1) {
    return update(this, world, time, alpha);
  }
  updateAnts(agents, parts, spider, time) {
    return updateAnts(this, agents, parts, spider, time);
  }
  pickAnt(e) {
    return pickAnt(this, e);
  }
  groundPoint(e) {
    return groundPoint(this, e);
  }
  setTool(tool) {
    this.tool = tool;
    this.controls.enableRotate = !tool;
    this.renderer.domElement.style.cursor = tool ? "crosshair" : "grab";
    if (!tool) this.marker.visible = false;
  }
  followAnt(id) {
    return followAnt(this, id);
  }
  stopFollowing() {
    return stopFollowing(this);
  }
  setView(view) {
    return setView(this, view);
  }
  resize() {
    const { width, height } = this.element.getBoundingClientRect();
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  render() {
    if (!this.followId) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    const geos = new Set(),
      mats = new Set(),
      textures = new Set();
    this.scene.traverse((o) => {
      if (o.geometry) geos.add(o.geometry);
      for (const m of Array.isArray(o.material) ? o.material : [o.material])
        if (m) {
          mats.add(m);
          if (m.map) textures.add(m.map);
        }
    });
    geos.forEach((g) => g.dispose());
    mats.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
