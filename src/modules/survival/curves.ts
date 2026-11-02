import { SURVIVAL_PARAMETERS as p } from "./types.ts";
export const ageScale = (kind: string | undefined) =>
  kind === "queen" || kind === "gyne"
    ? p.queenScaleDays
    : kind === "male"
      ? p.maleScaleDays
      : p.workerScaleDays;
export const ageHazard = (days: number, kind: string | undefined) =>
  Math.max(0, days / ageScale(kind)) ** p.ageShape;
/** Conditional survival with ageing alone, not a fitted biological forecast. */
export const ageSurvival = (days: number, kind: string | undefined) =>
  Math.exp(-ageHazard(days, kind));
/** Exact solution of dI/dt = exposure*(1-I)-clearance*I for a fixed interval. */
export function infectionInterval(
  initial: number,
  exposure: number,
  clearance: number,
  days: number,
) {
  const rate = exposure + clearance;
  if (rate === 0) return { infection: initial, integral: initial * days };
  const equilibrium = exposure / rate,
    removed = -Math.expm1(-rate * days);
  return {
    infection: Math.max(
      0,
      Math.min(1, equilibrium + (initial - equilibrium) * (1 - removed)),
    ),
    integral: Math.max(
      0,
      equilibrium * days + ((initial - equilibrium) * removed) / rate,
    ),
  };
}
