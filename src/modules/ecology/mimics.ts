import type { FamilyWorld } from "../colonies/types.ts";
import { allAnts } from "../colonies/types.ts";
import { contactAcrossAir } from "../colony/contact.ts";
import { odorDistance } from "../social-chemistry/profile.ts";
/** Cuckoo strategy: consumes donated liquid food, not ant brood. */
export function updateMimics(w: FamilyWorld) {
  const e = w.ecology;
  if (!e) return;
  const ants = allAnts(w),
    profiles = w.socialChemistry?.profiles || {};
  for (const m of e.mimics) {
    if (m.status === "dead") continue;
    m.age += 0.01;
    const cost = Math.min(m.energy, 0.00025);
    m.energy -= cost;
    e.parasiteRespired += cost;
    if (m.energy <= 0 || m.age > 35) {
      m.status = "dead";
      delete m.carrier;
      continue;
    }
    if (m.carrier !== undefined) {
      const carrier = ants.find((a) => a.id === m.carrier);
      if (carrier)
        Object.assign(m, {
          x: carrier.x,
          y: carrier.y || 0,
          normal: carrier.normal ? { ...carrier.normal } : { x: 0, y: 1, z: 0 },
          z: carrier.z,
          node: carrier.node ?? undefined,
        });
      if (carrier && (carrier.health ?? 100) > 0 && carrier.energy > 0)
        continue;
      delete m.carrier;
      delete m.placing;
      m.status = "searching";
    }
    if (m.status !== "adopted") continue;
    const donor = ants.find(
      (a) =>
        a.energy > 0 &&
        (a.health ?? 100) > 0 &&
        a.crop > 0.003 &&
        Math.hypot(a.x - m.x, (a.y || 0) - m.y, a.z - m.z) < 0.5 &&
        contactAcrossAir(w.nest, a, m) &&
        profiles[String(a.colonyId || 1)] &&
        odorDistance(profiles[String(a.colonyId || 1)], m.profile) <
          0.095 / (a.pheromoneGain || 1),
    );
    if (!donor) continue;
    const amount = Math.max(0, Math.min(0.0012, donor.crop, 1.2 - m.energy));
    donor.crop -= amount;
    m.energy += amount;
    e.parasiteFed += amount;
    const profile = profiles[String(donor.colonyId || 1)];
    m.profile = m.profile.map((v, i) => v + (profile[i] - v) * 0.02);
  }
}
