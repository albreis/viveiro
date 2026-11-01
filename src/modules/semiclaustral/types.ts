import type { Vec3 } from "../navigation/types.ts";
export interface FoundressForaging {
  version: 1;
  phase: "nursing" | "outbound" | "searching" | "returning";
  searchTicks: number;
  heading: number;
  nextDeparture: number;
  pantry: number;
  load: number;
  collected: number;
  delivered: number;
  consumed: number;
  exported: number;
  lost: number;
  trips: number;
}
export interface FoodPatch {
  id: number;
  x: number;
  z: number;
  amount: number;
  capacity: number;
  discovered: boolean;
  sourcePlant?: number;
}
export const FORAGING_PARAMETERS = Object.freeze({
  capacity: 0.65,
  sensorRadius: 2.3,
  contactRadius: 0.38,
  pantryTarget: 1.4,
  searchLimit: 600,
  restTicks: 80,
  travelCost: 0.0004,
});
export function createFoundressForaging(): FoundressForaging {
  return {
    version: 1,
    phase: "nursing",
    searchTicks: 0,
    heading: 0,
    nextDeparture: 0,
    pantry: 0,
    load: 0,
    collected: 0,
    delivered: 0,
    consumed: 0,
    exported: 0,
    lost: 0,
    trips: 0,
  };
}
