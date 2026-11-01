import { semiclaustralRecords } from "./semiclaustral-records.ts";
import { seasonalRecords } from "./seasonal-records.ts";
import { developmentRecords } from "./development-records.ts";
import { sealingRecords } from "./sealing-records.ts";
import { maternalRecords } from "./maternal-records.ts";
import { biologicalProfiles, latestBiologicalProfiles } from "./profiles.ts";
import { UnsupportedBiologicalProfile } from "./errors.ts";
import type { BiologicalProfile, BiologicalReference } from "./types.ts";
import { modelRecords } from "./model-records.ts";
import { proposedRecords } from "./proposed-records.ts";
import { studyRecords } from "./study-records.ts";
export { biologicalProfiles } from "./profiles.ts";
export const biologicalParameters = Object.freeze(
  [
    ...modelRecords,
    ...proposedRecords,
    ...studyRecords,
    ...maternalRecords,
    ...sealingRecords,
    ...developmentRecords,
    ...seasonalRecords,
    ...semiclaustralRecords,
  ].map((record) =>
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
export function latestProfileReference(
  id = "generic-demo",
): BiologicalReference {
  const profile = latestBiologicalProfiles().find((p) => p.id === id);
  if (!profile) throw new UnsupportedBiologicalProfile();
  return profileReference(profile.id, profile.version);
}
export function prepareBiologicalExperiment(
  id: string | BiologicalReference,
  params: Record<string, number>,
) {
  if (typeof id !== "string") resolveBiologicalProfile(id);
  const reference =
      typeof id === "string"
        ? profileReference(id)
        : profileReference(id.id, id.version),
    profile = resolveBiologicalProfile(reference);
  return {
    params: { ...params, ...profile.climate },
    biologicalProfile: reference,
  };
}

export function biologicalProfileKey(reference: {
  id: string;
  version: number;
}): string {
  return reference.id + "@" + reference.version;
}
export function biologicalReferenceFromKey(key: string): BiologicalReference {
  const split = key.lastIndexOf("@");
  if (split < 0) return profileReference(key);
  return profileReference(key.slice(0, split), Number(key.slice(split + 1)));
}
