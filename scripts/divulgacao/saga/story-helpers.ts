import { C, type Series } from "./charts.ts";
import type { Group } from "./types.ts";
export const end = (v: [number, number][]) => v.at(-1)![1];
export const series = (
  g: Group,
  key: "control" | "fatigue" | "morphology" | "access",
  name: string,
  color: string,
): Series => ({ name, color, points: g[key] });
export const ref = (g: Group): Series => ({
  name: "Buhl 2001",
  points: g.reference,
  color: C.gold,
  dash: true,
});
