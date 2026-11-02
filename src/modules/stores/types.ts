import type { Vec3, NestState } from "../navigation/types.ts";
export type FoodFlow =
  | "foraged"
  | "refund"
  | "foundress"
  | "brood"
  | "silk"
  | "care"
  | "sexual"
  | "spoilage"
  | "stolen";
export interface FoodBin {
  node: number;
  point: Vec3;
  amount: number;
}
export interface FoodStores {
  version: 1;
  initial: number;
  incoming: number;
  outgoing: number;
  flows: Partial<Record<FoodFlow, number>>;
  bins: FoodBin[];
}
export interface StockWorld {
  food: number;
  colony?: { stores?: FoodStores };
  nest?: NestState;
  colonyId?: number;
  biologicalProfile?: unknown;
  ants?: { kind?: string; node: number | null; stockGoal?: number }[];
}
export const STORE_PARAMETERS = Object.freeze({
  preferredWater: 0.3,
  spoilWater: 0.65,
  spoilRate: 0.005,
});
