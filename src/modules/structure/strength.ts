import type { RoofFactors } from "../soil-material/types.ts";
import type { RoofGeometry } from "./types.ts";
/** Reduced shear/bending capacity proxy, not calibrated Mohr-Coulomb FEM or grain force chains. */
export function roofStrength(
  p: RoofGeometry,
  water: number,
  angle: number,
  integrity = 1,
  material?: RoofFactors,
) {
  const s = Math.max(0, Math.min(1, water)),
    density = (1 + 0.7 * s) * (material?.density ?? 1),
    gravity = 0.0016;
  const overburden = density * gravity * p.depth,
    porePressure = 0.9 * gravity * p.depth * Math.max(0, (s - 0.85) / 0.15);
  const effective = Math.max(0, overburden - porePressure),
    friction = Math.tan((Math.max(15, Math.min(55, angle)) * Math.PI) / 180);
  const cohesion =
    (0.0003 + 0.0015 * 4 * s * (1 - s)) *
    Math.max(0.02, integrity) *
    (material?.cohesion ?? 1);
  const thickness = Math.min(p.thickness, p.span * 0.65 + 0.08),
    span = Math.max(0.1, p.span);
  const shear =
    (2 * (cohesion + effective * friction) * thickness * p.abutment) / span;
  const bending = (6 * cohesion * thickness ** 2) / span ** 2;
  const load = overburden * (1 - 0.45 * p.abutment),
    capacity = shear + bending;
  return {
    load,
    capacity,
    safety: Math.min(100, capacity / Math.max(1e-8, load)),
  };
}
