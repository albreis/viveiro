import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { RenderWorld as World } from "./render-types.ts";
import { messageAttribute } from "../../i18n/runtime.ts";
import { readPerformanceMode } from "../../services/performance-preference.ts";
import {
  renderProfile,
  type RenderProfile,
  type PerformanceMode,
} from "./performance-profile.ts";
import type { RenderAgent, SceneView, PreviousView } from "./render-types.ts";
import { applyScenePerformance } from "./scene-performance.ts";
/** Core camera, lights and mesh primitives. World decisions remain outside rendering. */
export class SceneCore {
  performance: Readonly<RenderProfile>;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  followLight: THREE.PointLight;
  sun: THREE.DirectionalLight;
  staticGroup: THREE.Group;
  plantGroup: THREE.Group;
  foodGroup: THREE.Group;
  antGroup: THREE.Group;
  predatorGroup: THREE.Group;
  tool: string | null;
  showTrails: boolean;
  followId: number | null;
  selectedId: number | null;
  lookYaw: number;
  lookPitch: number;
  alpha = 1;
  showInterior = false;
  currentView: SceneView | undefined = undefined;
  sideFace?: number;
  previousView?: PreviousView;
  viewLabel = "";
  ecologyFocus?: number;
  onSelect?: (id: number) => void;
  onFollowStarted?: (id: number) => void;
  onFollowEnded?: () => void;
  element: HTMLElement;
  world: World;
  onPlace: (tool: string, x: number, z: number) => void;
  constructor(
    element: HTMLElement,
    world: World,
    onPlace: (tool: string, x: number, z: number) => void,
  ) {
    this.performance = renderProfile(readPerformanceMode());
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
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this.performance.pixelRatio),
    );
    this.renderer.shadowMap.enabled = this.performance.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.renderer.domElement.setAttribute("role", "img");
    messageAttribute(this.renderer.domElement, "aria-label", "scene.canvas");
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
  }
  material(
    color: THREE.ColorRepresentation,
    extra: THREE.MeshStandardMaterialParameters = {},
  ) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });
  }
  mesh<
    G extends THREE.BufferGeometry,
    M extends THREE.Material | THREE.Material[],
  >(
    geometry: G,
    material: M,
    parent: THREE.Object3D,
    x = 0,
    y = 0,
    z = 0,
  ): THREE.Mesh<G, M> {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  pose(ant: RenderAgent) {
    const t = this.alpha;
    return new THREE.Vector3(
      (ant.previousX ?? ant.x) + (ant.x - (ant.previousX ?? ant.x)) * t,
      (ant.previousY ?? ant.y ?? 0) +
        ((ant.y || 0) - (ant.previousY ?? ant.y ?? 0)) * t,
      (ant.previousZ ?? ant.z) + (ant.z - (ant.previousZ ?? ant.z)) * t,
    );
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
}
