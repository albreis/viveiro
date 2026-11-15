export interface WorldObservationPlan {
  seed: string;
  groups: number[];
  ticks: number;
  sampleEvery: number;
  sectionsY: number[];
  pitches: number[];
}
export function normalizeWorldObservationPlan(
  value: unknown,
): WorldObservationPlan {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Expected an observation plan");
  const raw = value as Record<string, unknown>,
    keys = ["seed", "groups", "ticks", "sampleEvery", "sectionsY", "pitches"];
  if (
    Object.keys(raw).length !== keys.length ||
    Object.keys(raw).some((key) => !keys.includes(key))
  )
    throw Error("Unknown or missing observation plan key");
  if (
    typeof raw.seed !== "string" ||
    !/^[A-Z0-9-]{1,64}$/.test(raw.seed) ||
    !Number.isInteger(raw.ticks) ||
    Number(raw.ticks) < 1 ||
    Number(raw.ticks) > 1000 ||
    !Number.isInteger(raw.sampleEvery) ||
    Number(raw.sampleEvery) < 1 ||
    Number(raw.ticks) % Number(raw.sampleEvery) !== 0
  )
    throw Error("Invalid bounded observation plan");
  const list = (value: unknown) => {
    if (
      !Array.isArray(value) ||
      value.length < 1 ||
      value.length > 3 ||
      new Set(value).size !== value.length ||
      !value.every((x) => typeof x === "number" && Number.isFinite(x))
    )
      throw Error("Invalid observation list");
    return value as number[];
  };
  const groups = list(raw.groups),
    pitches = list(raw.pitches),
    sectionsY = list(raw.sectionsY);
  if (
    !groups.every((n) => [50, 100, 200].includes(n)) ||
    !pitches.every((p) => [0.2, 0.25, 0.5].includes(p)) ||
    !sectionsY.every((y) => y < 0 && y > -4.2)
  )
    throw Error("Unsupported observation groups/sections/pitches");
  return {
    seed: raw.seed,
    groups: [...groups],
    pitches: [...pitches],
    sectionsY: [...sectionsY],
    ticks: Number(raw.ticks),
    sampleEvery: Number(raw.sampleEvery),
  };
}
