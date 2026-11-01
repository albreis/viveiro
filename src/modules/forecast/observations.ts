import { LIMIT, TICKS_PER_DAY } from "../simulation/constants.js";
export interface CountPoint {
  tick: number;
  population: number;
}
export interface CountObservation {
  kind: "counts";
  seed: string;
  tick: number;
  counts: CountPoint[];
}
export interface CountSource {
  seed: string;
  tick: number;
  ants: readonly unknown[];
  colonies?: { ants: readonly unknown[] }[];
  history?: readonly CountPoint[];
}
export function observeCounts(source: CountSource): CountObservation {
  const population =
    source.ants.length +
    (source.colonies ?? []).reduce(
      (sum, colony) => sum + colony.ants.length,
      0,
    );
  return normalizeCounts({
    kind: "counts",
    seed: source.seed,
    tick: source.tick,
    counts: [
      ...(source.history ?? [])
        .filter(
          (p) =>
            p.tick <= source.tick &&
            p.tick >= Math.max(0, source.tick - 3 * TICKS_PER_DAY),
        )
        .map((p) => ({
          tick: p.tick,
          population: p.population,
        })),
      { tick: source.tick, population },
    ],
  });
}
export function normalizeCounts(value: CountObservation): CountObservation {
  if (
    value.kind !== "counts" ||
    typeof value.seed !== "string" ||
    !Number.isSafeInteger(value.tick) ||
    value.tick < 0 ||
    !Array.isArray(value.counts) ||
    value.counts.length > 1000
  )
    throw new Error("Observações de contagem inválidas.");
  const unique = new Map<number, number>();
  for (const p of value.counts) {
    if (!Number.isSafeInteger(p.tick))
      throw new Error("Instante do censo inválido.");
    if (
      p.tick > value.tick ||
      p.tick < Math.max(0, value.tick - 3 * TICKS_PER_DAY)
    )
      continue;
    if (
      !Number.isInteger(p.population) ||
      p.population < 0 ||
      p.population > LIMIT
    )
      throw new Error("Censo inválido.");
    unique.set(p.tick, p.population);
  }
  const counts = [...unique]
    .sort((a, b) => a[0] - b[0])
    .map(([tick, population]) => ({ tick, population }));
  if (!counts.length || counts.at(-1)?.tick !== value.tick)
    throw new Error("Falta a contagem atual.");
  return { kind: "counts", seed: value.seed, tick: value.tick, counts };
}
export function isCountObservation(
  source: { [key: string]: unknown } | CountObservation,
): source is CountObservation {
  return source.kind === "counts";
}
