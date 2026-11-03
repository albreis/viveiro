import { modelMath } from "../../libs/model-math.ts";
import { edgePassable } from "../sealing/passage.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { finishSegment } from "./tunnel-arrival.ts";
import type {
  AgentState,
  NavigationWorld,
  NavigationState,
  Vec3,
} from "./types.ts";
interface Footing extends Vec3 {
  normal: Vec3;
  pitch: number;
  heading?: number;
  inside: boolean;
}
import { enterShaft } from "./entry-motion.ts";
import { leaveShaft } from "./exit-motion.ts";
import { tunnelFooting } from "../terrain/terrain.js";
import { neighborsOf } from "./sensors.ts";
import { socialForces } from "./social-forces.ts";
import {
  navigationState,
  contactResponse,
  recordCongestion,
  widenCongestedTunnel,
} from "./contact.ts";
import { positionClear } from "./collision.ts";
import { idleYieldOn, idleWorker, working } from "./idle-yield.ts";
import { NAVIGATION } from "./social-forces.ts";
import {
  startSupportedMotion,
  advanceSupportedMotion,
  settleSupport,
} from "./support-motion.ts";
import { normalize, sub, scale, add, dot, position } from "./vectors.ts";

export function moveInNest(world: NavigationWorld, ant: AgentState) {
  if (
    ant.node !== null &&
    ant.route[0] !== undefined &&
    !edgePassable(world.nest, ant.node, ant.route[0], ant)
  ) {
    delete ant.supportMotion;
    ant.route = [];
    ant.state = "Investigando o tampão com as antenas";
    return;
  }
  const nav = navigationState(ant);
  recordCongestion(ant);
  if (settleSupport(world, ant, ant.speed * 0.85)) return;
  if (ant.supportMotion) {
    advanceSupportedMotion(world, ant, ant.speed * 0.85);
    return;
  }
  if (ant.node === null) return;
  const blocked: [number, number] = [ant.node, ant.route[0]];
  const edgeIndex = world.nest.links.findIndex(
    ([a, b]) =>
      (a === blocked[0] && b === blocked[1]) ||
      (b === blocked[0] && a === blocked[1]),
  );
  if (widenCongestedTunnel(world, ant, edgeIndex)) return;
  const reversing = !!nav.retreating;
  const targetId = reversing ? ant.node : ant.route[0];
  const target = world.nest.nodes[targetId];
  if (!target) {
    ant.route = [];
    return;
  }
  const top = surfaceHeight(world.nest.relief, ant.x, ant.z),
    radial = modelMath.hypot(ant.x - target.x, ant.z - target.z);
  if (
    !reversing &&
    target.type === "entrance" &&
    radial > target.r + 0.08 &&
    radial < target.r + 0.75 &&
    (ant.y || 0) >= top - 0.012 &&
    (ant.normal?.y ?? 1) > 0.75
  ) {
    delete ant.supportMotion;
    finishSegment(world, ant, targetId, false, blocked);
    return;
  }
  const center = ant.tunnelCenter || {
    x: ant.x,
    y: ant.tunnelY ?? world.nest.nodes[ant.node]?.y ?? ant.y ?? 0,
    z: ant.z,
  };
  const from = world.nest.nodes[reversing ? ant.route[0] : ant.node] || center;
  const delta = sub(target, center),
    distance = modelMath.hypot(delta.x, delta.y, delta.z);
  if (distance < 0.001) {
    const top = surfaceHeight(world.nest.relief, target.x, target.z);
    if (
      target.type === "entrance" &&
      ((ant.y || 0) < top - 0.015 || (ant.normal?.y ?? 1) < 0.75) &&
      leaveShaft(world, ant, target, center, edgeIndex)
    )
      return;
    finishSegment(world, ant, targetId, reversing, blocked);
    return;
  }
  if (!reversing && enterShaft(world, ant, from, target, center)) return;
  if (leaveShaft(world, ant, target, center, edgeIndex)) return;
  const forward = normalize(delta),
    normal = ant.normal || { x: 0, y: 1, z: 0 };
  const neighbors = neighborsOf(world, ant),
    speed = ant.speed * 0.85;
  const idleYield = idleYieldOn(world);
  if (
    idleYield &&
    idleWorker(ant) &&
    world.tick >= (nav.yieldUntil || 0) &&
    neighbors.some(
      (o) =>
        working(o) &&
        modelMath.hypot(o.x - ant.x, (o.y || 0) - (ant.y || 0), o.z - ant.z) <
          NAVIGATION.safetyRadius,
    )
  )
    nav.yieldUntil = world.tick + 8 + (ant.id % 7);
  const initial = socialForces(ant, neighbors, forward, speed, {
    normal,
    climb: true,
    idleYield,
  });
  const preferred = contactResponse(world, ant, initial, forward, normal);
  const force = socialForces(ant, neighbors, preferred, speed, {
    normal,
    climb: true,
    idleYield,
  });
  nav.velocity = force.velocity;
  if (
    !reversing &&
    ((nav.stagnantTicks > 18 + (ant.id % 17) &&
      (initial.frontal || force.pressure > 0.1)) ||
      (dot(preferred, forward) < 0 && nav.contactTicks > 3))
  ) {
    nav.retreating = true;
    ant.state = "Recuando para liberar passagem";
    return;
  }
  const rest = modelMath.atan2(
    modelMath.sin(0.35 - nav.wallAngle),
    modelMath.cos(0.35 - nav.wallAngle),
  );
  nav.wallAngle +=
    force.pressure > 0.1 ? 0.035 : Math.max(-0.015, Math.min(0.015, rest));
  const step = Math.min(
    distance,
    Math.max(speed * 0.2, dot(force.velocity, forward)),
  );
  const next = add(center, scale(forward, step));
  let footing: Footing | null = null;
  let bestCost = Infinity;
  const vertical =
    Math.abs(target.y - from.y) >
    modelMath.hypot(target.x - from.x, target.z - from.z) * 1.5;
  for (const angle of [
    nav.wallAngle,
    nav.wallAngle + 0.08,
    nav.wallAngle - 0.08,
    vertical ? nav.wallAngle + Math.PI : -nav.wallAngle,
    ...Array.from({ length: 16 }, (_, i) => (i * Math.PI) / 8),
  ]) {
    const candidate = tunnelFooting(
      world.nest,
      next,
      from,
      target,
      angle,
    ) as Footing;
    const heading =
      candidate.heading ??
      modelMath.atan2(target.z - from.z, target.x - from.x);
    if (
      candidate.inside &&
      positionClear(
        world,
        ant,
        candidate,
        heading,
        candidate.pitch,
        candidate.normal,
      )
    ) {
      const cost =
        modelMath.pow(candidate.x - ant.x, 2) +
        modelMath.pow(candidate.y - (ant.y || 0), 2) +
        modelMath.pow(candidate.z - ant.z, 2);
      if (cost < bestCost) {
        footing = candidate;
        bestCost = cost;
        nav.wallAngle = angle;
        if (cost < speed * speed * 0.8 && dot(normal, candidate.normal) > 0.85)
          break;
      }
    }
  }
  if (!footing) {
    ant.state = "Contato Antenal";
    return;
  }
  const physicalDistance = modelMath.hypot(
    footing.x - ant.x,
    footing.y - (ant.y || 0),
    footing.z - ant.z,
  );
  if (physicalDistance > speed || dot(normal, footing.normal) < 0.75) {
    startSupportedMotion(world, ant, footing, footing.normal, next);
    advanceSupportedMotion(world, ant, speed);
    return;
  }
  nav.velocity = sub(footing, position(ant));
  ant.distanceWalked =
    (ant.distanceWalked || 0) +
    modelMath.hypot(
      footing.x - ant.x,
      footing.y - (ant.y || 0),
      footing.z - ant.z,
    );
  Object.assign(ant, {
    x: footing.x,
    y: footing.y,
    z: footing.z,
    tunnelY: next.y,
    tunnelCenter: next,
    normal: footing.normal,
    pitch: footing.pitch,
    angle:
      footing.heading ?? modelMath.atan2(target.z - from.z, target.x - from.x),
  });
  if (reversing) ant.state = "Recuando para liberar passagem";
  else if (nav.contactTicks < 4)
    ant.state = ant.carrying
      ? "Indo para a despensa"
      : "Percorrendo uma galeria";
  if (distance <= step + 0.001)
    finishSegment(world, ant, targetId, reversing, blocked);
}
