import type { GranularBody, GranularState } from "../granular/types.ts";
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
  remainingSegments?: number;
  heading?: Vec3;
  lastWorkedTick?: number;
}
export interface SoilPile extends GranularBody {}
export interface SoilState {
  structure?: import("../structure/types.ts").StructureState;
  granular?: GranularState;
  version: number;
  removed: number;
  eroded: number;
  deposited: number;
  reclaimed?: number;
  deposits: SoilPile[];
  projects: DigProject[];
  integrity: number[];
  lastProject: number;
  nextId: number;
}
export interface SoilWorld extends NavigationWorld {
  microclimate?: import("../microclimate/types.ts").SoilClimate;
  colonies?: SoilWorld[];
  ants: SoilAgent[];
  soil: SoilState;
  params: { humidity: number; reposeAngle?: number; temperatureC?: number };
  brood: unknown[];
  random(): number;
  moveInNest(ant: AgentState): void;
  moveSurface(ant: AgentState, heading: number, speed: number): boolean;
}
