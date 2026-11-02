import { modelMath } from "../../libs/model-math.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { requestIntrusionRoute } from "./intrusion-route.ts";
import { arriveIntruder } from "./intrusion-arrival.ts";
import { advanceSupportedMotion } from "../navigation/support-motion.ts";
/** Soil disguise and opportunistic theft are exploratory policies, not a universal ant behavior. */
export function updateIntrusion(w: ColonyWorld, a: ColonyAgent) {
  if (!w.socialChemistry) return false;
  if (!a.intrusion) {
    if (
      a.kind !== "worker" ||
      a.sexual ||
      a.node !== null ||
      a.carrying ||
      a.bioTask ||
      a.soilTask ||
      a.carryingBrood ||
      a.carryingMimic ||
      a.carryingWaste ||
      a.energy > 45 ||
      a.crop > 0.1 ||
      a.traits.exploration < 0.55
    )
      return false;
    const entry = w.nest.nodes
      .map((n, i) => ({ ...n, id: i }))
      .find(
        (n) =>
          n.type === "entrance" &&
          (n.colonyId || 1) !== (a.colonyId || 1) &&
          modelMath.hypot(n.x - a.x, n.z - a.z) < 1.3,
      );
    if (
      !entry ||
      !w.socialChemistry.profiles[String(entry.colonyId || 1)] ||
      w.random() > 0.06
    )
      return false;
    a.intrusion = {
      owner: entry.colonyId || 1,
      entry: entry.id,
      phase: "mask",
      until: w.tick + 20,
      home: a.lastEntrance,
    };
    w.socialChemistry.camouflages++;
  }
  const t = a.intrusion,
    entry = w.nest.nodes[t.entry];
  if (!entry) {
    delete a.intrusion;
    return false;
  }
  if (t.phase === "mask") {
    const profile = w.socialChemistry.profiles[String(t.owner)];
    if (!profile) {
      delete a.intrusion;
      return false;
    }
    if (modelMath.hypot(a.x - entry.x, a.z - entry.z) > entry.r + 0.4) {
      w.moveSurface(
        a,
        modelMath.atan2(entry.z - a.z, entry.x - a.x),
        a.speed * 0.7,
      );
      a.state = "Aproximando-se do odor no solo";
      return true;
    }
    a.odorMask = {
      profile: [...profile],
      strength: Math.min(1, (a.odorMask?.strength || 0) + 0.06),
      until: w.tick + 180,
    };
    a.energy = Math.max(0, a.energy - 0.003);
    a.state = "Adquirindo odor do solo";
    if (w.tick >= t.until) {
      t.phase = "search";
      t.until = w.tick + 650;
    }
    return true;
  }
  if ((a.health ?? 100) < 55 || w.tick > t.until) {
    t.phase = "exit";
    delete a.supportMotion;
  }
  if (a.supportMotion) {
    advanceSupportedMotion(w, a, a.speed * 0.85);
    return true;
  }
  if (a.node === null) {
    if (t.phase === "exit") {
      a.lastEntrance = t.home;
      delete a.intrusion;
      return false;
    }
    if (modelMath.hypot(a.x - entry.x, a.z - entry.z) > 0.6) {
      w.moveSurface(a, modelMath.atan2(entry.z - a.z, entry.x - a.x), a.speed);
      return true;
    }
    a.node = t.entry;
    a.tunnelCenter = { x: entry.x, y: entry.y, z: entry.z };
    a.tunnelY = entry.y;
    requestIntrusionRoute(w, a, t);
  }
  if (a.route.length) w.moveInNest(a);
  else if (t.phase === "search" && a.node !== null)
    arriveIntruder(w, a, a.node);
  else requestIntrusionRoute(w, a, t);
  a.state =
    t.phase === "exit"
      ? "Recuando ao acesso estrangeiro"
      : "Explorando um ninho com disfarce químico";
  return true;
}
