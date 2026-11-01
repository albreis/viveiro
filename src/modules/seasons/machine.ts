import { TICKS_PER_DAY as day } from "../simulation/constants.js";
import {
  SEASON_PARAMETERS as p,
  type SeasonState,
  type SeasonPhase,
} from "./types.ts";
const clamp = (x: number) => Math.max(0, Math.min(1, x));
function enter(s: SeasonState, phase: SeasonPhase, tick: number) {
  s.phase = phase;
  s.since = tick;
  s.warmTicks = 0;
}
/** Reproductive dormancy has endogenous memory; warm conditions alone cannot erase it. */
export function advanceSeason(
  s: SeasonState,
  tick: number,
  temperature: number,
  photoperiod: number,
  established: boolean,
): void {
  s.lastTemperature = temperature;
  s.lastPhotoperiod = photoperiod;
  if (s.phase === "active") {
    if (established) s.activeTicks++;
    const cue =
      temperature <= p.coldMaximum ||
      (photoperiod < p.shortDayHours && temperature < p.warmMinimum);
    s.coldCue = cue ? s.coldCue + 1 : Math.max(0, s.coldCue - 2);
    if (s.activeTicks >= p.activeDays * day || s.coldCue >= p.coldCueDays * day)
      enter(s, "preparing", tick);
  } else if (s.phase === "preparing") {
    if (tick - s.since >= p.preparationDays * day) {
      s.chillTicks = 0;
      enter(s, "dormant", tick);
    }
  } else if (s.phase === "dormant") {
    if (temperature >= p.coldMinimum && temperature <= p.coldMaximum)
      s.chillTicks++;
    s.warmTicks = temperature >= p.warmMinimum ? s.warmTicks + 1 : 0;
    if (
      s.chillTicks >= p.chillDays * day &&
      tick - s.since >= p.minimumDormantDays * day &&
      s.warmTicks >= p.warmCueDays * day
    )
      enter(s, "resuming", tick);
  } else if (temperature <= p.coldMaximum) enter(s, "dormant", tick);
  else if (tick - s.since >= p.resumeDays * day) {
    s.activeTicks = 0;
    s.coldCue = 0;
    s.chillTicks = 0;
    s.cycles++;
    enter(s, "active", tick);
  }
}
export function phaseFactors(s: SeasonState | undefined, tick: number) {
  let growth = 1;
  if (s?.phase === "dormant") growth = 0;
  if (s?.phase === "preparing")
    growth = 1 - clamp((tick - s.since) / (p.preparationDays * day));
  if (s?.phase === "resuming")
    growth = clamp((tick - s.since) / (p.resumeDays * day));
  return {
    growth,
    laying: growth,
    activity: p.dormantActivity + (1 - p.dormantActivity) * growth,
    larvalDemand: p.larvalMaintenance + (1 - p.larvalMaintenance) * growth,
  };
}
