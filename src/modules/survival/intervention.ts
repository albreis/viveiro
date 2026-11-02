import type { FamilyWorld } from "../colonies/types.ts";
import { colonyWorlds } from "../colonies/types.ts";
import { SURVIVAL_PARAMETERS as p } from "./types.ts";
export function survivalIntervention(
  w: FamilyWorld,
  type: string,
  value: unknown,
): boolean | null {
  if (type !== "healthChallenge") return null;
  if (typeof value !== "number" || !Number.isSafeInteger(value)) return false;
  for (const c of colonyWorlds(w)) {
    const a = c.ants.find((a) => a.id === value);
    if (!a?.life || !c.colony.survival || (a.health ?? 100) <= 0) continue;
    a.life.infection = Math.min(1, a.life.infection + p.challengeDose);
    c.colony.survival.challenges++;
    w.log(
      "Desafio experimental de infecção aplicado à habitante #" + a.id + ".",
      "danger",
    );
    return true;
  }
  return false;
}
