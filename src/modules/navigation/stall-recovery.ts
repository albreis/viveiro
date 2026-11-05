import { recordMotionEffort } from "../fatigue/terrarium.ts";
import { modelMath } from "../../libs/model-math.ts";
import type { AgentState, NavigationWorld, Vec3 } from "./types.ts";
import { navigationState } from "./contact.ts";
import { chooseSupportedStep } from "./support-step.ts";
import { sampleSupport } from "../terrain/field.ts";
import {
  add,
  sub,
  scale,
  dot,
  length,
  normalize,
  cross,
  position,
} from "./vectors.ts";
function tangent(direction: Vec3, normal: Vec3) {
  let value = sub(direction, scale(normal, dot(direction, normal)));
  if (length(value) < 0.001) value = cross(normal, { x: 0, y: 1, z: 0 });
  if (length(value) < 0.001) value = cross(normal, { x: 1, y: 0, z: 0 });
  return normalize(value);
}
/** Physical progress, independent of grid-cell jitter or changing route waypoints. */
export function recoverStall(world: NavigationWorld, ant: AgentState) {
  const nav = navigationState(ant),
    here = position(ant);
  if (!ant.route?.length || ant.node == null) {
    delete nav.progressAnchor;
    return false;
  }
  if (!nav.progressAnchor || length(sub(here, nav.progressAnchor)) > 0.35) {
    nav.progressAnchor = here;
    nav.progressSince = world.tick;
    delete nav.escapeDirection;
    return false;
  }
  if (
    world.tick - (nav.progressSince ?? world.tick) < 70 &&
    !nav.escapeDirection
  )
    return false;
  const normal = ant.normal ?? { x: 0, y: 1, z: 0 };
  if (Math.abs(sampleSupport(world.nest, here).distance - 0.008) > 0.03)
    return false;
  if (!nav.escapeDirection) {
    const forward = tangent(
      {
        x: modelMath.cos(ant.angle) * modelMath.cos(ant.pitch || 0),
        y: modelMath.sin(ant.pitch || 0),
        z: modelMath.sin(ant.angle) * modelMath.cos(ant.pitch || 0),
      },
      normal,
    );
    const side = cross(normal, forward),
      sign = ant.id % 2 ? 1 : -1;
    nav.escapeDirection = normalize(
      add(scale(side, sign), scale(forward, -0.35)),
    );
    nav.escapeUntil = world.tick + 55;
    delete ant.supportMotion;
    nav.retreating = false;
  }
  if (world.tick >= (nav.escapeUntil ?? 0)) {
    delete nav.escapeDirection;
    nav.progressSince = world.tick;
    return false;
  }
  const direction = tangent(nav.escapeDirection, normal),
    speed = ant.speed * 0.85;
  const step = chooseSupportedStep(
    world,
    ant,
    add(here, scale(direction, 0.8)),
    speed,
  );
  if (!step) {
    recordMotionEffort(world, ant, null);
    return false;
  }
  const delta = sub(step.position, here),
    travel = length(delta);
  Object.assign(ant, step.position, {
    normal: step.normal,
    angle: modelMath.atan2(delta.z, delta.x),
    pitch: modelMath.atan2(delta.y, modelMath.hypot(delta.x, delta.z)),
    state: "Buscando espaço para liberar o fluxo",
    distanceWalked: (ant.distanceWalked || 0) + travel,
  });
  recordMotionEffort(world, ant, delta, true);
  nav.velocity = delta;
  nav.stagnantTicks = 0;
  // Update only the abstract position on the current, locally known edge.
  const from = world.nest.nodes[ant.node],
    to = world.nest.nodes[ant.route[0]];
  if (from && to) {
    const axis = sub(to, from),
      t = Math.max(
        0,
        Math.min(
          1,
          dot(sub(position(ant), from), axis) / (dot(axis, axis) || 1),
        ),
      );
    ant.tunnelCenter = add(from, scale(axis, t));
    ant.tunnelY = ant.tunnelCenter.y;
  }
  return true;
}
