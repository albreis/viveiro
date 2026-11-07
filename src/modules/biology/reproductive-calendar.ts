import { TICKS_PER_DAY } from "../simulation/constants.js";
import { resolveBiologicalProfile } from "./catalog.ts";
import type { BiologicalReference } from "./types.ts";

interface CalendarWorld {
  biologicalProfile?: BiologicalReference;
  tick: number;
}
type Window = readonly [start: number, end: number];
export interface ReproductiveCalendar {
  readonly yearDays: number;
  readonly initialDay: number;
  readonly laying: Window;
  readonly alates: Window;
  readonly flight: Window;
  readonly restFactor: number;
}

export function reproductiveCalendar(world: CalendarWorld) {
  return world.biologicalProfile
    ? resolveBiologicalProfile(world.biologicalProfile).reproductiveCalendar
    : undefined;
}
function dayOfYear(world: CalendarWorld, calendar: ReproductiveCalendar) {
  return (
    (calendar.initialDay + Math.floor(world.tick / TICKS_PER_DAY)) %
    calendar.yearDays
  );
}
function contains([start, end]: Window, day: number) {
  return day >= start && day < end;
}
export function reproductiveWindow(
  world: CalendarWorld,
  window: "laying" | "alates" | "flight",
) {
  const calendar = reproductiveCalendar(world);
  return !calendar || contains(calendar[window], dayOfYear(world, calendar));
}
export function reproductiveRest(world: CalendarWorld) {
  const calendar = reproductiveCalendar(world);
  if (!calendar) return 1;
  const day = dayOfYear(world, calendar);
  return day < calendar.laying[0] || day >= calendar.flight[1]
    ? calendar.restFactor
    : 1;
}
