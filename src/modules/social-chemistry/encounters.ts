import type { FamilyWorld } from "../colonies/types.ts";
import { allAnts } from "../colonies/types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import { neighborsOf } from "../navigation/sensors.ts";
import { contactAcrossAir } from "../colony/contact.ts";
import { recognizes } from "./profile.ts";
import { localTerritory } from "./territory.ts";
const directionAway = (a: ColonyAgent, b: ColonyAgent) => {
  const dx = a.x - b.x,
    dy = (a.y || 0) - (b.y || 0),
    dz = a.z - b.z,
    d = Math.hypot(dx, dy, dz) || 1;
  return { x: dx / d, y: dy / d, z: dz / d };
};
/** Each contact is local, through air, and processed once for the pair in this global tick. */
export function updateSocialEncounters(root: FamilyWorld) {
  const state = root.socialChemistry;
  if (!state) return;
  const pairs = new Set<string>();
  for (const a of allAnts(root)) {
    if (
      a.kind !== "worker" ||
      (a.health ?? 100) <= 0 ||
      a.encounterCooldown! > root.tick
    )
      continue;
    for (const raw of neighborsOf(root, a, 0.65)) {
      const b = raw as ColonyAgent,
        key = [a.id, b.id].sort((x, y) => x - y).join(":");
      if (
        pairs.has(key) ||
        b.airborne ||
        (b.health ?? 100) <= 0 ||
        !contactAcrossAir(root.nest, a, b)
      )
        continue;
      pairs.add(key);
      if (recognizes(root, a, b)) continue;
      // A disguised visitor avoids initiating a fight with its target colony.
      if (a.intrusion?.owner === (b.colonyId || 1)) continue;
      state.contacts++;
      const own = a.colonyId || 1,
        neighbors = neighborsOf(root, a, 1.1).filter(
          (p) =>
            p.energy > 0 &&
            (p.health ?? 100) > 0 &&
            contactAcrossAir(root.nest, a, p),
        );
      const allies = neighbors.filter((p) =>
          recognizes(root, a, p as ColonyAgent),
        ).length,
        foes = neighbors.length - allies;
      const courage = a.traits?.courage ?? 0.5,
        territory = localTerritory(root, a),
        nearHome =
          a.node !== null && (root.nest.nodes[a.node]?.colonyId || 1) === own;
      const threat =
        (foes - allies) * 0.18 +
        (a.energy < 35 ? 0.5 : 0) -
        (nearHome ? 0.25 : 0) -
        Math.min(0.2, territory.own * 0.15);
      const away = directionAway(a, b);
      if (root.tick - (a.lastAlienContact ?? -1000) > 60) a.encounterTicks = 0;
      a.lastAlienContact = root.tick;
      a.encounterTicks = (a.encounterTicks || 0) + 1;
      if (courage + 0.2 < threat + 0.45) {
        a.encounter = {
          until: root.tick + 8,
          direction: away,
          state: "Recuando de odor estranho",
        };
        a.encounterCooldown = root.tick + 20;
        state.retreats++;
      } else if ((a.encounterTicks || 0) < 3) {
        a.encounter = {
          until: root.tick + 3,
          direction: away,
          state: "Intimidando após contato químico",
        };
        a.encounterCooldown = root.tick + 6;
        state.intimidations++;
      } else {
        const damage = (a.caste === "major" ? 1.8 : 0.8) * (0.5 + courage);
        b.health = Math.max(0, (b.health ?? 100) - damage);
        a.energy = Math.max(0, a.energy - 0.03);
        if (b.health <= 0) b.deathCause = "combat";
        a.encounter = {
          until: root.tick + 4,
          direction: away,
          state: "Disputa química e defesa",
        };
        a.encounterCooldown = root.tick + 12;
        state.attacks++;
      }
      if (root.tick - state.lastEvent > 80) {
        root.log(
          "Formigas de colônias diferentes reagiram ao odor no encontro.",
          "danger",
        );
        state.lastEvent = root.tick;
      }
      break;
    }
  }
}
