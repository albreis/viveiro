import { workerReference, workerSizeFactor } from "./worker-reference.ts";
import type { AgentState } from "../navigation/types.ts";
import { resolveBiologicalProfile } from "./catalog.ts";
import { speciesOf } from "../landscape/species.ts";
import type { Plant } from "../landscape/types.ts";
import type { BiologicalReference } from "./types.ts";

export function seedForaging(host: {
  biologicalProfile?: BiologicalReference;
}) {
  return (
    host.biologicalProfile !== undefined &&
    resolveBiologicalProfile(host.biologicalProfile).forageModel ===
      "seed-trails"
  );
}

export function producesSeeds(plant: Plant) {
  const species = speciesOf(plant);
  return species !== "moss" && species !== "fern";
}

export function seedDetectionRange(
  host: { biologicalProfile?: BiologicalReference },
  ant: AgentState,
  range: number,
) {
  const reference = workerReference(host, ant);
  return reference?.seedForaging
    ? range *
        workerSizeFactor(reference, ant, reference.seedForaging.searchFactor)
    : range;
}
