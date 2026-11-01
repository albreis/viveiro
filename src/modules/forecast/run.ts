import { TICKS_PER_DAY } from "../simulation/constants.js";
import { createForecastWorld, summarizeForecast } from "./model.ts";
import { validateOptions } from "./types.ts";
import type {
  ForecastSnapshot,
  ForecastOptions,
  ForecastProgress,
  ForecastOutcome,
} from "./types.ts";
import type { ForecastWorld } from "./model.ts";
export class ForecastCancelled extends Error {}
export interface ForecastHooks {
  cancelled(): boolean;
  progress(value: ForecastProgress): void;
  pause?(): Promise<void>;
  now?(): number;
  observeStep?(world: ForecastWorld, step: number, run: number): void;
  createWorld?(snapshot: ForecastSnapshot, run: number): ForecastWorld;
}
// Cooperative scheduling bounds work by time slices; one indivisible model tick may exceed the slice.
export async function runForecast(
  snapshot: ForecastSnapshot,
  options: ForecastOptions,
  hooks: ForecastHooks,
): Promise<ForecastOutcome> {
  validateOptions(options);
  const now = hooks.now ?? (() => performance.now()),
    pause =
      hooks.pause ??
      (() => new Promise<void>((resolve) => setTimeout(resolve, 40)));
  const create = hooks.createWorld ?? createForecastWorld,
    start = now(),
    ticks = Math.round(options.days * TICKS_PER_DAY),
    values: number[] = [];
  let doneTicks = 0,
    activeMs = 0,
    maxSliceMs = 0;
  const check = () => {
    if (hooks.cancelled()) throw new ForecastCancelled();
  };
  const progress = (): ForecastProgress => ({
    doneTicks,
    totalTicks: ticks * options.runs,
    completedRuns: values.length,
    elapsedMs: now() - start,
    activeMs,
    maxSliceMs,
  });
  const finish = (complete: boolean): ForecastOutcome => ({
    result: summarizeForecast(values, options.days, snapshot.tick),
    progress: progress(),
    complete,
  });
  for (let run = 0; run < options.runs; run++) {
    check();
    let sliceStart = now();
    const w = create(snapshot, run);
    let step = 0;
    while (step < ticks) {
      check();
      if (activeMs + now() - sliceStart >= options.budgetMs) {
        activeMs += now() - sliceStart;
        maxSliceMs = Math.max(maxSliceMs, now() - sliceStart);
        return finish(false);
      }
      w.step();
      step++;
      doneTicks++;
      hooks.observeStep?.(w, step, run);
      if (step === ticks) values.push(w.population());
      const duration = now() - sliceStart;
      if (duration >= 8 || step === ticks) {
        activeMs += duration;
        maxSliceMs = Math.max(maxSliceMs, duration);
        hooks.progress(progress());
        if (activeMs >= options.budgetMs && values.length < options.runs)
          return finish(false);
        if (doneTicks < ticks * options.runs) {
          await pause();
          check();
        }
        sliceStart = now();
      }
    }
  }
  check();
  return finish(true);
}
