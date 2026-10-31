import type {
  AgentState,
  NavigationWorld,
  NavigationState,
  Vec3,
} from "./types.ts";
import { neighborsOf } from "./sensors.ts";
import { socialForces } from "./social-forces.ts";
import {
  navigationState,
  contactResponse,
  recordCongestion,
} from "./contact.ts";
import { positionClear } from "./collision.ts";
import { BOUNDS } from "../simulation/constants.js";

function hitsLog(x: number, z: number) {
  const dx = x - 4.3,
    dz = z - 3.6;
  return (
    ((dx * Math.cos(0.5) + dz * Math.sin(0.5)) / 1.95) ** 2 +
      ((-dx * Math.sin(0.5) + dz * Math.cos(0.5)) / 0.55) ** 2 <
    1
  );
}

export function moveSurface(
  world: NavigationWorld,
  entity: AgentState,
  heading: number,
  speed: number,
  predator = false,
) {
  if (!predator) {
    const nav = navigationState(entity),
      neighbors = neighborsOf(world, entity);
    const forward = { x: Math.cos(heading), y: 0, z: Math.sin(heading) };
    const initial = socialForces(entity, neighbors, forward, speed);
    const preferred = contactResponse(world, entity, initial, forward, {
      x: 0,
      y: 1,
      z: 0,
    });
    const forces = socialForces(entity, neighbors, preferred, speed);
    nav.velocity = { x: forces.velocity.x, y: 0, z: forces.velocity.z };
    heading = Math.atan2(nav.velocity.z, nav.velocity.x);
    speed = Math.max(
      speed * 0.22,
      Math.min(speed * 1.15, Math.hypot(nav.velocity.x, nav.velocity.z)),
    );
  }
  const blocked = (x: number, z: number, angle: number) =>
    Math.abs(x) > BOUNDS.x ||
    Math.abs(z) > BOUNDS.z ||
    world.inPond(x, z) ||
    hitsLog(x, z) ||
    (predator
      ? world.nest.nodes.some(
          (n) => n.type === "entrance" && Math.hypot(x - n.x, z - n.z) < 1.3,
        )
      : !positionClear(world, entity, { x, y: 0, z }, angle));
  if ((entity.avoidTicks || 0) > 0) {
    heading = entity.avoidAngle ?? heading;
    entity.avoidTicks = (entity.avoidTicks || 0) - 1;
  }
  let candidate: { x: number; z: number; angle: number } | null = null;
  for (const turn of [
    0,
    0.45,
    -0.45,
    0.9,
    -0.9,
    1.4,
    -1.4,
    2.1,
    -2.1,
    Math.PI,
  ]) {
    const angle = heading + turn;
    const x = entity.x + Math.cos(angle) * speed,
      z = entity.z + Math.sin(angle) * speed;
    if (!blocked(x, z, angle)) {
      candidate = { x, z, angle };
      if (turn) {
        entity.avoidTicks = 5;
        entity.avoidAngle = angle;
      }
      break;
    }
  }
  if (!candidate) {
    if (!predator) {
      recordCongestion(entity);
      entity.state = "Contato Antenal";
    }
    return false;
  }
  entity.distanceWalked =
    (entity.distanceWalked || 0) +
    Math.hypot(candidate.x - entity.x, candidate.z - entity.z);
  if (!predator) {
    navigationState(entity).velocity = {
      x: candidate.x - entity.x,
      y: 0,
      z: candidate.z - entity.z,
    };
    recordCongestion(entity);
  }
  entity.x = candidate.x;
  entity.z = candidate.z;
  entity.angle = candidate.angle;
  return true;
}
