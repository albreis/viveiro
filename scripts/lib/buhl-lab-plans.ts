import { normalizeBuhlLabPlan } from "../../src/modules/benchmarks/buhl-arena/settings.ts";

export function plansForBuhlLab(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Informe um plano de lote da arena.");
  const raw = value as Record<string, unknown>;
  const { groups, seeds, settings } = raw;
  if (
    Object.keys(raw).some(
      (key) => !["groups", "seeds", "settings"].includes(key),
    ) ||
    !Array.isArray(groups) ||
    !groups.length ||
    groups.length > 3 ||
    !Array.isArray(seeds) ||
    !seeds.length ||
    seeds.length > 20 ||
    new Set(groups).size !== groups.length ||
    new Set(seeds).size !== seeds.length ||
    !settings ||
    typeof settings !== "object" ||
    Array.isArray(settings) ||
    Object.hasOwn(settings, "workers") ||
    Object.hasOwn(settings, "seed")
  )
    throw Error("Informe grupos e seeds distintos e uma configuração comum.");
  const plans = seeds.flatMap((seed: unknown) =>
    groups.map((workers: unknown) =>
      normalizeBuhlLabPlan({ ...settings, seed, workers }),
    ),
  );
  const samples = plans.reduce(
    (sum, plan) =>
      sum + Math.ceil(plan.durationSeconds / plan.sampleEverySeconds) + 1,
    0,
  );
  if (samples > 10000)
    throw Error(
      "O lote excede 10 mil amostras. Aumente o intervalo de coleta.",
    );
  return plans;
}
