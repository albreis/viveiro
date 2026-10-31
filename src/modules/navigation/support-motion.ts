import type { AgentState, NavigationWorld, Vec3 } from "./types.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import { sampleSupport } from "../terrain/field.ts";
import { navigationState } from "./contact.ts";
import { add, sub, scale, length, position, dot } from "./vectors.ts";
import { findSupportPath } from "./support-search.ts";
import { chooseSupportedStep } from "./support-step.ts";

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
    goal: { position: end, normal },
    bestDistance: length(sub(end, position(ant))),
    noProgressTicks: 0,
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
  motion.goal ??= { position: point.position, normal: point.normal };
  const targetSupport = projectSupport(world.nest, point.position);
  point.position = targetSupport.point;
  point.normal = targetSupport.normal;
  const delta = sub(point.position, position(ant)),
    distance = length(delta);
  const goalDistance = length(sub(motion.goal.position, position(ant)));
  if (goalDistance < (motion.bestDistance ?? Infinity) - 0.015) {
    motion.bestDistance = goalDistance;
    motion.noProgressTicks = 0;
  } else motion.noProgressTicks = (motion.noProgressTicks || 0) + 1;
  // A blocked waypoint within one step is already reached by the body.
  // Advance the route without moving the ant or snapping it to that waypoint.
  if (
    (motion.noProgressTicks || 0) > 10 &&
    distance < speed &&
    dot(ant.normal || point.normal, point.normal) > 0.75
  ) {
    motion.points.shift();
    motion.noProgressTicks = 0;
    motion.bestDistance = Infinity;
    return;
  }
  if ((motion.noProgressTicks || 0) > 75) {
    delete ant.supportMotion;
    navigationState(ant).retreating = true;
    ant.state = "Procurando passagem pela parede";
    return;
  }
  motion.searchCooldown = Math.max(0, (motion.searchCooldown || 0) - 1);
  if ((motion.noProgressTicks || 0) > 10 && !motion.searchCooldown) {
    const path = findSupportPath(
      world.nest,
      position(ant),
      motion.goal.position,
    );
    motion.searchCooldown = 35 + (ant.id % 15);
    if (path.length) {
      motion.points = [...path, motion.goal];
      motion.noProgressTicks = 0;
      return;
    }
  }
  if (distance < 0.001) {
    ant.normal = point.normal;
    motion.points.shift();
    return;
  }
  const projected = chooseSupportedStep(world, ant, point.position, speed);
  const next = projected?.position ?? position(ant);
  const step = sub(next, position(ant));
  const heading =
    Math.hypot(step.x, step.z) > 0.001 ? Math.atan2(step.z, step.x) : ant.angle;
  const pitch = Math.atan2(step.y, Math.hypot(step.x, step.z));
  if (!projected) {
    ant.state = "Contato Antenal";
    motion.blockedTicks++;
    if (motion.blockedTicks > 45 || (motion.noProgressTicks || 0) > 100) {
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
