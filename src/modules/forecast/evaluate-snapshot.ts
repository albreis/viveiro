import { World } from "../simulation/world.js";
import { allAnts } from "../colonies/types.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import { TICKS_PER_DAY } from "../simulation/constants.js";
import { observeCounts } from "./observations.ts";
import type { CountSource } from "./observations.ts";
import { runCountForecast } from "./count-run.ts";
import { runForecast, ForecastCancelled } from "./run.ts";
import { summarizeForecast } from "./statistics.ts";
import type { ForecastSnapshot } from "./types.ts";
import type { ForecastHooks } from "./run.ts";
import type { EvaluationRow } from "./evaluation-metrics.ts";
export interface EvaluationOptions {
  horizons: number[];
  runs: number;
  budgetMs: number;
}
// Paired origins: each method sees the same present and is scored against an independent true continuation.
export async function evaluateSnapshot(
  snapshot: ForecastSnapshot,
  options: EvaluationOptions,
  hooks: ForecastHooks,
): Promise<EvaluationRow[]> {
  const horizons = [...new Set(options.horizons)].sort((a, b) => a - b);
  if (
    !horizons.length ||
    horizons.some(
      (d) =>
        !Number.isFinite(d) ||
        d < 0.01 ||
        d > 10 ||
        !Number.isInteger(d * TICKS_PER_DAY),
    )
  )
    throw new Error("Horizontes de avaliação inválidos.");
  const points = new Map(
    horizons.map((d) => [
      d * TICKS_PER_DAY,
      { days: d, values: [] as number[], truth: 0 },
    ]),
  );
  const maxDays = horizons.at(-1)!,
    pause =
      hooks.pause ??
      (() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
  const outcome = await runForecast(
    snapshot,
    { runs: options.runs, days: maxDays, budgetMs: options.budgetMs },
    {
      ...hooks,
      observeStep: (world, step) => {
        points.get(step)?.values.push(world.population());
      },
    },
  );
  if (!outcome.complete)
    throw new Error(
      "Ensaio interrompido por orçamento: não publicar métricas de amostra selecionada.",
    );
  const reference = World.restore(snapshot);
  let slice = performance.now();
  for (let step = 1; step <= maxDays * TICKS_PER_DAY; step++) {
    if (hooks.cancelled()) throw new ForecastCancelled();
    reference.step();
    const point = points.get(step);
    if (point) point.truth = allAnts(reference as FamilyWorld).length;
    if (performance.now() - slice >= 20) {
      await pause();
      slice = performance.now();
    }
  }
  const observation = observeCounts(snapshot as unknown as CountSource),
    current = observation.counts.at(-1)!.population,
    rows: EvaluationRow[] = [];
  for (const point of points.values()) {
    const partial = await runCountForecast(
      observation,
      { runs: options.runs, days: point.days, budgetMs: options.budgetMs },
      hooks,
    );
    if (!partial.complete || !partial.result)
      throw new Error("Ensaio parcial incompleto.");
    rows.push({
      seed: snapshot.seed,
      originTick: snapshot.tick,
      days: point.days,
      truth: point.truth,
      current,
      complete: summarizeForecast(point.values, point.days, snapshot.tick)!,
      counts: partial.result,
      persistence: { median: current, low: current, high: current },
      fullActiveMs: outcome.progress.activeMs,
      fullElapsedMs: outcome.progress.elapsedMs,
      countActiveMs: partial.progress.activeMs,
      countElapsedMs: partial.progress.elapsedMs,
    });
  }
  return rows;
}
