import {
  normalizeExperiment,
  parameterRanges,
  type ExperimentPlan,
  type ExperimentParameter,
} from "../experiments/plan.ts";
export interface SweepPlan {
  schema: "viveiro-sweep-v1";
  base: ExperimentPlan;
  parameter: ExperimentParameter;
  values: number[];
  replicates: number;
}
export function normalizeSweep(value: unknown): SweepPlan {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Varredura deve ser um objeto JSON.");
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).some(
      (k) =>
        !["schema", "base", "parameter", "values", "replicates"].includes(k),
    )
  )
    throw Error("Campo desconhecido na varredura.");
  if (
    v.schema !== "viveiro-sweep-v1" ||
    typeof v.parameter !== "string" ||
    !Object.hasOwn(parameterRanges, v.parameter)
  )
    throw Error("Schema ou parâmetro de varredura inválido.");
  const parameter = v.parameter as ExperimentParameter;
  const [min, max] = parameterRanges[parameter];
  if (
    !Array.isArray(v.values) ||
    v.values.length < 1 ||
    v.values.length > 50 ||
    v.values.some(
      (n) => typeof n !== "number" || !Number.isFinite(n) || n < min || n > max,
    )
  )
    throw Error(`Use 1–50 valores de ${parameter} entre ${min} e ${max}.`);
  const values = v.values.map((n) => (Object.is(n, -0) ? 0 : n)) as number[];
  if (new Set(values).size !== values.length)
    throw Error("Valores repetidos na varredura.");
  if (
    typeof v.replicates !== "number" ||
    !Number.isInteger(v.replicates) ||
    v.replicates < 1 ||
    v.replicates > 100 ||
    v.replicates * values.length > 1000
  )
    throw Error("Use 1–100 réplicas e no máximo 1.000 execuções.");
  return {
    schema: "viveiro-sweep-v1",
    base: normalizeExperiment(v.base),
    parameter,
    values,
    replicates: v.replicates,
  };
}
export function exampleSweep(): SweepPlan {
  return normalizeSweep({
    schema: "viveiro-sweep-v1",
    base: {
      schema: "viveiro-experiment-v1",
      seed: "VARREDURA-41",
      days: 1,
      startMode: "established",
      biologicalProfile: { schema: 1, id: "generic-demo", version: 1 },
    },
    parameter: "humidity",
    values: [40, 50, 60, 70, 80],
    replicates: 10,
  });
}
