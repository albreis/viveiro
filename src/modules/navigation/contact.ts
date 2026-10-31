import type {
  AgentState,
  NavigationWorld,
  NavigationState,
  Vec3,
} from "./types.ts";
import type { SocialForceResult } from "./social-forces.ts";
import { loaded } from "./social-forces.ts";
import { normalize, rotate, scale, add, cross } from "./vectors.ts";

export function navigationState(ant: AgentState): NavigationState {
  ant.navigation ??= {
    velocity: { x: 0, y: 0, z: 0 },
    contactTicks: 0,
    stagnantTicks: 0,
    lastCell: "",
    turnUntil: 0,
    turnAngle: 0,
    wallAngle: 0.35,
    retreats: 0,
  };
  return ant.navigation;
}

export function contactResponse(
  world: NavigationWorld,
  ant: AgentState,
  forces: SocialForceResult,
  forward: Vec3,
  normal: Vec3,
): Vec3 {
  const nav = navigationState(ant);
  nav.contactTicks = forces.frontal
    ? nav.contactTicks + 1
    : Math.max(0, nav.contactTicks - 1);
  if (nav.contactTicks >= 4 && world.tick >= nav.turnUntil) {
    nav.turnAngle = world.range(Math.PI / 6, Math.PI / 2);
    nav.turnUntil = world.tick + world.range(6, 12);
  }
  const yielding = forces.frontal && loaded(forces.frontal) && !loaded(ant);
  if (yielding && nav.contactTicks >= 3) {
    nav.yieldUntil = world.tick + 8 + (ant.id % 7);
  }
  if (world.tick < (nav.yieldUntil || 0)) {
    ant.state = "Cedendo passagem à carga";
    return normalize(
      add(scale(forward, -0.65), scale(cross(forward, normal), 0.75)),
    );
  }
  if (world.tick < nav.turnUntil) {
    ant.state = "Contato Antenal";
    return rotate(forward, normal, nav.turnAngle);
  }
  return forward;
}

export function recordCongestion(ant: AgentState) {
  const nav = navigationState(ant);
  const cell = [ant.x, ant.y || 0, ant.z]
    .map((v) => Math.floor(v / 0.4))
    .join(":");
  nav.stagnantTicks = cell === nav.lastCell ? nav.stagnantTicks + 1 : 0;
  nav.lastCell = cell;
}

export function widenCongestedTunnel(
  world: NavigationWorld,
  ant: AgentState,
  edgeIndex: number,
) {
  const nav = navigationState(ant);
  if (edgeIndex < 0 || ant.kind !== "worker") return false;
  if (nav.stagnantTicks > 65 && !nav.excavateUntil) {
    nav.excavateUntil = world.tick + 16;
    world.log(
      "Uma operária começou a alargar uma passagem congestionada.",
      "dig",
    );
  }
  if (!nav.excavateUntil) return false;
  if (world.tick >= nav.excavateUntil) {
    nav.excavateUntil = 0;
    nav.stagnantTicks = 0;
    return false;
  }
  ant.state = "Escavar";
  if (world.tick % 4 === 0) {
    world.nest.linkWidths ??= world.nest.links.map(() => 0.38);
    const before = world.nest.linkWidths[edgeIndex] || 0.38;
    const after = Math.min(0.64, before + 0.012);
    if (after > before) {
      world.nest.linkWidths[edgeIndex] = after;
      world.nest.revision++;
      ant.carryingSoil = (ant.carryingSoil || 0) + (after - before);
    }
  }
  return true;
}
