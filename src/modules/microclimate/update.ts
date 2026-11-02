import {
  readSoilMaterial,
  transportFactors,
} from "../soil-material/coefficients.ts";
import type { ClimateWorld } from "./types.ts";
import { ensureSoilClimate } from "./initialize.ts";
import { transportSoilClimate } from "./transport.ts";
import { climateBoundaries } from "./boundaries.ts";
export function updateSoilClimate(w: ClimateWorld) {
  const s = ensureSoilClimate(w);
  if (w.tick % 10) return;
  s.steps++;
  const mix = readSoilMaterial(w),
    material = mix ? transportFactors(mix) : undefined;
  transportSoilClimate(s, 10, true, material);
  climateBoundaries(w, s, 10, material ? Math.min(1, material.drainage) : 1);
}
