export type PredictionMethod = "complete" | "counts" | "persistence";
export interface PredictionPoint {
  median: number;
  low: number;
  high: number;
}
export interface EvaluationRow {
  seed: string;
  originTick: number;
  days: number;
  truth: number;
  current: number;
  complete: PredictionPoint;
  counts: PredictionPoint;
  persistence: PredictionPoint;
  fullActiveMs: number;
  fullElapsedMs: number;
  countActiveMs: number;
  countElapsedMs: number;
}
export interface ErrorSummary {
  method: PredictionMethod;
  days: number;
  n: number;
  mae: number;
  rmse: number;
  bias: number;
  coverage: number;
  width: number;
}
export function summarizeErrors(
  rows: readonly EvaluationRow[],
): ErrorSummary[] {
  const summaries: ErrorSummary[] = [];
  for (const days of [...new Set(rows.map((r) => r.days))].sort(
    (a, b) => a - b,
  )) {
    const subset = rows.filter((r) => r.days === days);
    for (const method of ["complete", "counts", "persistence"] as const) {
      let absolute = 0,
        squared = 0,
        bias = 0,
        inside = 0,
        width = 0;
      for (const row of subset) {
        const prediction = row[method],
          error = prediction.median - row.truth;
        if (
          ![
            row.truth,
            prediction.median,
            prediction.low,
            prediction.high,
          ].every(Number.isFinite) ||
          prediction.low > prediction.high
        )
          throw new Error("Resultado de avaliação inválido.");
        absolute += Math.abs(error);
        squared += error * error;
        bias += error;
        inside += Number(
          row.truth >= prediction.low && row.truth <= prediction.high,
        );
        width += prediction.high - prediction.low;
      }
      summaries.push({
        method,
        days,
        n: subset.length,
        mae: absolute / subset.length,
        rmse: Math.sqrt(squared / subset.length),
        bias: bias / subset.length,
        coverage: inside / subset.length,
        width: width / subset.length,
      });
    }
  }
  return summaries;
}
