import { modelMath } from "../../libs/model-math.ts";
import type { AgentState, NavigationWorld, Vec3 } from "./types.ts";
import { stepOnSupport } from "../terrain/surface-queries.ts";
import { positionClear } from "./collision.ts";
import { supportedSegment } from "./support-search.ts";
import {
  add,
  cross,
  dot,
  length,
  normalize,
  position,
  scale,
  sub,
} from "./vectors.ts";

/** Search both sides of a contact on the support plane instead of stopping. */
export function chooseSupportedStep(
  world: NavigationWorld,
  ant: AgentState,
  target: Vec3,
  speed: number,
) {
  const start = position(ant),
    normal = ant.normal ?? { x: 0, y: 1, z: 0 };
  const desired = sub(target, start);
  let forward = normalize(sub(desired, scale(normal, dot(desired, normal))));
  if (length(forward) < 0.001)
    forward = normalize(cross(normal, { x: 0, y: 1, z: 0 }));
  if (length(forward) < 0.001) forward = { x: 1, y: 0, z: 0 };
  const side = normalize(cross(normal, forward));
  const handedness = ant.id % 2 ? 1 : -1;
  let best: (ReturnType<typeof stepOnSupport> & { detour?: boolean }) | null =
      null,
    bestScore = -Infinity;
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
    const direction = add(
      scale(forward, modelMath.cos(turn)),
      scale(side, modelMath.sin(turn) * handedness),
    );
    const next = stepOnSupport(
      world.nest,
      start,
      turn === 0 ? target : add(start, scale(direction, speed)),
      speed,
      ant.angle,
    );
    const step = sub(next.position, start),
      travel = length(step);
    if (
      !next.valid ||
      travel < 0.0001 ||
      !supportedSegment(world.nest, start, next.position)
    )
      continue;
    const heading =
      modelMath.hypot(step.x, step.z) > 0.001
        ? modelMath.atan2(step.z, step.x)
        : ant.angle;
    const pitch = modelMath.atan2(step.y, modelMath.hypot(step.x, step.z));
    if (!positionClear(world, ant, next.position, heading, pitch, next.normal))
      continue;
    const score =
      dot(normalize(step), forward) +
      (travel / speed) * 0.2 -
      Math.abs(turn) * 0.015;
    if (score > bestScore) {
      best = turn === 0 ? next : { ...next, detour: true };
      bestScore = score;
    }
    if (turn === 0 && best) return best;
  }
  return best;
}
