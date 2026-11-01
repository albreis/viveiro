import { outsideSite } from "./site.ts";
import type { FoundingWorld } from "./types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import type { Vec3 } from "../navigation/types.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import { walkFoundress } from "./motion.ts";
/** Use the same lip, shaft and wall navigation as workers, instead of aiming through soil. */
export function travelToFront(
  world: FoundingWorld,
  q: ColonyAgent,
  goal: Vec3,
) {
  const mouth = world.nest.nodes[0];
  if (q.node === null) {
    if (Math.hypot(q.x - mouth.x, q.z - mouth.z) > 0.58) {
      const reached = walkFoundress(world, q, {
        ...outsideSite(world.founding!, 0.5),
        y: mouth.y,
      });
      if (!reached) return false;
    }
    q.node = 0;
    q.tunnelCenter = { x: mouth.x, y: mouth.y, z: mouth.z };
    q.tunnelY = mouth.y;
    delete q.supportMotion;
    requestRoute(world, q, 1);
  }
  if (q.node !== 1) {
    if (!q.route.length) requestRoute(world, q, 1);
    world.moveInNest(q);
    return false;
  }
  return walkFoundress(world, q, goal);
}
export function haulFoundingSoil(
  world: FoundingWorld,
  q: ColonyAgent,
  dump: Vec3,
) {
  if (q.node !== null && q.node !== 0) {
    if (!q.route.length) requestRoute(world, q, 0);
    world.moveInNest(q);
    return false;
  }
  if (q.node === 0) {
    q.node = null;
    q.tunnelCenter = null;
    delete q.supportMotion;
  }
  return walkFoundress(world, q, dump);
}
