import { DEATH_CAUSES, type SurvivalStats, type LifeState } from "./types.ts";
export function validateSurvival(value: unknown, required: boolean): void {
  if (!required) return;
  const w = value as {
      tick: number;
      deaths: number;
      colony?: { survival?: SurvivalStats };
      ants?: Array<{ age: number; health?: number; life?: LifeState }>;
    },
    s = w.colony?.survival;
  const positive = (n: unknown) =>
      typeof n === "number" && Number.isFinite(n) && n >= 0,
    integer = (n: unknown) => positive(n) && Number.isSafeInteger(n),
    fail = () => {
      throw new Error("Estado de saúde ou mortalidade inválido.");
    };
  if (
    !s ||
    s.version !== 1 ||
    !integer(s.initialDeaths) ||
    !integer(s.challenges) ||
    !s.causes ||
    Object.keys(s.causes).length !== DEATH_CAUSES.length ||
    !DEATH_CAUSES.every((k) => integer(s.causes[k])) ||
    w.deaths !==
      s.initialDeaths + Object.values(s.causes).reduce((n, x) => n + x, 0) ||
    !Array.isArray(w.ants)
  )
    return fail();
  for (const a of w.ants) {
    const l = a.life;
    if (
      !l ||
      l.version !== 1 ||
      ![
        l.lastAge,
        l.ageHazard,
        l.ageBudget,
        l.infection,
        l.diseaseHazard,
        l.diseaseBudget,
        l.repairFood,
        a.health,
      ].every(positive) ||
      l.ageBudget === 0 ||
      l.diseaseBudget === 0 ||
      l.infection > 1 ||
      a.health! > 100 ||
      !integer(l.lastTick) ||
      l.lastTick > w.tick ||
      l.lastAge > a.age ||
      l.deathRecorded !== undefined
    )
      return fail();
  }
}
