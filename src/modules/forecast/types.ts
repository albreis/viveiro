export interface ForecastSnapshot {
  seed: string;
  tick: number;
  [key: string]: unknown;
}
export interface ForecastOptions {
  runs: number;
  days: number;
  budgetMs: number;
  observation?: "complete" | "counts";
}
export interface ForecastResult {
  low: number;
  high: number;
  median: number;
  runs: number;
  days: number;
  tick: number;
  values: number[];
}
export interface ForecastProgress {
  doneTicks: number;
  totalTicks: number;
  completedRuns: number;
  elapsedMs: number;
  activeMs: number;
  maxSliceMs: number;
}
export interface ForecastOutcome {
  result: ForecastResult | null;
  progress: ForecastProgress;
  complete: boolean;
  observation?: "complete" | "counts";
  observedPoints?: number;
  warning?: string;
}
export type ForecastRequest =
  | {
      type: "start";
      id: number;
      snapshot: ForecastSnapshot;
      observation?: import("./observations.ts").CountObservation;
      options: ForecastOptions;
    }
  | { type: "cancel"; id: number };
export type ForecastResponse =
  | { id: number; type: "progress"; progress: ForecastProgress }
  | { id: number; type: "result"; outcome: ForecastOutcome }
  | { id: number; type: "error"; error: string };
export type ForecastStatus =
  "idle" | "running" | "complete" | "budget" | "cancelled" | "error";
export interface ForecastState {
  status: ForecastStatus;
  scenario?: string;
  tick?: number;
  progress?: ForecastProgress;
  result?: ForecastResult | null;
  error?: string;
  observation?: "complete" | "counts";
  observedPoints?: number;
  warning?: string;
}
export const defaultForecastOptions: ForecastOptions = {
  runs: 18,
  days: 3,
  budgetMs: 30000,
  observation: "complete",
};
export function validateOptions(options: ForecastOptions): void {
  if (
    (options.observation !== undefined &&
      options.observation !== "complete" &&
      options.observation !== "counts") ||
    !Number.isInteger(options.runs) ||
    options.runs < 2 ||
    options.runs > 32 ||
    !Number.isFinite(options.days) ||
    options.days < 0.01 ||
    options.days > 10 ||
    !Number.isFinite(options.budgetMs) ||
    options.budgetMs < 1 ||
    options.budgetMs > 120000
  )
    throw new Error("Orçamento ou horizonte inválido.");
}
