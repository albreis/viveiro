import type { ClimateWorld } from "./types.ts";
import { ensureSoilClimate } from "./initialize.ts";
import { transportSoilClimate } from "./transport.ts";
import { climateBoundaries } from "./boundaries.ts";
export function updateSoilClimate(w: ClimateWorld) {
  const s = ensureSoilClimate(w);
  if (w.tick % 10) return;
  s.steps++;
  transportSoilClimate(s, 10);
  climateBoundaries(w, s, 10);
}
