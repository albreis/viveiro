import type { ColonyAgent, ColonyWorld } from "../colony/types.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import { colonyWorlds } from "../colonies/types.ts";
import { createSocialChemistry } from "./types.ts";
import { seededRandom } from "../../libs/seeded-random.ts";
import { geneValue } from "../genetics/genome.ts";
/** Four abstract channels, not identified hydrocarbon compounds or calibrated concentrations. */
export function colonyProfile(w: ColonyWorld) {
  const { random } = seededRandom(w.seed + ":odor:" + (w.colonyId || 1));
  const genome = w.genetics?.queen.genome;
  const loci = ["antennae", "efficiency", "care", "exploration"] as const;
  const values = loci.map(
      (g) =>
        0.15 + random() * 1.3 + (genome ? geneValue(genome, g) : 0.5) * 0.4,
    ),
    sum = values.reduce((a, b) => a + b, 0);
  return values.map((v) => v / sum);
}
export function odorDistance(a: number[], b: number[]) {
  return Math.sqrt(a.reduce((s, v, i) => s + (v - (b[i] || 0)) ** 2, 0));
}
export function prepareSocialChemistry(root: FamilyWorld) {
  root.socialChemistry ??= createSocialChemistry();
  const state = root.socialChemistry;
  for (const w of colonyWorlds(root)) {
    w.socialChemistry = state;
    const owner = String(w.colonyId || 1),
      profile = (state.profiles[owner] ??= colonyProfile(w));
    state.territory[owner] ??= Array(1040).fill(0);
    for (const ant of w.ants) {
      ant.health ??= 100;
      if (ant.odorMask && root.tick > ant.odorMask.until) {
        ant.odorMask.strength = Math.max(0, ant.odorMask.strength - 0.006);
        if (!ant.odorMask.strength) delete ant.odorMask;
      }
      const mask = ant.odorMask,
        strength = mask?.strength || 0;
      ant.bodyOdor = profile.map(
        (v, i) => v * (1 - strength) + (mask?.profile[i] || 0) * strength,
      );
    }
  }
}
export function recognizes(
  w: ColonyWorld,
  observer: ColonyAgent,
  other: ColonyAgent,
) {
  const profile = w.socialChemistry?.profiles[String(observer.colonyId || 1)];
  if (!profile || !other.bodyOdor)
    return (observer.colonyId || 1) === (other.colonyId || 1);
  return (
    odorDistance(profile, other.bodyOdor) <
    0.095 / (observer.pheromoneGain || 1)
  );
}
