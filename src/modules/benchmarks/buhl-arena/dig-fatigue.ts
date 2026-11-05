import { modelMath } from "../../../libs/model-math.ts";

export const BUHL_DIG_FATIGUE = Object.freeze({
  workHalfResponseSeconds: 3600,
  recoveryHalfLifeSeconds: 86_400,
});

export class BuhlDigFatigue {
  #workDebtSeconds = 0;
  #lastWorkTick = 0;

  private readonly secondsPerTick: number;

  constructor(secondsPerTick: number) {
    this.secondsPerTick = secondsPerTick;
  }

  #remainingDebt(tick: number): number {
    const restSeconds = (tick - this.#lastWorkTick) * this.secondsPerTick;
    return this.#workDebtSeconds === 0
      ? 0
      : this.#workDebtSeconds *
          modelMath.exp(
            (-Math.LN2 * restSeconds) /
              BUHL_DIG_FATIGUE.recoveryHalfLifeSeconds,
          );
  }

  recordWork(tick: number, effortTicks: number): void {
    this.#workDebtSeconds =
      this.#remainingDebt(tick) + effortTicks * this.secondsPerTick;
    this.#lastWorkTick = tick;
  }

  readiness(tick: number): number {
    return (
      1 /
      (1 + this.#remainingDebt(tick) / BUHL_DIG_FATIGUE.workHalfResponseSeconds)
    );
  }
}
