import type { FoundingState } from "./types.ts";
/** The spoil mound and approach lip are opposite the buried shaft, never over its roof. */
export function outsideSite(f: FoundingState, radius: number) {
  const dx = f.site.x - f.chamber.x,
    dz = f.site.z - f.chamber.z,
    d = Math.hypot(dx, dz) || 1;
  return {
    x: f.site.x + (dx / d || 1) * radius,
    z: f.site.z + (dz / d) * radius,
  };
}
