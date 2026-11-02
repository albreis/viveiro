import { DAILY_LIMIT, DAILY_TICKS, type ObservationWorld } from "./types.ts";
import { measureDaily } from "./measure.ts";
/** Called after a complete model tick; retains endpoint samples, not daily averages. */
export function recordDaily(w: ObservationWorld) {
  const series = (w.dailyObservations ??= {
    version: 1,
    startedTick: w.tick,
    discarded: 0,
    points: [],
  });
  if (w.tick % DAILY_TICKS !== 0) return;
  const point = measureDaily(w);
  if (series.points.at(-1)?.tick === w.tick)
    series.points[series.points.length - 1] = point;
  else series.points.push(point);
  if (series.points.length > DAILY_LIMIT) {
    series.points.shift();
    series.discarded++;
  }
}
