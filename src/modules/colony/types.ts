import type { SoilAgent, SoilWorld } from "../soil/types.ts";
import type { Vec3 } from "../navigation/types.ts";
export type Role = "forager" | "nurse" | "cleaner" | "defender" | "excavator";
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
  life?: import("../survival/types.ts").LifeState;
  stockGoal?: number;
  roomMemory?: import("../chambers/types.ts").RoomMemory;
  sexual?: boolean;
  departure?: boolean;
  foundressBudget?: number;
  winged?: boolean;
  airborne?: boolean;
  nanitic?: boolean;
  genome?: import("../genetics/genome.ts").Genome;
  age: number;
  crop: number;
  seedRation?: number;
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
  thresholds?: Record<Role, number>;
  nextTaskChoice?: number;
  taskMemory?: { queenNeed: number; until: number };
  stockEmptyUntil?: number;
  socialPartner?: number;
}
export interface Brood extends Vec3 {
  fertilization?: import("../fertility/types.ts").Fertilization;
  cocoon?: { version: 1; paid: number; built: boolean };
  development?: import("../development/types.ts").BroodDevelopment;
  kind?: "worker" | "gyne" | "male";
  nanitic?: boolean;
  genome?: import("../genetics/genome.ts").Genome;
  id: number;
  age: number;
  node: number;
  carrier?: number;
}
export interface Waste extends Vec3 {
  id: number;
  mass: number;
  kind: "food" | "corpse" | "cocoon";
  carrier?: number;
  stored: boolean;
}
export interface ColonyState {
  survival?: import("../survival/types.ts").SurvivalStats;
  fertility?: import("../fertility/types.ts").FertilityState;
  stores?: import("../stores/types.ts").FoodStores;
  season?: import("../seasons/types.ts").SeasonState;
  broodLosses?: number;
  reproductiveFood?: number;
  version: number;
  shared: number;
  exchanges: number;
  waste: Waste[];
  cemeteryMass: number;
  spoiled: number;
}
export interface ColonyWorld extends SoilWorld {
  biologicalProfile?: import("../biology/types.ts").BiologicalReference;
  gases?: import("../ventilation/types.ts").GasState;
  ecology?: import("../ecology/types.ts").EcologyState;
  socialChemistry?: import("../social-chemistry/types.ts").SocialChemistry;
  colonyId?: number;
  capacityOffset?: number;
  lastSexualLaying?: number;
  remainingFoundations?: number;
  founding?: import("../founding/types.ts").FoundingState;
  seed: string;
  nextId: number;
  queenHealth: number;
  lastLaying: number;
  born: number;
  population: number;
  predators: { x: number; z: number; energy: number }[];
  makeAnt(
    kind: string,
    x: number,
    z: number,
    genome?: import("../genetics/genome.ts").Genome,
  ): ColonyAgent;
  genetics?: import("../genetics/reproduction.ts").GeneticsState;
  ants: ColonyAgent[];
  brood: Brood[];
  colony: ColonyState;
}
