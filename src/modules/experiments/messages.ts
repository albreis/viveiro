import type { ExperimentResult } from "./result.ts";
export type ExperimentResponse =
  | { type: "progress"; tick: number; total: number }
  | { type: "result"; result: ExperimentResult }
  | { type: "error"; message: string };
