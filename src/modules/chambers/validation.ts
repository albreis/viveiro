import type { FoundingState } from "../founding/types.ts";
import type { ColonyAgent } from "../colony/types.ts";
const finite = (n: unknown) => typeof n === "number" && Number.isFinite(n);
const point = (p: unknown) =>
  !!p &&
  ["x", "y", "z"].every((k) => finite((p as Record<string, unknown>)[k]));
const reading = (p: unknown) =>
  !!p &&
  finite((p as { water: number }).water) &&
  (p as { water: number }).water >= 0 &&
  (p as { water: number }).water <= 1 &&
  finite((p as { temperature: number }).temperature);
export function validateChamberChoice(w: unknown, required: boolean): void {
  const world = w as {
      founding?: FoundingState;
      ants?: ColonyAgent[];
      tick: number;
    },
    f = world.founding,
    s = f?.survey;
  if (s) {
    if (
      !required ||
      s.version !== 1 ||
      !["explore", "return", "done"].includes(s.mode) ||
      ![s.steps, s.samples, s.since].every(
        (n) => Number.isSafeInteger(n) && n >= 0,
      ) ||
      s.since > world.tick ||
      !finite(s.heading) ||
      !point(s.origin) ||
      !point(s.best?.point) ||
      !reading(s.best) ||
      !finite(s.best.quality) ||
      s.best.quality < -1 ||
      s.best.quality > 1 ||
      !reading(s.last)
    )
      throw new Error("Sondagem local inválida.");
  } else if (
    required &&
    f &&
    !["weather", "flight", "landing", "dealate", "failed"].includes(f.phase)
  )
    throw new Error("Sondagem local ausente.");
  for (const a of world.ants ?? []) {
    const m = a.roomMemory;
    if (!m) continue;
    if (
      !required ||
      m.version !== 1 ||
      !Array.isArray(m.rooms) ||
      m.rooms.length > 8 ||
      new Set(m.rooms.map((r) => r.node)).size !== m.rooms.length ||
      m.rooms.some(
        (r) =>
          !Number.isSafeInteger(r.node) ||
          r.node < 0 ||
          !Number.isSafeInteger(r.tick) ||
          r.tick < 0 ||
          r.tick > world.tick ||
          !reading(r.reading),
      )
    )
      throw new Error("Memória de câmaras inválida.");
  }
}
