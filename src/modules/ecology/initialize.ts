import { seedForaging } from "../biology/seed-foraging.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import type { EcologyState } from "./types.ts";
import { seededRandom } from "../../libs/seeded-random.ts";
import { colonyProfile } from "../social-chemistry/profile.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { speciesOf } from "../landscape/species.ts";
/** Independent seed stream; new inhabitants do not consume the ants' random sequence. */
export function ensureEcology(w: FamilyWorld): EcologyState {
  if (w.ecology) return w.ecology;
  const { random } = seededRandom(w.seed + ":trophobiosis"),
    eligible = seedForaging(w)
      ? []
      : w.plants.filter((p) =>
          ["shrub", "flower", "grass", "tree"].includes(speciesOf(p)),
        );
  const hosts = [...eligible]
    .sort((a, b) => a.id - b.id)
    .filter(() => random() < 0.3)
    .slice(0, 7);
  if (!hosts.length && eligible.length)
    hosts.push(eligible[Math.floor(random() * eligible.length)]);
  const profile = colonyProfile(w);
  return (w.ecology = {
    version: 1,
    aphids: hosts.map((p, i) => ({
      id: i + 1,
      plant: p.id,
      count: 8 + Math.floor(random() * 10),
      honey: 0,
      visits: 0,
    })),
    mimics: hosts.slice(0, 3).map((p, i) => {
      const x = p.x + 0.25 * (random() - 0.5),
        z = p.z + 0.25 * (random() - 0.5),
        odor = profile.map((v) => Math.max(0.01, v + (random() - 0.5) * 0.03)),
        sum = odor.reduce((a, b) => a + b, 0);
      return {
        id: i + 1,
        x,
        z,
        y: surfaceHeight(w.nest.relief, x, z) + 0.008,
        profile: odor.map((v) => v / sum),
        energy: 0.8,
        age: 0,
        status: "searching",
      };
    }),
    sap: 0,
    assimilated: 0,
    honeyProduced: 0,
    honeyCollected: 0,
    honeyLost: 0,
    protected: 0,
    aphidsEaten: 0,
    adoptions: 0,
    rejections: 0,
    parasiteFed: 0,
    parasiteRespired: 0,
    lastEvent: -1000,
  });
}
