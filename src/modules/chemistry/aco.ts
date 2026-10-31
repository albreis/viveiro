import { weightedSample } from "../../libs/probability.ts";
export interface AcoParameters {
  alpha?: number;
  beta?: number;
  exploration?: number;
}
export function sampleACO(
  pheromones: readonly number[],
  heuristics: readonly number[],
  random: () => number,
  p: AcoParameters = {},
) {
  if (pheromones.length !== heuristics.length)
    throw new RangeError("Sensores ACO incompatíveis.");
  const alpha = Math.max(0, Math.min(5, p.alpha ?? 1.4)),
    beta = Math.max(0, Math.min(5, p.beta ?? 2));
  const epsilon = Math.max(0, Math.min(1, p.exploration ?? 0.05));
  const log = pheromones.map(
    (v, i) =>
      alpha * Math.log(Math.max(1e-6, v)) +
      beta * Math.log(Math.max(1e-6, heuristics[i])),
  );
  const max = Math.max(...log),
    weights = log.map((v) => Math.exp(v - max));
  const total = weights.reduce((a, b) => a + b, 0);
  return weightedSample(
    weights.map((v) => ((1 - epsilon) * v) / total + epsilon / weights.length),
    random,
  );
}
