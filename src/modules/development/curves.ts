import { DEVELOPMENT_PARAMETERS as p } from "./types.ts";
/** Bounded cardinal curve chosen for demonstration, not fitted to an ant species. */
export function thermalRate(temperature: number): number {
  if (!Number.isFinite(temperature)) return 0;
  return Math.max(
    0,
    Math.min(
      1,
      (temperature - p.minimum) / (p.optimum - p.minimum),
      (p.maximum - temperature) / (p.maximum - p.optimum),
    ),
  );
}
/** Soil pore water is an environmental proxy, not chamber relative humidity. */
export function waterRate(water: number): number {
  if (!Number.isFinite(water)) return 0;
  return Math.max(
    0,
    Math.min(
      1,
      (water - p.waterDry) / (p.waterComfortDry - p.waterDry),
      (p.waterWet - water) / (p.waterWet - p.waterComfortWet),
    ),
  );
}
export function stageSchedule(age: number) {
  return age < 0.35
    ? { name: "egg", span: 0.35, end: 0.35, days: p.eggDays }
    : age < 0.9
      ? { name: "larva", span: 0.55, end: 0.9, days: p.larvaDays }
      : { name: "pupa", span: 0.4, end: 1.3, days: p.pupaDays };
}
