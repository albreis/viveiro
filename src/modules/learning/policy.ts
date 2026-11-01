import type { RouteOption } from "../navigation/local-route-policy.ts";
import type { TinyBrain } from "./types.ts";
import { forward } from "./network.ts";
export function localFeatures(o: RouteOption, loaded = false) {
  return [
    Math.max(-1, Math.min(1, o.signal * 20)),
    Math.min(1, (o.visits ?? (o.visited ? 1 : 0)) / 3),
    o.backtrack ? 1 : 0,
    o.goalVisible ? 1 : 0,
    o.comfort ?? 1,
    loaded ? 1 : 0,
  ];
}
export function neuralChoice(
  brain: TinyBrain,
  features: number[][],
  random: () => number,
  epsilon = 0.05,
) {
  if (!features.length) return -1;
  if (random() < epsilon)
    return Math.min(
      features.length - 1,
      Math.floor(random() * features.length),
    );
  const values = features.map((x) => forward(brain, x).value),
    max = Math.max(...values),
    ties = values.flatMap((v, i) => (Math.abs(v - max) < 1e-9 ? [i] : []));
  return ties[Math.min(ties.length - 1, Math.floor(random() * ties.length))];
}
