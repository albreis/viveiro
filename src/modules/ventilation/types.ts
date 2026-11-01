import type { ColonyWorld } from "../colony/types.ts";
export interface GasCell {
  volume: number;
  oxygen: number;
  carbon: number;
}
export interface GasState {
  version: 1;
  cells: GasCell[];
  pressure: number[];
  flow: number[];
  steps: number;
  residual: number;
  initialOxygen: number;
  initialCarbon: number;
  geometryOxygen: number;
  geometryCarbon: number;
  boundaryOxygen: number;
  boundaryCarbon: number;
  consumed: number;
  produced: number;
}
export interface AirEdge {
  a: number;
  b: number;
  diffusion: number;
  conductance: number;
  head: number;
}
export interface AirNetwork {
  edges: AirEdge[];
  vents: number[];
  volume: number[];
  ventDiffusion: number[];
}
export interface GasWorld extends ColonyWorld {
  colonies?: GasWorld[];
  gases?: GasState;
  params: ColonyWorld["params"] & {
    temperatureC?: number;
    windX?: number;
    windZ?: number;
  };
}
export const ATMOSPHERE = { oxygen: 0.209, carbon: 0.00042 };
