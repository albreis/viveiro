import type { ClimateReading } from "./types.ts";
import { CHAMBER_PARAMETERS as p } from "./types.ts";
/** Water is pore saturation; this utility is an explicit uncalibrated preference. */
export function chamberQuality(
  r: ClimateReading,
  role: "queen" | "brood",
): number {
  const water = role === "queen" ? p.queenWater : p.broodWater;
  return Math.max(
    0,
    1 -
      Math.abs(r.water - water) / 0.65 -
      Math.abs(r.temperature - p.temperature) / 25,
  );
}
