export interface MaterialParams {
  soilClayPercent?: number;
  soilCompactionPercent?: number;
}
export interface MaterialHost {
  biologicalProfile?: unknown;
  params: MaterialParams;
}
export interface MaterialMix {
  clay: number;
  packing: number;
}
export interface TransportFactors {
  capillary: number;
  drainage: number;
  heat: number;
}
export interface RoofFactors {
  density: number;
  cohesion: number;
}
export const MATERIAL_PARAMETERS = Object.freeze({
  clayReference: 35,
  packingReference: 50,
  capillaryClay: 0.6,
  capillaryPacking: 0.8,
  drainageClay: 1.5,
  drainagePacking: 1.2,
  heatPacking: 0.25,
  densityPacking: 0.4,
  cohesionClay: 0.8,
  cohesionPacking: 0.6,
  wetSoftening: 0.6,
});
