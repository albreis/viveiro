import {
  BUHL_CURVE_HOURS,
  BUHL_GROUPS,
} from "../../src/modules/benchmarks/buhl-2005-data.ts";

export const checkTimes = BUHL_CURVE_HOURS.map((hour) => hour * 3600);
export const minimumReplicates = 5;
const groupSizes = BUHL_GROUPS.map((group) => group.workers);

const object = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

function positive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function projectSamples(samples: unknown) {
  if (!Array.isArray(samples)) throw Error("Série de amostras ausente.");
  const volumes = new Map<number, number>();
  let previous = -1;
  for (const raw of samples) {
    const sample = object(raw);
    const time = sample?.timeSeconds;
    const volume = sample?.voidVolumeCm3;
    if (
      typeof time !== "number" ||
      !Number.isInteger(time) ||
      time <= previous ||
      time > checkTimes.at(-1)! ||
      typeof volume !== "number" ||
      !Number.isFinite(volume) ||
      volume < 0
    )
      throw Error("Tempos ou volumes inválidos na série física.");
    volumes.set(time, volume);
    previous = time;
  }
  if (volumes.get(0) !== 0)
    throw Error("O vazio novo deve começar em zero na arena intacta.");
  return checkTimes.map((time) => {
    const volume = volumes.get(time);
    if (volume === undefined)
      throw Error("Falta a amostra física em " + time / 3600 + " h.");
    return volume;
  });
}

export function parseBuhlPhysicalSeries(input: unknown) {
  const series = object(input);
  const geometry = object(series?.geometryMm);
  if (
    !series ||
    series.schema !== "viveiro-buhl-arena-series-v1" ||
    series.protocol !== "disco-fixo-2005" ||
    series.timeUnit !== "s" ||
    series.volumeUnit !== "cm3" ||
    geometry?.arenaDiameter !== 500 ||
    geometry?.sandDiameter !== 200 ||
    geometry?.sandThickness !== 5 ||
    typeof series.sourceFingerprint !== "string" ||
    !/^[a-f0-9]{64}$/.test(series.sourceFingerprint) ||
    !positive(series.secondsPerTick) ||
    !Array.isArray(series.runs) ||
    series.runs.length > 300
  )
    throw Error("Use séries da arena física, em segundos e cm³, com a fonte.");

  const keys = new Set<string>();
  const groups = groupSizes.map((workers) => ({
    workers,
    runs: [] as { seed: string; volumes: number[] }[],
  }));
  for (const raw of series.runs) {
    const run = object(raw);
    const seed = run?.seed;
    const group = groups.find((g) => g.workers === run?.workers);
    if (
      !run ||
      !group ||
      typeof seed !== "string" ||
      !/^[ -~]{1,128}$/.test(seed.trim())
    )
      throw Error("Grupo ou seed inválidos.");
    const key = group.workers + "/" + seed.trim();
    if (keys.has(key)) throw Error("Seed repetida dentro do grupo.");
    keys.add(key);
    group.runs.push({ seed, volumes: projectSamples(run.samples) });
  }
  if (groups.some((group) => group.runs.length < minimumReplicates))
    throw Error("Exija ao menos cinco sementes por grupo antes de comparar.");
  return {
    groups,
    secondsPerTick: series.secondsPerTick,
    sourceFingerprint: series.sourceFingerprint,
  };
}
