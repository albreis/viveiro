import {
  normalizeParameters,
  type ExperimentParameters,
} from "../experiments/parameters.ts";
import { profileReference } from "../biology/catalog.ts";
import type { BiologicalReference } from "../biology/types.ts";
export interface ParameterProfile {
  schema: "viveiro-parameter-profile-v1";
  catalogVersion: 1;
  id: string;
  version: number;
  label: string;
  biologicalProfile: BiologicalReference;
  parameters: ExperimentParameters;
}
export function normalizeParameterProfile(value: unknown): ParameterProfile {
  const p = value as Partial<ParameterProfile> | null;
  if (
    !p ||
    p.schema !== "viveiro-parameter-profile-v1" ||
    p.catalogVersion !== 1 ||
    typeof p.id !== "string" ||
    !/^[a-z][a-z0-9-]{0,47}$/.test(p.id) ||
    !Number.isSafeInteger(p.version) ||
    p.version! < 1 ||
    p.version! > 1000000 ||
    typeof p.label !== "string" ||
    !p.label.trim() ||
    p.label.length > 80 ||
    /[\u0000-\u001f]/.test(p.label) ||
    !p.parameters
  )
    throw Error(
      "Perfil de parâmetros inválido (catálogo 1, id e versão positiva).",
    );
  for (const key of Object.keys(p))
    if (
      ![
        "schema",
        "catalogVersion",
        "id",
        "version",
        "label",
        "biologicalProfile",
        "parameters",
      ].includes(key)
    )
      throw Error("Campo desconhecido no perfil: " + key);
  const ref = p.biologicalProfile;
  if (
    !ref ||
    ref.schema !== 1 ||
    typeof ref.id !== "string" ||
    typeof ref.version !== "number" ||
    Object.keys(ref).some((k) => !["schema", "id", "version"].includes(k))
  )
    throw Error("Referência biológica do perfil inválida.");
  return {
    schema: "viveiro-parameter-profile-v1",
    catalogVersion: 1,
    id: p.id,
    version: p.version!,
    label: p.label.trim(),
    biologicalProfile: profileReference(ref.id, ref.version),
    parameters: normalizeParameters(p.parameters),
  };
}
export const parameterProfileKey = (p: ParameterProfile) =>
  p.id + "@" + p.version;
export const profileJson = (p: ParameterProfile) =>
  JSON.stringify(normalizeParameterProfile(p), null, 2) + "\n";
