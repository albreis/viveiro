import type { LaboratorySetupOptions } from "./setup.ts";
export interface LaboratoryPreparationPlan extends Omit<
  LaboratorySetupOptions,
  "workers"
> {
  schema: "viveiro-world-laboratory-geometry-plan-v1";
  groups: (50 | 100 | 200)[];
}
export function laboratoryPreparationPlan(
  value: unknown,
): LaboratoryPreparationPlan {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Invalid laboratory plan");
  const p = value as LaboratoryPreparationPlan;
  if (
    Object.keys(p).sort().join() !==
      "coverThicknessMm,groups,humidityPercent,schema,seed,temperatureC" ||
    p.schema !== "viveiro-world-laboratory-geometry-plan-v1" ||
    typeof p.seed !== "string" ||
    !/^[A-Z0-9:_-]{1,64}$/.test(p.seed) ||
    !Array.isArray(p.groups) ||
    p.groups.length < 1 ||
    p.groups.length > 3 ||
    p.groups.some((v) => ![50, 100, 200].includes(v)) ||
    new Set(p.groups).size !== p.groups.length ||
    !Number.isFinite(p.temperatureC) ||
    p.temperatureC < -10 ||
    p.temperatureC > 50 ||
    !Number.isFinite(p.humidityPercent) ||
    p.humidityPercent < 0 ||
    p.humidityPercent > 100 ||
    !Number.isFinite(p.coverThicknessMm) ||
    p.coverThicknessMm <= 0 ||
    p.coverThicknessMm >= 5
  )
    throw Error("Invalid laboratory plan");
  return { ...p, groups: [...p.groups] };
}
