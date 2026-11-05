import { effortEnabled, recordMotionEffort } from "../fatigue/terrarium.ts";
import { modelMath } from "../../libs/model-math.ts";
import { blocksVegetation } from "../predators/vegetation.ts";
import { logLevel, pondLevel, blocksObstacle } from "./surface-obstacles.ts";
import { surfaceHeight, surfaceNormal } from "../landscape/queries.ts";
import { sampleSoil } from "../terrain/field.ts";
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
    const forward = {
      x: modelMath.cos(heading),
      y: 0,
      z: modelMath.sin(heading),
    };
    const initial = socialForces(entity, neighbors, forward, speed);
    const preferred = contactResponse(world, entity, initial, forward, {
      x: 0,
      y: 1,
      z: 0,
    });
    const forces = socialForces(entity, neighbors, preferred, speed);
    nav.velocity = { x: forces.velocity.x, y: 0, z: forces.velocity.z };
    heading = modelMath.atan2(nav.velocity.z, nav.velocity.x);
    speed = Math.max(
      speed * 0.22,
      Math.min(speed * 1.15, modelMath.hypot(nav.velocity.x, nav.velocity.z)),
    );
  }
  const blocked = (x: number, z: number, angle: number) =>
    (Math.abs(x) > BOUNDS.x && Math.abs(x) >= Math.abs(entity.x) - 0.00001) ||
    (Math.abs(z) > BOUNDS.z && Math.abs(z) >= Math.abs(entity.z) - 0.00001) ||
    blocksObstacle(
      pondLevel(x, z, world.landscape),
      pondLevel(entity.x, entity.z, world.landscape),
    ) ||
    sampleSoil(world.nest, {
      x,
      y: surfaceHeight(world.nest.relief, x, z) - 0.025,
      z,
    }).distance > 0 ||
    blocksObstacle(
      logLevel(x, z, world.landscape),
      logLevel(entity.x, entity.z, world.landscape),
    ) ||
    (predator && blocksVegetation(world.plants, entity, x, z)) ||
    (predator
      ? world.nest.nodes.some(
          (n) =>
            n.type === "entrance" &&
            blocksObstacle(
              modelMath.pow(modelMath.hypot(x - n.x, z - n.z) / 1.3, 2),
              modelMath.pow(
                modelMath.hypot(entity.x - n.x, entity.z - n.z) / 1.3,
                2,
              ),
            ),
        )
      : !positionClear(world, entity, { x, y: 0, z }, angle));
  if ((entity.avoidTicks || 0) > 0) {
    heading = entity.avoidAngle ?? heading;
    entity.avoidTicks = (entity.avoidTicks || 0) - 1;
  }
  let candidate: {
    x: number;
    z: number;
    angle: number;
    detour: boolean;
  } | null = null;
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
    const x = entity.x + modelMath.cos(angle) * speed,
      z = entity.z + modelMath.sin(angle) * speed;
    if (!blocked(x, z, angle)) {
      candidate = { x, z, angle, detour: turn !== 0 };
      if (turn) {
        entity.avoidTicks = 5;
        entity.avoidAngle = angle;
      }
      break;
    }
  }
  if (!candidate) {
    if (!predator) {
      recordMotionEffort(world, entity, null, false, true);
      recordCongestion(entity);
      entity.state = "Contato Antenal";
    }
    return false;
  }
  entity.distanceWalked =
    (entity.distanceWalked || 0) +
    modelMath.hypot(candidate.x - entity.x, candidate.z - entity.z);
  if (!predator) {
    navigationState(entity).velocity = {
      x: candidate.x - entity.x,
      y: 0,
      z: candidate.z - entity.z,
    };
    recordCongestion(entity);
  }
  const origin =
    !predator && effortEnabled(world, entity)
      ? {
          x: entity.x,
          z: entity.z,
          y: surfaceHeight(world.nest.relief, entity.x, entity.z) + 0.008,
        }
      : null;
  entity.x = candidate.x;
  entity.z = candidate.z;
  entity.y = surfaceHeight(world.nest.relief, entity.x, entity.z) + 0.008;
  entity.normal = surfaceNormal(world.nest.relief, entity.x, entity.z);
  entity.pitch = modelMath.atan(
    -(
      entity.normal.x * modelMath.cos(candidate.angle) +
      entity.normal.z * modelMath.sin(candidate.angle)
    ) / entity.normal.y,
  );
  entity.angle = candidate.angle;
  if (origin)
    recordMotionEffort(
      world,
      entity,
      {
        x: entity.x - origin.x,
        y: entity.y - origin.y,
        z: entity.z - origin.z,
      },
      candidate.detour,
      true,
    );
  return true;
}
