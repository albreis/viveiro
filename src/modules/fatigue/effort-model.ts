import { modelMath } from "../../libs/model-math.ts";
import type { Vec3 } from "../navigation/types.ts";
import { motionWork } from "./motion-work.ts";

export const EFFORT_PROFILE = "generic-effort-demo";
export const MAX_DEBT = 20;
const HALF_LIFE_TICKS = 150;
const HALF_READINESS_DEBT = 8;
const REFERENCE_STEP = 0.05;

export interface EffortState {
  debt: number;
  tick: number;
}

export interface EffortClimate {
  temperature: number;
  water?: number;
}

const fraction = (value: number) => Math.max(0, Math.min(1, value));

export function climateCost({ temperature, water }: EffortClimate) {
  const thermal = fraction(Math.abs(temperature - 24) / 16);
  const moisture =
    water === undefined ? 0 : fraction(Math.abs(water - 0.45) / 0.55);
  return 1 + 0.35 * (thermal + moisture);
}

export function locomotionEffort(
  step: Vec3 | null,
  normalY: number,
  load: number,
  detour: boolean,
  windX = 0,
  windZ = 0,
) {
  const adhesion = 0.35 * (1 - Math.max(-1, Math.min(1, normalY)));
  if (!step) return motionWork(0.2, load) * (1 + adhesion);
  const length = modelMath.hypot(step.x, step.y, step.z);
  if (length === 0) return 0;
  const climb =
    (1.5 * Math.max(step.y, 0) + 0.35 * Math.max(-step.y, 0)) / length;
  const headwind = fraction(-(step.x * windX + step.z * windZ) / (4 * length));
  return (
    motionWork(length / REFERENCE_STEP, load) *
    (1 + climb + adhesion + 0.5 * headwind + (detour ? 0.35 : 0))
  );
}

export function recoveredDebt(state: EffortState | undefined, tick: number) {
  return state
    ? state.debt *
        modelMath.exp(
          (-Math.LN2 * Math.max(0, tick - state.tick)) / HALF_LIFE_TICKS,
        )
    : 0;
}

export function digReadiness(state: EffortState | undefined, tick: number) {
  return 1 / (1 + recoveredDebt(state, tick) / HALF_READINESS_DEBT);
}

export function spendEffort(
  state: EffortState | undefined,
  tick: number,
  work: number,
): EffortState {
  return { debt: Math.min(MAX_DEBT, recoveredDebt(state, tick) + work), tick };
}
