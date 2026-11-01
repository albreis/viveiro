import type { ColonyWorld } from "../colony/types.ts";
export function validateSeason(value: unknown, required: boolean): void {
  const w = value as ColonyWorld,
    s = w.colony?.season;
  if (!s) {
    if (required) throw new Error("Memória sazonal ausente.");
    return;
  }
  if (
    !required ||
    s.version !== 1 ||
    !["active", "preparing", "dormant", "resuming"].includes(s.phase) ||
    ![
      s.since,
      s.activeTicks,
      s.coldCue,
      s.chillTicks,
      s.warmTicks,
      s.cycles,
    ].every((x) => Number.isSafeInteger(x) && x >= 0) ||
    s.since > w.tick ||
    !Number.isFinite(s.lastTemperature) ||
    !Number.isFinite(s.lastPhotoperiod) ||
    s.lastPhotoperiod < 0 ||
    s.lastPhotoperiod > 24
  )
    throw new Error("Memória sazonal inconsistente.");
}
