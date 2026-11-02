import { modelMath } from "../../libs/model-math.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { odorDistance } from "../social-chemistry/profile.ts";
import { contactAcrossAir } from "../colony/contact.ts";
import { carryMimic } from "./mimic-carrier.ts";
export function visitMimic(w: ColonyWorld, a: ColonyAgent) {
  const e = w.ecology;
  if (!e) return false;
  const carried = e.mimics.find(
    (m) => m.id === a.carryingMimic && m.carrier === a.id,
  );
  if (carried) return carryMimic(w, a, carried);
  if (a.carryingMimic) delete a.carryingMimic;
  if (
    a.carrying ||
    a.bioTask ||
    a.soilTask ||
    a.rest > 0 ||
    a.energy < 35 ||
    (a.mimicRejectedUntil || 0) > w.tick
  )
    return false;
  const m = e.mimics.find(
    (m) =>
      m.status === "searching" &&
      m.carrier === undefined &&
      modelMath.hypot(m.x - a.x, m.y - (a.y || 0), m.z - a.z) < 0.5 &&
      contactAcrossAir(w.nest, a, m),
  );
  if (!m) return false;
  const profile = w.socialChemistry?.profiles[String(a.colonyId || 1)];
  if (
    !profile ||
    odorDistance(profile, m.profile) > 0.095 / (a.pheromoneGain || 1)
  ) {
    e.rejections++;
    a.mimicRejectedUntil = w.tick + 80;
    return false;
  }
  m.carrier = a.id;
  m.status = "carried";
  m.owner = a.colonyId || 1;
  delete m.destination;
  m.until = w.tick + 900;
  a.carryingMimic = m.id;
  a.route = [];
  a.state = "Recolhendo uma larva de odor compatível";
  return true;
}
