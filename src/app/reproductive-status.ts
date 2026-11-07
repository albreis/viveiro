import {
  reproductiveCalendar,
  reproductiveWindow,
} from "../modules/biology/reproductive-calendar.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import { t } from "../i18n/runtime.ts";
export function reproductiveStatus(world: FamilyWorld) {
  const calendar = reproductiveCalendar(world);
  if (!calendar) return "";
  const phase = reproductiveWindow(world, "flight")
    ? "flight"
    : reproductiveWindow(world, "alates")
      ? "alates"
      : reproductiveWindow(world, "laying")
        ? "laying"
        : "rest";
  return t(("biology.calendar." + phase) as "biology.calendar.flight");
}
