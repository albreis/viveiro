import { BUHL_DISK_MM } from "./geometry.ts";
import type { BuhlGroupSize } from "./placement.ts";

export const BUHL_INDIVIDUAL = Object.freeze({
  speedMmPerSecond: 15.05,
  pelletSeconds: 42.04,
  pelletMicrograms: 1690,
  digRatePerSecond: 0.0283,
  dropRatePerSecond: 0.188,
  pickupPerContact: 0.102,
});

export type BuhlMechanism = "local" | "edge-follow" | "edge-recruit";

export interface BuhlLabPlan {
  mechanism: BuhlMechanism;
  contactAccess: number;
  seed: string;
  workers: BuhlGroupSize;
  durationSeconds: number;
  sampleEverySeconds: number;
  tickMilliseconds: number;
  pitchMm: number;
  separationMm: number;
  dryDensityMgPerMm3: number;
  digRatePerSecond: number;
  pickupPerContact: number;
}

const keys = new Set([
  "seed",
  "mechanism",
  "contactAccess",
  "workers",
  "durationSeconds",
  "sampleEverySeconds",
  "tickMilliseconds",
  "pitchMm",
  "separationMm",
  "dryDensityMgPerMm3",
  "digRatePerSecond",
  "pickupPerContact",
]);

export function normalizeBuhlLabPlan(input: unknown): BuhlLabPlan {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Informe um plano da arena física.");
  const raw = input as Record<string, unknown>;
  if (Object.keys(raw).some((key) => !keys.has(key)))
    throw Error("Opção desconhecida no plano da arena.");
  const number = (key: string, min: number, max: number, fallback?: number) => {
    const value = Object.hasOwn(raw, key) ? raw[key] : fallback;
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < min ||
      value > max
    )
      throw Error("Valor inválido para " + key + ".");
    return value;
  };
  const { seed, workers, mechanism = "local" } = raw;
  if (
    mechanism !== "local" &&
    mechanism !== "edge-follow" &&
    mechanism !== "edge-recruit"
  )
    throw Error("Mecanismo da arena desconhecido.");
  if (
    typeof seed !== "string" ||
    seed !== seed.trim() ||
    !/^[ -~]{1,128}$/.test(seed)
  )
    throw Error("Informe uma seed com até 128 caracteres.");
  if (workers !== 50 && workers !== 100 && workers !== 200)
    throw Error("Use 50, 100 ou 200 operárias.");
  const durationSeconds = number("durationSeconds", 1, 259200, 259200);
  const sampleEverySeconds = number("sampleEverySeconds", 1, 259200, 1200);
  const tickMilliseconds = number("tickMilliseconds", 10, 250, 50);
  const pitchMm = number("pitchMm", 0.5, 5, 0.8);
  if (
    !Number.isInteger(durationSeconds) ||
    !Number.isInteger(sampleEverySeconds) ||
    !Number.isInteger(tickMilliseconds) ||
    1000 % tickMilliseconds !== 0 ||
    !Number.isInteger(BUHL_DISK_MM.arenaDiameter / pitchMm) ||
    BUHL_INDIVIDUAL.speedMmPerSecond * tickMilliseconds > pitchMm * 1000
  )
    throw Error(
      "Use segundos inteiros e um passo que caiba em uma célula da grade.",
    );
  if (Math.ceil(durationSeconds / sampleEverySeconds) > 10_000)
    throw Error("O plano excede o limite de 10 mil intervalos de coleta.");
  const contactAccess = number("contactAccess", 0, 1, 1);
  if (mechanism === "local" && contactAccess !== 1)
    throw Error("Acesso à face requer seguimento ou recrutamento.");
  return {
    seed,
    workers,
    mechanism,
    contactAccess,
    durationSeconds,
    sampleEverySeconds,
    tickMilliseconds,
    pitchMm,
    separationMm: number("separationMm", pitchMm * Math.SQRT2, 30),
    dryDensityMgPerMm3: number("dryDensityMgPerMm3", 0.1, 5),
    digRatePerSecond: number(
      "digRatePerSecond",
      0,
      10,
      BUHL_INDIVIDUAL.digRatePerSecond,
    ),
    pickupPerContact: number(
      "pickupPerContact",
      0,
      1,
      BUHL_INDIVIDUAL.pickupPerContact,
    ),
  };
}

export const chancePerTick = (rate: number, seconds: number) =>
  -Math.expm1(-rate * seconds);
