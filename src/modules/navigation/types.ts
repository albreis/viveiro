export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface NavigationState {
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
  id: number;
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
  relief?: import("../landscape/types.ts").Hill[];
  nodes: NestNode[];
  links: [number, number][];
  revision: number;
  linkWidths?: number[];
  lastWidenTick?: number[];
  rubble?: (Vec3 & { id: number; mass: number; edge?: number })[];
  erosionCuts?: (Vec3 & { r: number })[];
}

export interface NavigationWorld {
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
