import { profileReference } from "../biology/catalog.ts";
import type { BiologicalReference } from "../biology/types.ts";
import {
  baseParameterRanges,
  parameterRanges,
  type ExperimentParameter,
  type ExperimentParameters,
} from "./parameters.ts";
export { parameterRanges, type ExperimentParameter } from "./parameters.ts";
export interface ExperimentPlan {
  schema: "viveiro-experiment-v1";
  seed: string;
  days: number;
  startMode: "founding" | "established";
  biologicalProfile: BiologicalReference;
  parameters: ExperimentParameters;
}
const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Configuração deve ser um objeto JSON.");
  return value as Record<string, unknown>;
};
function keys(value: Record<string, unknown>, allowed: string[]) {
  for (const key of Object.keys(value))
    if (!allowed.includes(key)) throw Error("Campo desconhecido: " + key);
}
/** Canonical order and explicit defaults make the same plan portable between runtimes. */
export function normalizeExperiment(value: unknown): ExperimentPlan {
  const v = object(value);
  keys(v, [
    "schema",
    "seed",
    "days",
    "startMode",
    "biologicalProfile",
    "parameters",
  ]);
  if (v.schema !== "viveiro-experiment-v1")
    throw Error("Schema de experimento não suportado.");
  const seed = v.seed === undefined ? "SEMENTE-42" : v.seed,
    days = v.days === undefined ? 1 : v.days,
    startMode = v.startMode === undefined ? "founding" : v.startMode;
  if (
    typeof seed !== "string" ||
    !seed.length ||
    seed.length > 128 ||
    /[\u0000-\u001f]/u.test(seed)
  )
    throw Error("Seed deve ter de 1 a 128 caracteres, sem controles.");
  if (
    typeof days !== "number" ||
    !Number.isInteger(days) ||
    days < 0 ||
    days > 365
  )
    throw Error("Escolha de 0 a 365 dias inteiros.");
  if (startMode !== "founding" && startMode !== "established")
    throw Error("Modo inicial inválido.");
  const ref = object(
    v.biologicalProfile === undefined
      ? { schema: 1, id: "generic-demo", version: 5 }
      : v.biologicalProfile,
  );
  keys(ref, ["schema", "id", "version"]);
  if (
    ref.schema !== 1 ||
    typeof ref.id !== "string" ||
    typeof ref.version !== "number"
  )
    throw Error("Perfil deve informar schema1, id e versão.");
  const biologicalProfile = profileReference(ref.id, ref.version);
  const supplied = object(v.parameters === undefined ? {} : v.parameters);
  keys(supplied, Object.keys(parameterRanges));
  const parameters = {} as ExperimentPlan["parameters"];
  for (const key of Object.keys(parameterRanges) as ExperimentParameter[]) {
    if (!Object.hasOwn(baseParameterRanges, key) && supplied[key] === undefined)
      continue;
    const [min, max, fallback] = parameterRanges[key],
      n = supplied[key] === undefined ? fallback : supplied[key];
    if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max)
      throw Error(`${key}: use um número entre ${min} e ${max}.`);
    parameters[key] = Object.is(n, -0) ? 0 : n;
  }
  return {
    schema: "viveiro-experiment-v1",
    seed,
    days,
    startMode,
    biologicalProfile,
    parameters,
  };
}
export const exampleExperiment = () =>
  normalizeExperiment({ schema: "viveiro-experiment-v1" });
