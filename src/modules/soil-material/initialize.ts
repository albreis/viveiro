import { validateSoilMaterial } from "./validation.ts";
import type { MaterialHost } from "./types.ts";
import { readSoilMaterial } from "./coefficients.ts";
import { MATERIAL_PARAMETERS as p } from "./types.ts";
export function initializeSoilMaterial(w: MaterialHost): void {
  if (!readSoilMaterial(w)) return;
  w.params.soilClayPercent ??= p.clayReference;
  w.params.soilCompactionPercent ??= p.packingReference;
  validateSoilMaterial(w, true);
}
