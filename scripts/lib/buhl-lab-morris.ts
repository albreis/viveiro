import { seededRandom } from "../../src/libs/seeded-random.ts";
import type { BuhlLabRun } from "../../src/modules/benchmarks/buhl-arena/run.ts";
import { normalizeBuhlLabPlan } from "../../src/modules/benchmarks/buhl-arena/settings.ts";
import { elementaryStatistics } from "../../src/modules/sensitivity/analyze.ts";

const ranges = {
  dryDensityMgPerMm3: [1.2, 1.8],
  digRatePerSecond: [0.01415, 0.0566],
  pickupPerContact: [0.051, 0.153],
} as const;
type Parameter = keyof typeof ranges;
const dimensions = Object.keys(ranges) as Parameter[];
const levels = 4;
const delta = 2;
const metrics = ["voidVolumeCm3", "removedSoilCm3", "fullPellets"] as const;

export function buhlMorrisDesign(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Informe um plano Morris da arena.");
  const raw = input as Record<string, unknown>;
  const { seed, trajectories = 4, replicates = 2, settings } = raw;
  if (
    Object.keys(raw).some(
      (key) =>
        !["seed", "trajectories", "replicates", "settings"].includes(key),
    ) ||
    typeof seed !== "string" ||
    !/^[A-Za-z0-9-]{1,64}$/.test(seed) ||
    typeof trajectories !== "number" ||
    !Number.isInteger(trajectories) ||
    trajectories < 2 ||
    trajectories > 10 ||
    typeof replicates !== "number" ||
    !Number.isInteger(replicates) ||
    replicates < 1 ||
    replicates > 5 ||
    !settings ||
    typeof settings !== "object" ||
    Array.isArray(settings) ||
    Object.hasOwn(settings, "seed") ||
    dimensions.some((key) => Object.hasOwn(settings, key))
  )
    throw Error(
      "Plano Morris inválido. Informe seed, 2–10 trajetórias e 1–5 réplicas.",
    );
  const { random } = seededRandom(seed + ":buhl-morris-v1");
  const points = Array.from({ length: trajectories }, (_, index) => {
    const signs = dimensions.map(() => (random() < 0.5 ? -1 : 1));
    const grid = signs.map(
      (sign) => Math.floor(random() * delta) + (sign < 0 ? delta : 0),
    );
    const order = dimensions.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return Array.from({ length: dimensions.length + 1 }, (_, point) => {
      const j = order[point - 1];
      if (point > 0) grid[j] += signs[j] * delta;
      const normalized = grid.map((step) => step / (levels - 1));
      const parameters = Object.fromEntries(
        dimensions.map((key, i) => {
          const [lo, hi] = ranges[key];
          return [key, lo + (hi - lo) * normalized[i]];
        }),
      );
      const plans = Array.from({ length: replicates }, (_, replica) =>
        normalizeBuhlLabPlan({
          ...settings,
          ...parameters,
          seed: seed + "-T" + (index + 1) + "-R" + (replica + 1),
        }),
      );
      return { changed: point ? dimensions[j] : null, normalized, plans };
    });
  });
  const plans = points.flatMap((trajectory) =>
    trajectory.flatMap((point) => point.plans),
  );
  if (
    plans.some((plan) => plan.durationSeconds > 21600) ||
    plans.reduce(
      (sum, plan) =>
        sum + Math.ceil(plan.durationSeconds / plan.sampleEverySeconds) + 1,
      0,
    ) > 10000
  )
    throw Error("Use até 6 h por rodada e 10 mil amostras na triagem Morris.");
  return {
    schema: "viveiro-buhl-morris-v1",
    seed,
    trajectories,
    replicates,
    levels,
    ranges,
    points,
    plans,
  };
}

export function buhlMorrisAnalysis(
  design: ReturnType<typeof buhlMorrisDesign>,
  runs: BuhlLabRun[],
) {
  if (runs.length !== design.plans.length)
    throw Error("Morris requer todas as rodadas.");
  return Object.fromEntries(
    metrics.map((metric) => {
      const values = Object.fromEntries(
        dimensions.map((key) => [key, [] as number[]]),
      ) as Record<Parameter, number[]>;
      let cursor = 0;
      for (const trajectory of design.points) {
        let previous = 0;
        for (const [index, point] of trajectory.entries()) {
          const mean =
            point.plans.reduce((sum, plan) => {
              const run = runs[cursor++];
              if (run.seed !== plan.seed || run.workers !== plan.workers)
                throw Error("Rodada fora da ordem do desenho Morris.");
              return sum + run.samples.at(-1)![metric];
            }, 0) / point.plans.length;
          if (point.changed) {
            const j = dimensions.indexOf(point.changed);
            const step =
              point.normalized[j] - trajectory[index - 1].normalized[j];
            values[point.changed].push((mean - previous) / step);
          }
          previous = mean;
        }
      }
      return [
        metric,
        dimensions
          .map((parameter) => ({
            parameter,
            ...elementaryStatistics(values[parameter]),
            effects: values[parameter],
          }))
          .sort((a, b) => (b.muStar ?? 0) - (a.muStar ?? 0)),
      ];
    }),
  );
}
