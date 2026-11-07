import { resolveBiologicalProfile } from "./catalog.ts";
import type { BiologicalReference } from "./types.ts";
import type { AgentState } from "../navigation/types.ts";
import { MESH_BODY_UNITS, workerReference } from "./worker-reference.ts";

type ReferenceHost = { biologicalProfile?: BiologicalReference };
const QUEEN_MESH = 0.984;
const MALE_MESH = 0.45;

function founderScale(host: ReferenceHost, ant: AgentState) {
  if (
    !host.biologicalProfile ||
    !["queen", "gyne", "male"].includes(ant.kind ?? "")
  )
    return;
  const profile = resolveBiologicalProfile(host.biologicalProfile);
  const sizes = profile.founderBodyMm;
  if (!sizes || !profile.workerReference) return;
  const male = ant.kind === "male";
  return {
    desired: male ? sizes.male : sizes.queen,
    nominal:
      ((male ? MALE_MESH : QUEEN_MESH) * profile.workerReference.bodyMm) /
      MESH_BODY_UNITS,
  };
}

export function referenceFounderScale(host: ReferenceHost, ant: AgentState) {
  const size = founderScale(host, ant);
  return size && size.desired / size.nominal;
}

export function modeledLength(host: ReferenceHost, ant: AgentState) {
  const nominal =
    workerReference(host, ant)?.bodyMm ?? founderScale(host, ant)?.nominal;
  return nominal === undefined ? undefined : nominal * (ant.bodyScale ?? 1);
}
