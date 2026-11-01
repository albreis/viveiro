import type {
  AgentState,
  NavigationWorld,
  NavigationState,
  Vec3,
} from "./types.ts";
export interface SocialForceResult {
  desired: Vec3;
  repulsion: Vec3;
  total: Vec3;
  velocity: Vec3;
  pressure: number;
  frontal: AgentState | null;
}
import {
  add,
  sub,
  scale,
  dot,
  length,
  normalize,
  cross,
  limit,
  position,
} from "./vectors.ts";

export const loaded = (ant: AgentState) =>
  !!(
    ant.hasFood ||
    ant.carrying > 0 ||
    ant.carryingBrood ||
    ant.carryingMimic ||
    ant.carryingSoil ||
    ant.carryingWaste
  );
export const NAVIGATION = {
  sensingRadius: 1.2,
  safetyRadius: 0.52,
  relaxationTicks: 2.8,
  repulsion: 0.018,
  lateralStrength: 0.028,
};

// A locally sensed social-force adaptation, not a calibrated biological law.
export function socialForces(
  agent: AgentState,
  neighbors: AgentState[],
  direction: Vec3,
  speed: number,
  options: { normal?: Vec3; climb?: boolean } = {},
): SocialForceResult {
  const normal = options.normal || { x: 0, y: 1, z: 0 };
  const forward = normalize(direction);
  const side = normalize(cross(forward, normal));
  const velocity = agent.navigation?.velocity || { x: 0, y: 0, z: 0 };
  const desired = scale(
    sub(scale(forward, speed), velocity),
    1 / NAVIGATION.relaxationTicks,
  );
  let repulsion = { x: 0, y: 0, z: 0 },
    pressure = 0;
  let frontal: AgentState | null = null;
  for (const other of neighbors) {
    const offset = sub(position(agent), position(other));
    const distance = length(offset);
    if (distance > NAVIGATION.safetyRadius) continue;
    const away =
      distance > 0.001
        ? scale(offset, 1 / distance)
        : scale(side, agent.id < other.id ? 1 : -1);
    const weight = loaded(other) && !loaded(agent) ? 2 : 1;
    const strength = Math.min(
      0.1,
      NAVIGATION.repulsion *
        weight *
        Math.max(
          0,
          1 / (distance + 0.08) - 1 / (NAVIGATION.safetyRadius + 0.08),
        ),
    );
    repulsion = add(repulsion, scale(away, strength));
    if (dot(away, forward) < -0.25) {
      pressure += weight * (1 - distance / NAVIGATION.safetyRadius);
      frontal = other;
    }
  }
  if (pressure > 0) {
    repulsion = add(
      repulsion,
      scale(side, pressure * NAVIGATION.lateralStrength),
    );
    if (options.climb) repulsion.y += pressure * 0.009;
  }
  const total = add(desired, repulsion);
  const nextVelocity = limit(add(velocity, total), speed * 1.15);
  return {
    desired,
    repulsion,
    total,
    velocity: nextVelocity,
    pressure,
    frontal,
  };
}
