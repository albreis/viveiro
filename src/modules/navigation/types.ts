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
  hasFood?: boolean;
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
}

export interface NestState {
  nodes: NestNode[];
  links: [number, number][];
  revision: number;
  linkWidths?: number[];
  lastWidenTick?: number[];
  rubble?: (Vec3 & { id: number; mass: number; edge?: number })[];
  erosionCuts?: (Vec3 & { r: number })[];
}

export interface NavigationWorld {
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
}
