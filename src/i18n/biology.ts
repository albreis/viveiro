import type { BiologicalProfile } from "../modules/biology/types.ts";
import type { MessageKey } from "./catalogs.ts";
import { t } from "./runtime.ts";
export function profileLabel(profile: BiologicalProfile): string {
  const id =
    profile.id === "lab-lniger-2024"
      ? profile.id
      : profile.id + "@" + profile.version;
  return t(("biology.profile." + id) as MessageKey);
}
export function profileDescription(profile: BiologicalProfile): string {
  return t(
    ("biology.description." + profile.id + "@" + profile.version) as MessageKey,
  );
}
