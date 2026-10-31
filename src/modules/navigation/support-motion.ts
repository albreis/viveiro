import type { AgentState, NavigationWorld, Vec3 } from "./types.ts";
import { surfacePath } from "./surface-path.ts";
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
    points: surfacePath(
      world.nest,
      position(ant),
      end,
      ant.normal || { x: 0, y: 1, z: 0 },
      normal,
      center.y,
    ),
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
  const delta = sub(point.position, position(ant)),
    distance = length(delta);
  if (distance < 0.001) {
    ant.normal = point.normal;
    motion.points.shift();
    return;
  }
  const step = scale(delta, Math.min(speed, distance) / distance);
  const next = add(position(ant), step);
  const heading =
    Math.hypot(step.x, step.z) > 0.001 ? Math.atan2(step.z, step.x) : ant.angle;
  const pitch = Math.atan2(step.y, Math.hypot(step.x, step.z));
  if (!positionClear(world, ant, next, heading, pitch, point.normal)) {
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
  Object.assign(ant, next, { normal: point.normal, angle: heading, pitch });
  ant.state =
    Math.abs(point.normal.y) < 0.8
      ? step.y < -0.001
        ? "Descendo pela parede"
        : step.y > 0.001
          ? "Subindo pela parede"
          : "Contornando uma borda"
      : "Percorrendo o piso";
  if (distance <= speed + 0.001) motion.points.shift();
}
