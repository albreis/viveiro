import type { AgentState, NavigationWorld, NestNode, Vec3 } from "./types.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { hitsLog } from "./surface-obstacles.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import {
  startSupportedMotion,
  advanceSupportedMotion,
} from "./support-motion.ts";

/** The shaft center is above ground: walk around the lip, never raycast in mid-air. */
export function leaveShaft(
  world: NavigationWorld,
  ant: AgentState,
  target: NestNode,
  center: Vec3,
  edge: number,
) {
  if (target.type !== "entrance" || center.y < -0.18) return false;
  const dx = ant.x - target.x,
    dz = ant.z - target.z;
  const heading = Math.hypot(dx, dz) > 0.01 ? Math.atan2(dz, dx) : ant.angle;
  const radius =
    Math.max(target.r, world.nest.linkWidths?.[edge] || 0.38) + 0.17;
  for (const turn of [0, 0.3, -0.3, 0.6, -0.6, 1, -1, 1.6, -1.6, Math.PI]) {
    const goal = projectSupport(world.nest, {
      x: target.x + Math.cos(heading + turn) * radius,
      y:
        surfaceHeight(
          world.nest.relief,
          target.x + Math.cos(heading + turn) * radius,
          target.z + Math.sin(heading + turn) * radius,
        ) + 0.008,
      z: target.z + Math.sin(heading + turn) * radius,
    });
    if (
      hitsLog(goal.point.x, goal.point.z, world.landscape) ||
      world.inPond(goal.point.x, goal.point.z)
    )
      continue;
    if (goal.normal.y < 0.75 || Math.abs(goal.gap - 0.008) > 0.015) continue;
    startSupportedMotion(world, ant, goal.point, goal.normal, {
      x: target.x,
      y: target.y,
      z: target.z,
    });
    advanceSupportedMotion(world, ant, ant.speed * 0.85);
    return true;
  }
  return false;
}
