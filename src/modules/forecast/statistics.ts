import type { ForecastResult } from "./types.ts";
export function summarizeForecast(
  values: number[],
  days: number,
  tick: number,
): ForecastResult | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b),
    runs = sorted.length;
  return {
    low: sorted[Math.floor((runs - 1) * 0.1)],
    high: sorted[Math.ceil((runs - 1) * 0.9)],
    median: sorted[Math.floor(runs / 2)],
    runs,
    days,
    tick,
    values: sorted,
  };
}
