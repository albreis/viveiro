import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { SURVIVAL_PARAMETERS as p, type DeathCause } from "./types.ts";
import { ageHazard, infectionInterval } from "./curves.ts";
import { spendReserve, isClaustral } from "../founding/types.ts";
import { TICKS_PER_DAY } from "../simulation/constants.js";
export function updateLife(
  w: ColonyWorld,
  a: ColonyAgent,
  exposure = 0,
): DeathCause | null {
  const life = a.life;
  if (!life) return null;
  if ((a.health ?? 100) <= 0) return "combat";
  if ((a.kind === "queen" ? w.queenHealth : a.energy) <= 0) return "starvation";
  const days = Math.max(0, (w.tick - life.lastTick) / TICKS_PER_DAY),
    oldAge = life.ageHazard,
    oldDisease = life.diseaseHazard;
  const reserve = Math.max(0, Math.min(1, a.energy / 100)),
    damage = 1 - (a.health ?? 100) / 100;
  const next = infectionInterval(
    life.infection,
    exposure,
    p.clearancePerDay * (0.25 + 0.75 * reserve),
    days,
  );
  life.infection = next.infection;
  life.diseaseHazard +=
    p.diseaseHazardPerDay *
    (1 + p.woundHazardMultiplier * damage) *
    next.integral;
  life.ageHazard = ageHazard(a.age, a.kind);
  life.lastTick = w.tick;
  life.lastAge = a.age;
  const aged = life.ageHazard >= life.ageBudget,
    sick = life.diseaseHazard >= life.diseaseBudget;
  if (aged || sick) {
    if (!sick) return "age";
    if (!aged) return "disease";
    return (life.ageBudget - oldAge) / (life.ageHazard - oldAge) <=
      (life.diseaseBudget - oldDisease) / (life.diseaseHazard - oldDisease)
      ? "age"
      : "disease";
  }
  const repair = Math.min(100 - (a.health ?? 100), p.repairHpPerDay * days),
    cost = repair * p.repairFoodPerHp;
  let paid = Math.min(a.crop, cost);
  a.crop -= paid;
  if (paid < cost && a.kind === "queen" && isClaustral(w))
    paid += spendReserve(w, "maintenance", cost - paid);
  life.repairFood += paid;
  a.health = Math.min(100, (a.health ?? 100) + paid / p.repairFoodPerHp);
  return null;
}
export function recordMortality(
  w: ColonyWorld & { deaths: number },
  a: ColonyAgent,
): void {
  const stats = w.colony.survival;
  if (!stats || !a.life || a.life.deathRecorded) return;
  const raw = a.deathCause ?? (a.kind === "male" ? "reproduction" : "unknown");
  const cause = Object.hasOwn(stats.causes, raw)
    ? (raw as DeathCause)
    : "unknown";
  stats.causes[cause]++;
  a.life.deathRecorded = true;
  w.deaths =
    stats.initialDeaths +
    Object.values(stats.causes).reduce((n, x) => n + x, 0);
}
