import type { FoundingWorld } from "../founding/types.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { createFoundressForaging } from "./types.ts";
export function initializeFoundressForaging(w: FoundingWorld): void {
  if (
    w.founding &&
    resolveBiologicalProfile(w.biologicalProfile).foundation === "semiclaustral"
  )
    w.founding.foraging ??= createFoundressForaging();
}
