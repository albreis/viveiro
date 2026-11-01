import type { FamilyWorld } from "../colonies/types.ts";
import { ensureEcology } from "./initialize.ts";
import { updateAphids } from "./aphids.ts";
import { updateMimics } from "./mimics.ts";
export function updateEcology(w: FamilyWorld) {
  ensureEcology(w);
  updateAphids(w);
  updateMimics(w);
}
