import { modelMath } from "../../libs/model-math.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import { allAnts, colonyWorlds } from "../colonies/types.ts";
import { neighborsOf, invalidateNeighbors } from "../navigation/sensors.ts";
import { contactAcrossAir } from "../colony/contact.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import type { ColonyAgent } from "../colony/types.ts";
import { SURVIVAL_PARAMETERS as p } from "./types.ts";
/** Snapshot local exposures before any body changes its infection or movement this tick. */
export function diseaseExposure(w: FamilyWorld): Map<number, number> | null {
  if (!colonyWorlds(w).some((c) => c.colony.survival)) return null;
  invalidateNeighbors(w);
  const ants = allAnts(w),
    byId = new Map(ants.map((a) => [a.id, a]));
  const wastes = colonyWorlds(w)
    .flatMap((c) => c.colony.waste)
    .map((item) => ({
      mass: item.mass,
      point:
        item.carrier === undefined ? item : (byId.get(item.carrier) ?? item),
    }));
  const out = new Map<number, number>(),
    distance = (
      a: { x: number; y?: number; z: number },
      b: { x: number; y?: number; z: number },
    ) => modelMath.hypot(a.x - b.x, (a.y ?? 0) - (b.y ?? 0), a.z - b.z);
  for (const a of ants) {
    if (!a.life) continue;
    let exposure = 0;
    for (const item of wastes) {
      const d = distance(a, item.point);
      if (d < 0.45 && contactAcrossAir(w.nest, a, item.point))
        exposure += item.mass * (1 - d / 0.45) * p.wasteExposurePerDay;
    }
    for (const b of neighborsOf(w, a, 0.45) as ColonyAgent[]) {
      const load = b.life?.infection ?? 0;
      if (load > 0 && contactAcrossAir(w.nest, a, b))
        exposure += load * p.contactExposurePerDay;
    }
    const wet =
      0.5 +
      (sampleClimate(w.microclimate, { x: a.x, y: a.y ?? 0, z: a.z })?.water ??
        0.55);
    out.set(a.id, Math.min(4, Math.max(0, exposure * wet)));
  }
  return out;
}
