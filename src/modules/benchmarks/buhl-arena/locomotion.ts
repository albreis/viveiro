/** Explicit assay interventions; never a multiplier of excavated volume. */
export interface BuhlLocomotionPlan {
  walkingSource: "profile-temperature" | "buhl-observed";
  soilLoadFactor: number;
}

export const BUHL_WALKING_OBSERVATION = Object.freeze({
  meanMmPerSecond: 15.05,
  sdMmPerSecond: 4.38,
  n: 100,
  context: "unobstructed walking outside sand disk; not loaded tunnel speed",
  doi: "10.1007/s00265-004-0906-2",
});

export function normalizeBuhlLocomotion(input: unknown): BuhlLocomotionPlan {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Informe as intervenções explícitas de locomoção.");
  const raw = input as Record<string, unknown>;
  if (
    Object.keys(raw).some(
      (k) => !["walkingSource", "soilLoadFactor"].includes(k),
    )
  )
    throw Error("Opção desconhecida na locomoção.");
  const { walkingSource, soilLoadFactor } = raw;
  if (
    walkingSource !== "profile-temperature" &&
    walkingSource !== "buhl-observed"
  )
    throw Error("Fonte de caminhada desconhecida.");
  if (
    typeof soilLoadFactor !== "number" ||
    !Number.isFinite(soilLoadFactor) ||
    soilLoadFactor <= 0 ||
    soilLoadFactor > 1
  )
    throw Error("O fator de carga deve estar entre zero exclusivo e um.");
  return { walkingSource, soilLoadFactor };
}
