import { modelMath } from "../../libs/model-math.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import type {
  MaterialHost,
  MaterialMix,
  TransportFactors,
  RoofFactors,
} from "./types.ts";
import { MATERIAL_PARAMETERS as p } from "./types.ts";
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
export function readSoilMaterial(w: MaterialHost): MaterialMix | null {
  if (
    resolveBiologicalProfile(w.biologicalProfile).materialModel !==
    "relative-demo"
  )
    return null;
  return {
    clay: (w.params.soilClayPercent ?? p.clayReference) / 100,
    packing: (w.params.soilCompactionPercent ?? p.packingReference) / 100,
  };
}
/** Normalized indices, not measured hydraulic or geotechnical coefficients. */
export function transportFactors(m: MaterialMix): TransportFactors {
  const clay = m.clay - p.clayReference / 100,
    packing = m.packing - p.packingReference / 100;
  return {
    capillary: clamp(
      modelMath.exp(p.capillaryClay * clay - p.capillaryPacking * packing),
      0.15,
      3,
    ),
    drainage: clamp(
      modelMath.exp(-p.drainageClay * clay - p.drainagePacking * packing),
      0.15,
      3,
    ),
    heat: modelMath.exp(p.heatPacking * packing),
  };
}
export function roofFactors(m: MaterialMix, water: number): RoofFactors {
  const clay = m.clay - p.clayReference / 100,
    packing = m.packing - p.packingReference / 100,
    wet = clamp((water - 0.8) / 0.2, 0, 1);
  const softening =
    (1 - p.wetSoftening * m.clay * wet) /
    (1 - p.wetSoftening * (p.clayReference / 100) * wet);
  return {
    density: 1 + p.densityPacking * packing,
    cohesion: clamp(
      modelMath.exp(p.cohesionClay * clay + p.cohesionPacking * packing) *
        softening,
      0.1,
      3,
    ),
  };
}
