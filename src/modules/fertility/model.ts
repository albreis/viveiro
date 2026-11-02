import { modelMath } from "../../libs/model-math.ts";
import { resolveBiologicalProfile } from "../biology/catalog.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { FERTILITY_PARAMETERS as p } from "./types.ts";
export const fertilityEnabled = (w: Pick<ColonyWorld, "biologicalProfile">) =>
  resolveBiologicalProfile(w.biologicalProfile).fertilityModel ===
  "finite-demo";
function storeMating(
  w: ColonyWorld,
  male: ColonyAgent,
  origin: "contact" | "scenario",
): boolean {
  const s = w.colony.fertility;
  if (
    !s ||
    !male.genome ||
    male.genome.ploidy !== 1 ||
    s.pools.length >= p.maxMates ||
    s.pools.some((x) => x.maleId === male.id)
  )
    return false;
  s.pools.push({
    maleId: male.id,
    genome: structuredClone(male.genome),
    tick: w.tick,
    origin,
    received: p.creditsPerMating,
    viable: p.creditsPerMating,
    used: 0,
    lost: 0,
  });
  return true;
}
export function initializeFertility(w: ColonyWorld): void {
  if (!fertilityEnabled(w)) return;
  w.colony.fertility = {
    version: 1,
    lastTick: w.tick,
    pools: [],
    femaleAttempts: 0,
    fertilized: 0,
    failed: 0,
    intentionalMales: 0,
  };
  if (!w.founding) {
    const male = w.ants.find((a) => a.kind === "male");
    if (male) storeMating(w, male, "scenario");
  }
}
/** One mating occasion; no reservoir recharge after landing. */
export function registerMating(
  w: ColonyWorld,
  queen: ColonyAgent,
  male: ColonyAgent,
): boolean {
  if (
    !w.colony.fertility ||
    w.founding?.phase !== "flight" ||
    queen.kind !== "queen" ||
    male.kind !== "male" ||
    !queen.airborne ||
    !male.airborne ||
    !w.ants.includes(queen) ||
    !w.ants.includes(male) ||
    (queen.health ?? 100) <= 0 ||
    (male.health ?? 100) <= 0 ||
    modelMath.hypot(
      queen.x - male.x,
      (queen.y ?? 0) - (male.y ?? 0),
      queen.z - male.z,
    ) >= 0.3
  )
    return false;
  return storeMating(w, male, "contact");
}
export function updateFertility(w: ColonyWorld): void {
  const s = w.colony.fertility;
  if (!s || w.tick <= s.lastTick) return;
  const fraction = -modelMath.expm1(
    (-p.decayPerDay * (w.tick - s.lastTick)) / 100,
  );
  for (const pool of s.pools) {
    const loss = pool.viable * fraction;
    pool.viable -= loss;
    pool.lost += loss;
  }
  s.lastTick = w.tick;
}
export function canFertilize(w: ColonyWorld): boolean {
  return (
    !w.colony.fertility ||
    w.colony.fertility.pools.some((x) => x.viable >= p.usePerFemale)
  );
}
