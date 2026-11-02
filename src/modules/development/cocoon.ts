import { takeStock } from "../stores/ledger.ts";
import type { Brood, ColonyWorld } from "../colony/types.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import { isClaustral, spendReserve } from "../founding/types.ts";
import { addWaste } from "../colony/waste.ts";
import { COCOON_COST } from "./types.ts";
export { COCOON_COST } from "./types.ts";
export function initializeCocoon(w: ColonyWorld, b: Brood): void {
  if (resolveBiologicalProfile(w.biologicalProfile).cocoon === "present")
    b.cocoon = { version: 1, paid: 0, built: false };
}
/** A silk budget must be paid before a larva enters the pupal stage. */
export function finishCocoon(w: ColonyWorld, b: Brood): void {
  const c = b.cocoon;
  if (!c || c.built || b.age < 0.9) return;
  const needed = Math.max(0, COCOON_COST - c.paid),
    amount = isClaustral(w)
      ? spendReserve(w, "larvae", needed)
      : Math.min(w.food, needed);
  if (!isClaustral(w)) takeStock(w, amount, "silk", b.node);
  c.paid += amount;
  if (c.paid >= COCOON_COST - 1e-10) c.built = true;
  else b.age = 0.9 - 1e-6;
}
export function discardCocoon(w: ColonyWorld, b: Brood): void {
  if (b.cocoon?.built)
    addWaste(w, {
      x: b.x,
      y: b.y,
      z: b.z,
      mass: 0.005,
      kind: "cocoon",
      stored: false,
    });
}
export function validateCocoons(value: unknown, present: boolean): void {
  if (!Array.isArray(value)) return;
  for (const b of value as Brood[]) {
    const c = b.cocoon;
    if (!c) {
      if (present) throw new Error("Registro do casulo ausente.");
      continue;
    }
    if (
      !present ||
      c.version !== 1 ||
      typeof c.built !== "boolean" ||
      !Number.isFinite(c.paid) ||
      c.paid < 0 ||
      c.paid > COCOON_COST + 1e-9 ||
      (c.built && (c.paid < COCOON_COST - 1e-9 || b.age < 0.9)) ||
      (!c.built && b.age >= 0.9)
    )
      throw new Error("Registro do casulo inconsistente.");
  }
}
