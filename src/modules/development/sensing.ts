import type { Brood, ColonyWorld } from "../colony/types.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { thermalRate, waterRate } from "./curves.ts";
export const thermalDevelopment = (w: Pick<ColonyWorld, "biologicalProfile">) =>
  resolveBiologicalProfile(w.biologicalProfile).developmentModel ===
  "thermal-demo";
export function broodEnvironment(w: ColonyWorld, b: Brood) {
  const actor =
    b.carrier === undefined ? b : w.ants.find((a) => a.id === b.carrier) || b;
  const local = sampleClimate(w.microclimate, {
    x: actor.x,
    y: actor.y ?? b.y,
    z: actor.z,
  });
  return {
    temperature: local?.temperature ?? w.params.temperatureC ?? 24,
    water: local?.water ?? 0.55,
  };
}
export function layingComfort(w: ColonyWorld): number {
  if (!thermalDevelopment(w)) return 1;
  const q = w.ants.find((a) => a.kind === "queen");
  if (!q) return 0;
  const local = sampleClimate(w.microclimate, { x: q.x, y: q.y ?? 0, z: q.z });
  return (
    thermalRate(local?.temperature ?? w.params.temperatureC ?? 24) *
    waterRate(local?.water ?? 0.55)
  );
}
