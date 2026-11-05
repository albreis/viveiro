import { modelMath } from "../../../libs/model-math.ts";

export interface BuhlMicroclimatePlan {
  temperatureC: number;
  initialSandWaterFraction: number;
  airRelativeHumidity: number;
  airflowIndex: number;
  drying: boolean;
}

export const BUHL_CLIMATE_ASSUMPTIONS = Object.freeze({
  neutralSandWaterFraction: 0.08,
  sandWaterTimeSensitivity: 0.5,
  dryAirStillHalfLifeSeconds: 28_800,
  airflowDryingGain: 2,
});

const limits = {
  temperatureC: [16, 30],
  initialSandWaterFraction: [0, 0.2],
  airRelativeHumidity: [0, 1],
  airflowIndex: [0, 1],
} as const;

export function normalizeBuhlMicroclimate(
  input: unknown,
): BuhlMicroclimatePlan {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Informe as condições explícitas do microclima de Buhl.");
  const raw = input as Record<string, unknown>;
  if (
    Object.keys(raw).some(
      (key) => key !== "drying" && !Object.hasOwn(limits, key),
    )
  )
    throw Error("Opção desconhecida no microclima de Buhl.");
  const read = (key: keyof typeof limits) => {
    const [min, max] = limits[key];
    const value = raw[key];
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < min ||
      value > max
    )
      throw Error("Valor inválido no microclima de Buhl: " + key);
    return value;
  };
  if (typeof raw.drying !== "boolean")
    throw Error("Informe se a areia pode secar.");
  return {
    temperatureC: read("temperatureC"),
    initialSandWaterFraction: read("initialSandWaterFraction"),
    airRelativeHumidity: read("airRelativeHumidity"),
    airflowIndex: read("airflowIndex"),
    drying: raw.drying,
  };
}

/** Linear interpolation of walking medians from Challet et al. 2005. */
export function walkingMmPerSecond(temperatureC: number): number {
  return temperatureC <= 25
    ? 8 + ((temperatureC - 16) * (11.4 - 8)) / 9
    : 11.4 + ((temperatureC - 25) * (15 - 11.4)) / 5;
}

export class BuhlMicroclimate {
  readonly walkingMmPerSecond: number;
  readonly #initialWater: number;
  readonly #decayPerTick: number;

  constructor(plan: BuhlMicroclimatePlan, secondsPerTick: number) {
    this.walkingMmPerSecond = walkingMmPerSecond(plan.temperatureC);
    this.#initialWater = plan.initialSandWaterFraction;
    const { dryAirStillHalfLifeSeconds, airflowDryingGain } =
      BUHL_CLIMATE_ASSUMPTIONS;
    this.#decayPerTick = plan.drying
      ? (Math.LN2 *
          secondsPerTick *
          (1 - plan.airRelativeHumidity) *
          (1 + airflowDryingGain * plan.airflowIndex)) /
        dryAirStillHalfLifeSeconds
      : 0;
  }

  waterFraction(tick: number): number {
    return this.#decayPerTick === 0
      ? this.#initialWater
      : this.#initialWater * modelMath.exp(-this.#decayPerTick * tick);
  }

  pelletTimeFactor(tick: number): number {
    const { neutralSandWaterFraction, sandWaterTimeSensitivity } =
      BUHL_CLIMATE_ASSUMPTIONS;
    const relativeDifference =
      Math.abs(this.waterFraction(tick) - neutralSandWaterFraction) /
      neutralSandWaterFraction;
    return 1 + sandWaterTimeSensitivity * relativeDifference;
  }

  sample(tick: number) {
    return {
      sandWaterFraction: this.waterFraction(tick),
      walkingMmPerSecond: this.walkingMmPerSecond,
      pelletTimeFactor: this.pelletTimeFactor(tick),
    };
  }
}
