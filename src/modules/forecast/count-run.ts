import { fitCounts, countFuture } from "./count-model.ts";
import { normalizeCounts } from "./observations.ts";
import { summarizeForecast } from "./statistics.ts";
import { validateOptions } from "./types.ts";
import { ForecastCancelled } from "./run.ts";
import type { CountObservation } from "./observations.ts";
import type {
  ForecastOptions,
  ForecastOutcome,
  ForecastProgress,
} from "./types.ts";
import type { ForecastHooks } from "./run.ts";
export async function runCountForecast(
  input: CountObservation,
  options: ForecastOptions,
  hooks: ForecastHooks,
): Promise<ForecastOutcome> {
  validateOptions(options);
  const now = hooks.now ?? (() => performance.now()),
    start = now(),
    observation = normalizeCounts(input),
    fit = fitCounts(observation),
    values: number[] = [];
  let activeMs = now() - start,
    maxSliceMs = activeMs;
  const progress = (): ForecastProgress => ({
    doneTicks: values.length,
    totalTicks: options.runs,
    completedRuns: values.length,
    elapsedMs: now() - start,
    activeMs,
    maxSliceMs,
  });
  for (let run = 0; run < options.runs; run++) {
    if (activeMs >= options.budgetMs) break;
    if (hooks.cancelled()) throw new ForecastCancelled();
    const before = now();
    values.push(countFuture(observation, fit, options.days, run));
    const duration = now() - before;
    activeMs += duration;
    maxSliceMs = Math.max(maxSliceMs, duration);
    hooks.progress(progress());
    if (activeMs >= options.budgetMs) break;
    if (run + 1 < options.runs)
      await (hooks.pause?.() ??
        new Promise<void>((resolve) => setTimeout(resolve, 0)));
  }
  if (hooks.cancelled()) throw new ForecastCancelled();
  return {
    complete: values.length === options.runs,
    result: summarizeForecast(values, options.days, observation.tick),
    progress: progress(),
    observation: "counts",
    observedPoints: fit.points,
    warning: fit.sufficient
      ? "Extrapolação por contagem; não simula túneis ou genética."
      : "Histórico insuficiente: persistência, sem estimativa de incerteza.",
  };
}
