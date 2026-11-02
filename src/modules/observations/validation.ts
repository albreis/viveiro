import {
  DAILY_LIMIT,
  DAILY_TICKS,
  type DailyPoint,
  type DailySeries,
} from "./types.ts";
const counts: (keyof DailyPoint)[] = [
  "population",
  "brood",
  "eggs",
  "larvae",
  "pupae",
  "colonies",
];
const readings: (keyof DailyPoint)[] = [
  "airTemperatureC",
  "soilTemperatureC",
  "oxygenPercent",
  "carbonDioxidePercent",
];
export function validateDaily(
  value: unknown,
  tick: number,
): asserts value is DailySeries | undefined {
  if (value === undefined) return; // Legacy snapshots have no invented observations.
  const s = value as DailySeries;
  const fail = () => {
    throw Error("Série diária inválida no experimento.");
  };
  if (
    !s ||
    s.version !== 1 ||
    !Number.isSafeInteger(s.startedTick) ||
    s.startedTick < 0 ||
    s.startedTick > tick ||
    !Number.isSafeInteger(s.discarded) ||
    s.discarded < 0 ||
    !Array.isArray(s.points) ||
    s.points.length > DAILY_LIMIT
  )
    fail();
  let previous = -1;
  for (const p of s.points) {
    if (
      !p ||
      !Number.isSafeInteger(p.tick) ||
      p.tick % DAILY_TICKS !== 0 ||
      p.tick < s.startedTick ||
      p.tick <= previous ||
      p.tick > tick ||
      typeof p.modelVersion !== "string" ||
      !/^\d+\.\d+\.\d+$/.test(p.modelVersion) ||
      counts.some((k) => !Number.isSafeInteger(p[k]) || Number(p[k]) < 0) ||
      !Number.isFinite(p.food) ||
      p.food < 0 ||
      readings.some(
        (k) =>
          p[k] !== null && (typeof p[k] !== "number" || !Number.isFinite(p[k])),
      ) ||
      p.eggs + p.larvae + p.pupae !== p.brood ||
      p.colonies < 1 ||
      p.colonies > 4
    )
      fail();
    previous = p.tick;
  }
}
