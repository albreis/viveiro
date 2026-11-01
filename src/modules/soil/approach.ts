import type { SoilWorld, SoilAgent, DigProject } from "./types.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import {
  startSupportedMotion,
  advanceSupportedMotion,
} from "../navigation/support-motion.ts";
import { normalize, sub, add, scale } from "../navigation/vectors.ts";
/** A logical node is not proof that the ant's body reached the working face. */
export function approachDigFace(
  world: SoilWorld,
  ant: SoilAgent,
  project: DigProject,
) {
  const front = world.nest.nodes[project.front],
    direction = normalize(sub(project.goal, front));
  const support = projectSupport(
    world.nest,
    add(front, scale(direction, front.r * 0.8)),
  );
  if (Math.abs(support.gap - 0.008) > 0.02) return false;
  ant.route = [project.front];
  startSupportedMotion(world, ant, support.point, support.normal, {
    x: front.x,
    y: front.y,
    z: front.z,
  });
  advanceSupportedMotion(world, ant, ant.speed * 0.85);
  return true;
}
