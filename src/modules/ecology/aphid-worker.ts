import { modelMath } from "../../libs/model-math.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import type { EcologyPredator } from "./types.ts";
/** Hosts are detected locally. Droplets are collected at the stem base. */
export function visitAphids(w: ColonyWorld, a: ColonyAgent) {
  const e = w.ecology;
  if (
    !e ||
    a.node !== null ||
    a.carrying ||
    a.bioTask ||
    a.soilTask ||
    a.carryingMimic ||
    a.rest > 0
  )
    return false;
  const plants = (w as FamilyWorld).plants;
  const candidate = e.aphids
    .map((p) => ({ patch: p, plant: plants.find((v) => v.id === p.plant) }))
    .filter(
      (v) =>
        v.plant &&
        v.patch.count >= 1 &&
        modelMath.hypot(v.plant.x - a.x, v.plant.z - a.z) < 1.35,
    )
    .sort(
      (u, v) =>
        modelMath.hypot(u.plant!.x - a.x, u.plant!.z - a.z) -
        modelMath.hypot(v.plant!.x - a.x, v.plant!.z - a.z),
    )[0];
  if (!candidate) return false;
  const plant = candidate.plant!,
    patch = candidate.patch;
  const p = w.predators.find(
    (p) =>
      modelMath.hypot(p.x - plant.x, p.z - plant.z) < 1.1 &&
      modelMath.hypot(p.x - a.x, p.z - a.z) < 1.1,
  ) as EcologyPredator | undefined;
  if (p && a.traits.courage > 0.35 && a.energy > 30) {
    p.angle = modelMath.atan2(p.z - a.z, p.x - a.x);
    p.repelledUntil = w.tick + 15;
    p.energy = Math.max(0, p.energy - 0.15);
    a.energy = Math.max(0, a.energy - 0.02);
    e.protected++;
    w.moveSurface(a, modelMath.atan2(p.z - a.z, p.x - a.x), a.speed * 0.4);
    a.state = "Protegendo pulgões";
    return true;
  }
  if (patch.honey < 0.015) return false;
  if (modelMath.hypot(plant.x - a.x, plant.z - a.z) > 0.42) {
    w.moveSurface(a, modelMath.atan2(plant.z - a.z, plant.x - a.x), a.speed);
    a.state = "Visitando pulgões pelo odor local";
    return true;
  }
  const amount = Math.min(0.25, patch.honey),
    drink = Math.max(0, Math.min(amount, 0.6 - a.crop, 0.06));
  patch.honey -= amount;
  patch.visits++;
  e.honeyCollected += amount;
  a.crop += drink;
  a.carrying += amount - drink;
  a.state = "Coletando melaço";
  return true;
}
