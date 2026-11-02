import { modelMath } from "../../libs/model-math.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import { allAnts } from "../colonies/types.ts";
import { prepareSocialChemistry, odorDistance } from "./profile.ts";
/** A controlled external treatment, inspired by chemical recognition assays. */
export function applyOdorPulse(w: FamilyWorld, x: number, z: number) {
  prepareSocialChemistry(w);
  const candidates = allAnts(w)
    .filter(
      (a) =>
        a.node === null &&
        !a.airborne &&
        modelMath.hypot(a.x - x, a.z - z) < 1.2,
    )
    .sort(
      (a, b) =>
        modelMath.hypot(a.x - x, a.z - z) - modelMath.hypot(b.x - x, b.z - z),
    );
  const a = candidates[0];
  if (!a) {
    w.log("Não há formiga na superfície perto do ponto escolhido.");
    return false;
  }
  const own = w.socialChemistry!.profiles[String(a.colonyId || 1)];
  const alien = Object.values(w.socialChemistry!.profiles).find(
    (p) => odorDistance(p, own) > 0.15,
  );
  const least = own.indexOf(Math.min(...own)),
    profile = alien || own.map((_, i) => (i === least ? 1 : 0));
  a.odorMask = { profile: [...profile], strength: 1, until: w.tick + 200 };
  a.bodyOdor = [...profile];
  w.log(
    "Um odor estranho foi aplicado à formiga #" +
      a.id +
      ". Observe o próximo contato.",
    "info",
  );
  return true;
}
