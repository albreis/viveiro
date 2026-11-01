import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import type { MimicLarva } from "./types.ts";
import { roomNode } from "../colony/rooms.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import { enterForSoil } from "../soil/routing.ts";
import { advanceSupportedMotion } from "../navigation/support-motion.ts";
import { arriveMimic } from "./mimic-arrival.ts";
export function carryMimic(w: ColonyWorld, a: ColonyAgent, m: MimicLarva) {
  if (w.tick > (m.until ?? Infinity)) {
    Object.assign(m, {
      x: a.x,
      y: a.y || 0,
      normal: a.normal ? { ...a.normal } : { x: 0, y: 1, z: 0 },
      z: a.z,
      node: a.node ?? undefined,
      status: "searching",
    });
    delete m.carrier;
    delete m.destination;
    delete m.owner;
    delete a.carryingMimic;
    delete m.placing;
    delete a.supportMotion;
    a.route = [];
    a.mimicRejectedUntil = w.tick + 200;
    return false;
  }
  if (m.placing) {
    if (a.supportMotion) {
      advanceSupportedMotion(w, a, a.speed * 0.85);
      return true;
    }
    Object.assign(m, {
      x: a.x,
      y: a.y || 0,
      normal: a.normal ? { ...a.normal } : { x: 0, y: 1, z: 0 },
      z: a.z,
      node: a.node ?? undefined,
      owner: a.colonyId || 1,
      status: "adopted",
    });
    delete m.carrier;
    delete a.carryingMimic;
    delete m.placing;
    delete a.routeIntent;
    w.ecology!.adoptions++;
    w.log("Uma lagarta com odor compatível foi adotada no berçário.", "info");
    return true;
  }
  m.destination ??= roomNode(w.nest, "nursery", 0, a.colonyId || 1);
  if (a.node === null) enterForSoil(w, a, m.destination);
  else if (a.route.length) w.moveInNest(a);
  else if (a.node === m.destination) arriveMimic(w, a, a.node);
  else requestRoute(w, a, m.destination);
  a.state = "Levando uma larva de odor compatível";
  return true;
}
