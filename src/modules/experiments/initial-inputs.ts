import { validateOptionalInputs } from "./parameters.ts";
interface InitialWorld {
  params: Record<string, number>;
  food: number;
  landscape: { rainPulse: number };
}
/** Explicit boundary conditions, before stores and the first observation; never maternal credits. */
export function applyInitialInputs(w: InitialWorld): void {
  validateOptionalInputs(w.params);
  if (w.params.initialFood !== undefined) w.food = w.params.initialFood;
  if (w.params.initialRainPulse !== undefined)
    w.landscape.rainPulse = w.params.initialRainPulse;
}
