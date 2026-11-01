export type MaternalUse = "maintenance" | "eggs" | "larvae" | "excavation";
export interface ReserveStores {
  lipid: number;
  protein: number;
  muscle: number;
}
export interface MaternalState {
  version: 1;
  initial: ReserveStores;
  stores: ReserveStores;
  converted: number;
  consumed: { lipid: number; protein: number };
  unmet: Record<MaternalUse, number>;
}
export const MATERNAL_PARAMETERS = Object.freeze({
  lipidFraction: 3 / 8,
  proteinFraction: 3 / 8,
  muscleFraction: 2 / 8,
  histolysisPerTick: 0.001,
  eggCost: 0.21,
});
