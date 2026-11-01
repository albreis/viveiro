import { UnsupportedBiologicalProfile } from "./errors.ts";
import type { BiologicalProfile, BiologicalReference } from "./types.ts";
import { modelRecords } from "./model-records.ts";
import { proposedRecords } from "./proposed-records.ts";
import { studyRecords, REFERENCE_AIR } from "./study-records.ts";
export const biologicalProfiles: readonly BiologicalProfile[] = Object.freeze([
  Object.freeze({
    id: "generic-demo",
    version: 1,
    label: "Genérico · demonstração",
    modelSpecies: null,
    referenceSpecies: null,
    foundation: "claustral",
    cocoon: "unspecified",
    seasonality: "unmodelled",
    climate: Object.freeze({}),
    description:
      "Modelo genérico acelerado; castas/ecologia combinadas, sem espécie calibrada.",
  }),
  Object.freeze({
    id: "lab-lniger-2024",
    version: 1,
    label: "Ar de referência · L. niger (2024)",
    modelSpecies: null,
    referenceSpecies: "Lasius niger",
    foundation: "claustral",
    cocoon: "unspecified",
    seasonality: "unmodelled",
    climate: REFERENCE_AIR,
    description:
      "Só inicia o ar em 21 °C e 80% conforme condição de laboratório. Biologia e solo continuam genéricos; não reproduz o experimento.",
  }),
]);
export const biologicalParameters = Object.freeze(
  [...modelRecords, ...proposedRecords, ...studyRecords].map((record) =>
    Object.freeze({
      ...record,
      range: record.range
        ? (Object.freeze([...record.range]) as readonly [number, number])
        : undefined,
    }),
  ),
);
export function profileReference(
  id = "generic-demo",
  version = 1,
): BiologicalReference {
  const profile = biologicalProfiles.find(
    (p) => p.id === id && p.version === version,
  );
  if (!profile) throw new UnsupportedBiologicalProfile();
  return { schema: 1, id: profile.id, version: profile.version };
}
export function resolveBiologicalProfile(value?: unknown): BiologicalProfile {
  if (value === undefined) return biologicalProfiles[0];
  if (!value || typeof value !== "object")
    throw new Error("Referência biológica inválida.");
  const ref = value as Partial<BiologicalReference>;
  if (typeof ref.schema === "number" && ref.schema !== 1)
    throw new UnsupportedBiologicalProfile();
  if (
    ref.schema !== 1 ||
    typeof ref.id !== "string" ||
    !Number.isInteger(ref.version)
  )
    throw new Error("Referência biológica inválida.");
  const canonical = profileReference(ref.id, ref.version);
  return biologicalProfiles.find(
    (p) => p.id === canonical.id && p.version === canonical.version,
  )!;
}
export function prepareBiologicalExperiment(
  id: string,
  params: Record<string, number>,
) {
  const reference = profileReference(id),
    profile = resolveBiologicalProfile(reference);
  return {
    params: { ...params, ...profile.climate },
    biologicalProfile: reference,
  };
}
