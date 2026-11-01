import type { ColonyWorld } from "../colony/types.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import { isClaustral } from "../founding/types.ts";
import { advanceSeason, phaseFactors } from "./machine.ts";
export const seasonalProfile = (w: Pick<ColonyWorld, "biologicalProfile">) =>
  resolveBiologicalProfile(w.biologicalProfile).dormancyModel ===
  "obligate-demo";
function temperature(w: ColonyWorld) {
  const a = w.ants.find((a) => a.kind === "queen") || w.ants[0];
  if (!a || a.airborne) return w.params.temperatureC ?? 24;
  return (
    sampleClimate(w.microclimate, { x: a.x, y: a.y ?? 0, z: a.z })
      ?.temperature ??
    w.params.temperatureC ??
    24
  );
}
export function initializeSeason(w: ColonyWorld): void {
  if (!seasonalProfile(w) || w.colony.season) return;
  w.colony.season = {
    version: 1,
    phase: "active",
    since: w.tick,
    activeTicks: 0,
    coldCue: 0,
    chillTicks: 0,
    warmTicks: 0,
    cycles: 0,
    lastTemperature: temperature(w),
    lastPhotoperiod: w.params.photoperiodHours ?? 12,
  };
}
export function updateSeason(w: ColonyWorld): void {
  if (!seasonalProfile(w)) return;
  initializeSeason(w);
  const s = w.colony.season!,
    before = s.phase;
  advanceSeason(
    s,
    w.tick,
    temperature(w),
    w.params.photoperiodHours ?? 12,
    !isClaustral(w),
  );
  if (s.phase !== before)
    w.log(
      "Fase sazonal: " +
        {
          active: "atividade retomada",
          preparing: "preparação para repouso",
          dormant: "diapausa reprodutiva",
          resuming: "retomada gradual",
        }[s.phase] +
        ". Modelo demonstrativo.",
    );
}
export const seasonFactors = (w: Pick<ColonyWorld, "colony" | "tick">) =>
  phaseFactors(w.colony?.season, w.tick);
