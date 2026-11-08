import { resolveBiologicalProfile } from "../biology/catalog.ts";
import type { SoilWorld } from "./types.ts";

/** Pinned by the saved biological profile; older worlds retain their rules. */
export const geometricDigAccess = (
  world: Pick<SoilWorld, "biologicalProfile">,
) =>
  world.biologicalProfile !== undefined &&
  resolveBiologicalProfile(world.biologicalProfile).excavationAccess ===
    "geometry-v1";
