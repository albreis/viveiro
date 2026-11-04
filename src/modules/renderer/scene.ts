import { SceneCore } from "./scene-core.ts";
import { installSceneInput } from "./scene-input.ts";
import { disposeScene } from "./scene-dispose.ts";
import type { RenderAgent, PointerPosition } from "./render-types.ts";
import type { Plant } from "../landscape/types.ts";
import type { RenderWorld as World } from "./render-types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import type { LandscapeView } from "./LandscapeView.ts";
import type { EntranceView } from "./EntranceView.ts";
import type { PlantView } from "./plants.ts";

import { keyboardCamera } from "./keyboard-camera.ts";

import type { PerformanceMode } from "./performance-profile.ts";
import { applyScenePerformance } from "./scene-performance.ts";
import { focusBrood } from "./brood-focus.ts";
import { PlugView } from "./PlugView.ts";
import { focusSealing } from "./sealing-focus.ts";
import { StructureView } from "./StructureView.ts";
import { focusStructure } from "./structure-focus.ts";
import { GranularView } from "./GranularView.ts";
import { EcologyView } from "./EcologyView.ts";
import { focusEcology } from "./ecology-focus.ts";
import { TrailView } from "./TrailView.ts";
import { ChemicalContactView } from "./ChemicalContactView.ts";
import { FoundersView } from "./FoundersView.ts";
import { updateSoilVisibility } from "./soil-visibility.ts";
import { ColonyView } from "./ColonyView.ts";
import { SoilMesher } from "../../services/SoilMesher.ts";
import type { SoilMeshData } from "../terrain/mesh-data.ts";
import { SoilView } from "./SoilView.ts";
import { buildGround, label } from "./environment.ts";
import { buildInsects, buildQueen, buildMale, updateAnts } from "./insects.ts";
import { buildPlant } from "./plants.ts";
import { followAnt, stopFollowing, setView } from "./camera.ts";
import { pickAnt, groundPoint } from "./picking.ts";
import { update } from "./world-view.ts";
import * as THREE from "three";

import { LIMIT } from "../simulation/world.js";

const UP = new THREE.Vector3(0, 1, 0);
export class Terrarium extends SceneCore {
  soil!: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial[]>;
  soilNest!: World["nest"];
  soilRevision = -1;
  lastSoilBuild = 0;
  landscapeView!: LandscapeView;
  entranceView!: EntranceView;
  nestLabel!: THREE.Sprite;
  soilMesher: SoilMesher;
  soilView: SoilView;
  granularView: GranularView;
  structureView: StructureView;
  plugView: PlugView;
  colonyView: ColonyView;
  foundersView: FoundersView;
  trailView: TrailView;
  trails: TrailView["points"];
  chemicalView: ChemicalContactView;
  ecologyView: EcologyView;
  antParts: THREE.InstancedMesh[];
  predatorParts: THREE.InstancedMesh[];
  queen: THREE.Group;
  male: THREE.Group;
  marker: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  plane: THREE.Plane;
  resizeObserver: ResizeObserver;
  plantViews: Map<number, PlantView>;
  foodViews: Map<
    number,
    THREE.Mesh<THREE.DodecahedronGeometry, THREE.MeshStandardMaterial>
  >;
  visibleWorkers: ColonyAgent[] = [];
  lastTick: number;

  constructor(
    element: HTMLElement,
    world: World,
    onPlace: (tool: string, x: number, z: number) => void,
    initialSoil?: { data: SoilMeshData; mesher: SoilMesher },
  ) {
    super(element, world, onPlace);
    buildGround(this, world.seed, initialSoil?.data);
    this.soilMesher =
      initialSoil?.mesher ?? new SoilMesher(this.performance.soilDetail);
    this.soilView = new SoilView(this.scene, LIMIT);
    this.granularView = new GranularView(this.scene);
    this.structureView = new StructureView(this.scene);
    this.plugView = new PlugView(this.scene);
    this.colonyView = new ColonyView(this.scene, LIMIT);
    this.antParts = this.buildInsects(LIMIT, false);
    this.predatorParts = this.buildInsects(10, true);
    this.queen = this.buildQueen();
    this.scene.add(this.queen);
    this.male = this.buildMale();
    this.scene.add(this.male);
    this.foundersView = new FoundersView(
      this.scene,
      this.queen,
      this.male,
      () => this.buildQueen(),
      () => this.buildMale(),
      () => [this.soil, ...this.plugView.objects()],
    );
    this.trailView = new TrailView(this.scene, world.nest);
    this.trails = this.trailView.points;
    this.chemicalView = new ChemicalContactView(this.scene, LIMIT);
    this.ecologyView = new EcologyView(this.scene);
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
    installSceneInput(this);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(element);
    this.resize();
    this.plantViews = new Map();
    this.foodViews = new Map();
    this.lastTick = -1;
  }
  label(text: string, x: number, y: number, z: number) {
    return label(this, text, x, y, z);
  }
  buildInsects(max: number, spider: boolean) {
    return buildInsects(this, max, spider);
  }
  buildQueen() {
    return buildQueen(this);
  }
  buildMale() {
    return buildMale(this);
  }
  buildPlant(plant: Plant) {
    return buildPlant(this, plant);
  }
  update(world: World, time: number, alpha = 1) {
    return update(this, world, time, alpha);
  }
  updateAnts(
    agents: RenderAgent[],
    parts: THREE.InstancedMesh[],
    spider: boolean,
    time: number,
  ) {
    return updateAnts(this, agents, parts, spider, time);
  }
  pickAnt(e: PointerPosition) {
    return pickAnt(this, e);
  }
  groundPoint(e: PointerPosition) {
    return groundPoint(this, e);
  }
  setTool(tool: string | null) {
    this.tool = tool;
    this.controls.enableRotate = !tool;
    this.renderer.domElement.style.cursor = tool ? "crosshair" : "grab";
    if (!tool) this.marker.visible = false;
  }
  followAnt(id: number) {
    return followAnt(this, id);
  }
  stopFollowing() {
    return stopFollowing(this);
  }
  setInterior(visible: boolean) {
    this.showInterior = visible;
    updateSoilVisibility(this);
  }
  focusBrood() {
    return focusBrood(this);
  }
  focusSealing() {
    return focusSealing(this);
  }
  focusStructure() {
    return focusStructure(this);
  }
  focusEcology() {
    return focusEcology(this);
  }
  setView(view: boolean | "side") {
    return setView(this, view);
  }
  cameraKey(key: string) {
    return keyboardCamera(this, key);
  }
  setPerformanceMode(mode: PerformanceMode) {
    applyScenePerformance(this, mode);
  }
  dispose() {
    disposeScene(this);
  }
}
