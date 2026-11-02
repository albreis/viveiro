import { modelMath } from "../../libs/model-math.ts";
import { LIMIT, TICKS_PER_DAY } from "../simulation/constants.js";
import { seededRandom } from "../../libs/seeded-random.ts";
import { normalizeCounts } from "./observations.ts";
import type { CountObservation } from "./observations.ts";
export interface CountFit {
  current: number;
  slope: number;
  residuals: number[];
  points: number;
  sufficient: boolean;
}
export function fitCounts(input: CountObservation): CountFit {
  const observation = normalizeCounts(input),
    points = observation.counts;
  const sufficient =
    points.length >= 3 &&
    points.at(-1)!.tick - points[0].tick >= 0.5 * TICKS_PER_DAY;
  const current = points.at(-1)!.population;
  if (!sufficient)
    return {
      current,
      slope: 0,
      residuals: [0],
      points: points.length,
      sufficient,
    };
  const x = points.map((p) => (p.tick - observation.tick) / TICKS_PER_DAY),
    meanX = x.reduce((a, b) => a + b, 0) / x.length,
    meanY = points.reduce((n, p) => n + p.population, 0) / points.length;
  const covariance = points.reduce(
      (sum, p, i) => sum + (x[i] - meanX) * (p.population - meanY),
      0,
    ),
    variance = x.reduce((sum, v) => sum + modelMath.pow(v - meanX, 2), 0),
    slope = covariance / variance;
  const residuals = points.slice(1).map((p, i) => {
    const dt = (p.tick - points[i].tick) / TICKS_PER_DAY;
    return (p.population - points[i].population - slope * dt) / Math.sqrt(dt);
  });
  const mean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
  return {
    current,
    slope,
    residuals: residuals.map((r) => r - mean),
    points: points.length,
    sufficient,
  };
}
// Empirical count extrapolation; it has no access to agents, brood, nest or future events.
export function countFuture(
  observation: CountObservation,
  fit: CountFit,
  days: number,
  run: number,
): number {
  const rng = seededRandom(
    observation.seed + ":count-forecast:" + observation.tick + ":" + run,
  );
  let count = fit.current,
    elapsed = 0;
  while (elapsed < days) {
    const dt = Math.min(0.25, days - elapsed),
      residual = fit.residuals[Math.floor(rng.random() * fit.residuals.length)];
    count = Math.max(
      0,
      Math.min(LIMIT, count + fit.slope * dt + residual * Math.sqrt(dt)),
    );
    elapsed += dt;
  }
  return Math.round(count);
}
