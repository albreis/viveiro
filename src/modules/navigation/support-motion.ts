import type { AgentState, NavigationWorld, Vec3 } from "./types.ts";
import { stepOnSupport } from "../terrain/surface-queries.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import { sampleSupport } from "../terrain/field.ts";
import { positionClear } from "./collision.ts";
import { navigationState } from "./contact.ts";
import { add, sub, scale, length, position } from "./vectors.ts";

export function startSupportedMotion(
  world: NavigationWorld,
  ant: AgentState,
  end: Vec3,
  normal: Vec3,
  center: Vec3,
) {
  ant.supportMotion = {
    points: [{ position: end, normal }],
    center,
    blockedTicks: 0,
  };
}

export function advanceSupportedMotion(
  world: NavigationWorld,
  ant: AgentState,
  speed: number,
) {
  const motion = ant.supportMotion;
  if (!motion) return;
  const point = motion.points[0];
  if (!point) {
    ant.tunnelCenter = motion.center;
    ant.tunnelY = motion.center.y;
    delete ant.supportMotion;
    return;
  }
  const targetSupport = projectSupport(world.nest, point.position);
  point.position = targetSupport.point;
  point.normal = targetSupport.normal;
  const delta = sub(point.position, position(ant)),
    distance = length(delta);
  if (distance < 0.001) {
    ant.normal = point.normal;
    motion.points.shift();
    return;
  }
  const projected = stepOnSupport(
    world.nest,
    position(ant),
    point.position,
    speed,
    ant.angle,
  );
  const next = projected.position;
  const step = sub(next, position(ant));
  const heading =
    Math.hypot(step.x, step.z) > 0.001 ? Math.atan2(step.z, step.x) : ant.angle;
  const pitch = Math.atan2(step.y, Math.hypot(step.x, step.z));
  if (
    !projected.valid ||
    !positionClear(world, ant, next, heading, pitch, projected.normal)
  ) {
    ant.state = "Contato Antenal";
    motion.blockedTicks++;
    if (motion.blockedTicks > 24) {
      delete ant.supportMotion;
      navigationState(ant).retreating = true;
    }
    return;
  }
  motion.blockedTicks = 0;
  ant.distanceWalked = (ant.distanceWalked || 0) + length(step);
  navigationState(ant).velocity = step;
  Object.assign(ant, next, { normal: projected.normal, angle: heading, pitch });
  ant.state =
    Math.abs(projected.normal.y) < 0.8
      ? step.y < -0.001
        ? "Descendo pela parede"
        : step.y > 0.001
          ? "Subindo pela parede"
          : "Contornando uma borda"
      : "Percorrendo o piso";
  if (length(sub(next, point.position)) < 0.012) motion.points.shift();
}

/** Reattach gradually if digging has moved the nearby support surface. */
export function settleSupport(
  world: NavigationWorld,
  ant: AgentState,
  speed: number,
) {
  if ((ant.y || 0) >= -0.04) return false;
  const current = position(ant),
    field = sampleSupport(world.nest, current);
  if (Math.abs(field.distance - 0.008) <= 0.012) return false;
  const support = projectSupport(world.nest, current),
    delta = sub(support.point, current);
  if (Math.abs(support.gap - 0.008) > 0.025) return false;
  const distance = length(delta),
    step = scale(delta, Math.min(speed, distance) / (distance || 1));
  Object.assign(ant, add(current, step), {
    normal: support.normal,
    state: "Ajustando o apoio",
  });
  ant.distanceWalked = (ant.distanceWalked || 0) + length(step);
  navigationState(ant).velocity = step;
  return true;
}
