import type { FoundingWorld } from "../founding/types.ts";
export interface FamilyWorld extends FoundingWorld {
  colonies?: FamilyWorld[];
  nextColonyId?: number;
  colonyId?: number;
  lastFlightRain?: number;
  parentColonyId?: number;
  rng: number;
  physicsVersion: number;
  localRoutingVersion: number;
  pheromones: number[];
  deaths: number;
  lastRecord: number;
  lastWarning: number;
  lastDiscovery: number;
  events: { tick: number; day: number; text: string; type: string }[];
  history: {
    tick: number;
    day: number;
    population: number;
    brood: number;
    food: number;
    plants: number;
  }[];
  plants: import("../landscape/types.ts").Plant[];
  patches: {
    id: number;
    x: number;
    z: number;
    amount: number;
    capacity: number;
    discovered: boolean;
    sourcePlant?: number;
  }[];
  nestOdors: import("../chemistry/nest-odors.ts").NestOdors;
  record(): void;
  lifeLimit(ant: import("../colony/types.ts").ColonyAgent): number;
  snapshot(): unknown;
}
export const colonyWorlds = (world: FamilyWorld): FamilyWorld[] => [
  world,
  ...(world.colonies || []),
];
export const allAnts = (world: FamilyWorld) =>
  colonyWorlds(world).flatMap((w) => w.ants);
export const allBrood = (world: FamilyWorld) =>
  colonyWorlds(world).flatMap((w) => w.brood);
