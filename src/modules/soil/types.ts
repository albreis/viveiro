import type { AgentState, NavigationWorld, Vec3 } from "../navigation/types.ts";

export interface SoilTask {
  projectId?: number;
  rubbleId?: number;
  phase: "dig" | "haul" | "dump" | "return" | "repair";
  entrance?: number;
  digTicks: number;
  reversing?: boolean;
  sourceNode?: number;
}
export interface SoilAgent extends AgentState {
  soilTask?: SoilTask;
}
export interface DigProject {
  id: number;
  from: number;
  front: number;
  goal: Vec3;
  completed: boolean;
  excavated: number;
}
export interface SoilPile extends Vec3 {
  id: number;
  mass: number;
  edge?: number;
}
export interface SoilState {
  version: number;
  removed: number;
  eroded: number;
  deposited: number;
  deposits: SoilPile[];
  projects: DigProject[];
  integrity: number[];
  lastProject: number;
  nextId: number;
}
export interface SoilWorld extends NavigationWorld {
  ants: SoilAgent[];
  soil: SoilState;
  params: { humidity: number };
  brood: unknown[];
  random(): number;
  moveInNest(ant: AgentState): void;
  moveSurface(ant: AgentState, heading: number, speed: number): boolean;
}
