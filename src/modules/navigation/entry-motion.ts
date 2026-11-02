import { modelMath } from "../../libs/model-math.ts";
import type { AgentState, NavigationWorld, NestNode, Vec3 } from "./types.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { tunnelFooting } from "../terrain/surface-queries.ts";
import { positionClear } from "./collision.ts";
import {
  startSupportedMotion,
  advanceSupportedMotion,
} from "./support-motion.ts";
/** Walk over the real lip before tracing the shaft; a horizontal ray above ground has no wall. */
export function enterShaft(
  world: NavigationWorld,
  ant: AgentState,
  from: NestNode,
  target: NestNode,
  center: Vec3,
) {
  if (from.type !== "entrance" || target.y >= from.y - 0.08) return false;
  const top = surfaceHeight(world.nest.relief, from.x, from.z);
  if (center.y < top - 0.16) return false;
  const t = Math.min(0.75, (from.y - top + 0.24) / (from.y - target.y));
  const below = {
    x: from.x + (target.x - from.x) * t,
    y: from.y + (target.y - from.y) * t,
    z: from.z + (target.z - from.z) * t,
  };
  if (center.y <= below.y + 0.001) return false;
  const angle = modelMath.atan2(ant.z - from.z, ant.x - from.x);
  let best: ReturnType<typeof tunnelFooting> | undefined,
    cost = Infinity;
  for (const turn of [
    0,
    0.25,
    -0.25,
    0.55,
    -0.55,
    0.9,
    -0.9,
    1.5,
    -1.5,
    Math.PI,
  ]) {
    const candidate = tunnelFooting(
      world.nest,
      below,
      from,
      target,
      angle + turn,
    );
    if (
      !candidate.inside ||
      !positionClear(
        world,
        ant,
        candidate,
        candidate.heading,
        candidate.pitch,
        candidate.normal,
      )
    )
      continue;
    const distance = modelMath.hypot(
      candidate.x - ant.x,
      candidate.y - (ant.y || 0),
      candidate.z - ant.z,
    );
    if (distance < cost) {
      best = candidate;
      cost = distance;
    }
  }
  if (!best) return false;
  startSupportedMotion(world, ant, best, best.normal, below);
  advanceSupportedMotion(world, ant, ant.speed * 0.85);
  return true;
}
