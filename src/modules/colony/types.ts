import type { SoilAgent, SoilWorld } from "../soil/types.ts";
import type { Vec3 } from "../navigation/types.ts";
export type Role = "forager" | "nurse" | "cleaner" | "defender";
export interface Traits {
  activity: number;
  courage: number;
  exploration: number;
}
export interface ColonyTask {
  kind: "brood" | "waste" | "care" | "guard";
  item?: number;
  destination: number;
  placing?: boolean;
  until?: number;
}
export interface ColonyAgent extends SoilAgent {
  age: number;
  crop: number;
  caste: "minor" | "major";
  traits: Traits;
  role: Role;
  bodyScale: number;
  headScale: number;
  bioTask?: ColonyTask;
  carryingWaste?: number;
  rest: number;
  deathCause?: string;
  socialUntil?: number;
  socialPartner?: number;
}
export interface Brood extends Vec3 {
  id: number;
  age: number;
  node: number;
  carrier?: number;
}
export interface Waste extends Vec3 {
  id: number;
  mass: number;
  kind: "food" | "corpse";
  carrier?: number;
  stored: boolean;
}
export interface ColonyState {
  version: number;
  shared: number;
  exchanges: number;
  waste: Waste[];
  cemeteryMass: number;
  spoiled: number;
}
export interface ColonyWorld extends SoilWorld {
  seed: string;
  nextId: number;
  queenHealth: number;
  lastLaying: number;
  born: number;
  population: number;
  predators: { x: number; z: number; energy: number }[];
  makeAnt(kind: string, x: number, z: number): ColonyAgent;
  ants: ColonyAgent[];
  brood: Brood[];
  colony: ColonyState;
}
