import type { EffortEnvironment } from "../fatigue/terrarium.ts";
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface NavigationState {
  progressAnchor?: Vec3;
  progressSince?: number;
  escapeDirection?: Vec3;
  escapeUntil?: number;
  velocity: Vec3;
  contactTicks: number;
  stagnantTicks: number;
  lastCell: string;
  turnUntil: number;
  turnAngle: number;
  wallAngle: number;
  retreats: number;
  yieldUntil?: number;
  excavateUntil?: number;
  retreating?: boolean;
}

export interface AgentState {
  learningUpdates?: number;
  learningBrain?: import("../learning/types.ts").TinyBrain;
  learningTrace?: import("../learning/types.ts").LearningTrace;
  effort?: import("../fatigue/effort-model.ts").EffortState;
  id: number;
  health?: number;
  bodyOdor?: number[];
  odorMask?: import("../social-chemistry/types.ts").OdorMask;
  intrusion?: import("../social-chemistry/types.ts").IntrusionTask;
  encounter?: import("../social-chemistry/types.ts").EncounterMotion;
  encounterCooldown?: number;
  encounterTicks?: number;
  lastAlienContact?: number;
  kind?: string;
  x: number;
  y?: number;
  z: number;
  speed: number;
  angle: number;
  pitch?: number;
  state?: string;
  energy: number;
  carrying: number;
  seedRation?: number;
  colonyId?: number;
  knownEdges?: [number, number, number][];
  recentNodes?: number[];
  lastNodeDistance?: number;
  routeIntent?: {
    destination: number;
    tag: string;
    odor: string;
    owner: number;
  };
  lastEntrance?: { node: number; x: number; z: number };
  hasFood?: boolean;
  pheromoneGain?: number;
  metabolicCost?: number;
  digPower?: number;
  carryingBrood?: number;
  carryingMimic?: number;
  mimicRejectedUntil?: number;
  carryingWaste?: number;
  bodyScale?: number;
  carryingSoil?: number;
  normal?: Vec3;
  navigation?: NavigationState;
  route: number[];
  node: number | null;
  tunnelCenter?: Vec3 | null;
  tunnelY?: number;
  distanceWalked?: number;
  avoidTicks?: number;
  avoidAngle?: number;
  avoidEntrance?: number;
  avoidEntranceUntil?: number;
  supportMotion?: SupportMotion;
}

export interface SupportWaypoint {
  position: Vec3;
  normal: Vec3;
}

export interface SupportMotion {
  points: SupportWaypoint[];
  center: Vec3;
  blockedTicks: number;
  bestDistance?: number;
  noProgressTicks?: number;
  searchCooldown?: number;
  goal?: SupportWaypoint;
}

export interface NestNode extends Vec3 {
  name: string;
  type: string;
  r: number;
  colonyId?: number;
}

export interface NestState {
  plugs?: import("../sealing/types.ts").EntrancePlug[];
  relief?: import("../landscape/types.ts").Hill[];
  nodes: NestNode[];
  links: [number, number][];
  revision: number;
  linkWidths?: number[];
  lastWidenTick?: number[];
  rubble?: import("../granular/types.ts").GranularBody[];
  erosionCuts?: (Vec3 & { r: number })[];
  /** Optional traffic rules; absent means the original rules. */
  traffic?: { idleYield?: boolean };
}

export interface NavigationWorld extends EffortEnvironment {
  decisionExtension?: import("../extensions/types.ts").ExtensionReference;
  extensionDecisions?: number;
  plants?: import("../landscape/types.ts").Plant[];
  colony?: import("../colony/types.ts").ColonyState;
  learning?: import("../learning/types.ts").LearningState;
  neighborAgents?: AgentState[];
  landscape?: import("../landscape/types.ts").Landscape;
  tick: number;
  food: number;
  ants: AgentState[];
  nest: NestState;
  range(min: number, max: number): number;
  log(message: string, type?: string): void;
  inPond(x: number, z: number): boolean;
  onNestArrival?(ant: AgentState, node: number): boolean;
  onStorageVisit?(ant: AgentState): void;
  recordSoilRemoval?(ant: AgentState, mass: number): void;
  routeSignal?(from: number, to: number, odor: string, owner: number): number;
}
