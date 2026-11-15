import type { LaboratoryGeometry } from "../../../terrain/laboratory.ts";
import { validateLaboratoryGeometry } from "../../../terrain/laboratory.ts";
import { modelLength, type PhysicalScale } from "./scale.ts";
/** Reported dimensions, not coefficients fitted to colony outcomes. */
export const GAUTRAIS_GEOMETRY_MM = Object.freeze({
  sandRadius: 100,
  sandDepth: 5,
  arenaRadius: 250,
  coverHalfWidth: 125,
});
export function laboratoryGeometry(
  scale: PhysicalScale,
  coverThicknessMm: number,
): LaboratoryGeometry {
  const g: LaboratoryGeometry = {
    kind: "gautrais-sand-disk-preparation-v1",
    millimetersPerUnit: scale.millimetersPerUnit,
    sandRadius: modelLength(GAUTRAIS_GEOMETRY_MM.sandRadius, scale),
    sandDepth: modelLength(GAUTRAIS_GEOMETRY_MM.sandDepth, scale),
    arenaRadius: modelLength(GAUTRAIS_GEOMETRY_MM.arenaRadius, scale),
    coverHalfWidth: modelLength(GAUTRAIS_GEOMETRY_MM.coverHalfWidth, scale),
    coverThickness: modelLength(coverThicknessMm, scale),
  };
  validateLaboratoryGeometry(g);
  return g;
}
