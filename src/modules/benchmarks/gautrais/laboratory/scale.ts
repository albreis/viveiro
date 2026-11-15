import { modelMath } from "../../../../libs/model-math.ts";
import {
  MESH_BODY_UNITS,
  REFERENCE_WALK_SECONDS,
} from "../../../biology/worker-reference.ts";
import { TICKS_PER_DAY } from "../../../simulation/constants.js";
export interface PhysicalScale {
  millimetersPerUnit: number;
  secondsPerStep: number;
}
export function physicalScale(
  millimetersPerUnit: number,
  secondsPerStep: number,
): PhysicalScale {
  if (
    ![millimetersPerUnit, secondsPerStep].every(
      (v) => Number.isFinite(v) && v > 0,
    )
  )
    throw Error("Physical scales must be positive and finite");
  return { millimetersPerUnit, secondsPerStep };
}
export function modelLength(mm: number, scale: PhysicalScale) {
  physicalScale(scale.millimetersPerUnit, scale.secondsPerStep);
  if (!Number.isFinite(mm)) throw Error("Non-finite length");
  return mm / scale.millimetersPerUnit;
}
export function volumeCm3(units3: number, scale: PhysicalScale) {
  physicalScale(scale.millimetersPerUnit, scale.secondsPerStep);
  if (!Number.isFinite(units3) || units3 < 0) throw Error("Invalid volume");
  const mm = scale.millimetersPerUnit;
  return (units3 * mm * mm * mm) / 1000;
}
export function physicalDays(steps: number, scale: PhysicalScale) {
  physicalScale(scale.millimetersPerUnit, scale.secondsPerStep);
  if (!Number.isSafeInteger(steps) || steps < 0)
    throw Error("Invalid step count");
  return (steps * scale.secondsPerStep) / 86400;
}
export function eventProbability(ratePerSecond: number, seconds: number) {
  if (
    !Number.isFinite(ratePerSecond) ||
    ratePerSecond < 0 ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  )
    throw Error("Invalid event rate or duration");
  return -modelMath.expm1(-ratePerSecond * seconds);
}
export function legacyClockAudit(bodyMm: number) {
  const scale = physicalScale(bodyMm / MESH_BODY_UNITS, REFERENCE_WALK_SECONDS);
  return {
    ...scale,
    biologicalSecondsPerLegacyTick: 86400 / TICKS_PER_DAY,
    movementReferenceSeconds: REFERENCE_WALK_SECONDS,
    biologicalToMovementRatio: 86400 / TICKS_PER_DAY / REFERENCE_WALK_SECONDS,
    physicalClockIntegrated: false as const,
  };
}
