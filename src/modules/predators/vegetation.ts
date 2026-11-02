import { modelMath } from "../../libs/model-math.ts";
import type { Plant } from "../landscape/types.ts";
import { speciesOf } from "../landscape/species.ts";
/** Ground-level stem/body clearance, not an impassable circle around the canopy. */
export function plantClearance(p: Plant): number {
  const type = speciesOf(p),
    base =
      type === "tree"
        ? 0.065
        : type === "shrub"
          ? 0.045
          : type === "cactus"
            ? 0.16
            : type === "succulent"
              ? 0.12
              : 0;
  return base ? base * (0.35 + Math.max(0, p.biomass) * 0.85) + 0.14 : 0;
}
function penetration(plants: Plant[], x: number, z: number) {
  let sum = 0;
  for (const p of plants) {
    const r = plantClearance(p);
    if (r) {
      const d = modelMath.hypot(x - p.x, z - p.z);
      if (d < r) sum += modelMath.pow(1 - d / r, 2);
    }
  }
  return sum;
}
export function blocksVegetation(
  plants: Plant[] | undefined,
  from: { x: number; z: number },
  x: number,
  z: number,
): boolean {
  if (!plants) return false;
  const next = penetration(plants, x, z),
    current = penetration(plants, from.x, from.z);
  // A growing stem or an imported pose may already overlap; permit continuous escape.
  return next > 0 && (current === 0 || next >= current - 1e-8);
}
