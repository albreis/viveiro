import { finishLearningEdge } from "../learning/live.ts";
import { roomNode, isStock } from "../colony/rooms.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { requestRoute } from "./local-routing.ts";
import type { AgentState, NavigationWorld } from "./types.ts";
import { continueLocalRoute, atRouteGoal } from "./local-routing.ts";
import { rememberSegment } from "./route-memory.ts";
import { navigationState } from "./contact.ts";
export function finishSegment(
  world: NavigationWorld,
  ant: AgentState,
  targetId: number,
  reversing: boolean,
  blocked: [number, number],
) {
  const nav = navigationState(ant);
  if (reversing) {
    finishLearningEdge(world, ant, false, true);
    nav.retreating = false;
    nav.stagnantTicks = 0;
    nav.contactTicks = 0;
    if (world.routeSignal && ant.routeIntent) {
      if (atRouteGoal(world, ant, targetId)) ant.route = [targetId];
      else continueLocalRoute(world, ant, blocked);
      return;
    }
    if (world.nest.nodes[targetId].type === "entrance") {
      ant.avoidEntrance = targetId;
      ant.avoidEntranceUntil = world.tick + 250;
      ant.route = [];
      ant.y = surfaceHeight(world.nest.relief, ant.x, ant.z) + 0.008;
      ant.node = null;
      ant.tunnelCenter = null;
      ant.tunnelY = 0;
      ant.normal = { x: 0, y: 1, z: 0 };
      ant.pitch = 0;
      ant.lastEntrance = {
        node: targetId,
        x: world.nest.nodes[targetId].x,
        z: world.nest.nodes[targetId].z,
      };
      ant.state = "Buscando outro acesso";
      nav.retreats++;
      return;
    }
    nav.retreats++;
    ant.route = [];
    ant.state = "Reavaliando o caminho";
    return;
  }
  finishLearningEdge(world, ant, atRouteGoal(world, ant, targetId));
  const previousNode = ant.node;
  ant.node = ant.route.shift() ?? targetId;
  if (previousNode !== null)
    rememberSegment(world, ant, previousNode, ant.node);
  if (ant.route.length) return;
  if (ant.routeIntent && !atRouteGoal(world, ant, targetId)) {
    continueLocalRoute(world, ant);
    return;
  }
  delete ant.routeIntent;
  const target = world.nest.nodes[targetId];
  if (target.type === "entrance")
    ant.lastEntrance = { node: targetId, x: target.x, z: target.z };
  if (world.onNestArrival?.(ant, targetId)) return;
  if (isStock(world.nest, targetId, ant.colonyId || 1)) {
    world.food += ant.carrying;
    ant.carrying = 0;
    if (world.onStorageVisit) world.onStorageVisit(ant);
    else if (world.food > 0.15) {
      world.food -= 0.15;
      ant.energy = 100;
    }
    requestRoute(
      world,
      ant,
      roomNode(world.nest, "entrance", ant.id % 2, ant.colonyId || 1),
    );
  } else if (target.type !== "entrance") {
    requestRoute(
      world,
      ant,
      roomNode(world.nest, "entrance", ant.id % 2, ant.colonyId || 1),
    );
  } else {
    ant.y = surfaceHeight(world.nest.relief, ant.x, ant.z) + 0.008;
    ant.node = null;
    ant.tunnelCenter = null;
    ant.tunnelY = 0;
    ant.normal = { x: 0, y: 1, z: 0 };
    ant.pitch = 0;
    ant.state = "Explorando";
    ant.angle = world.range(0, Math.PI * 2);
    nav.velocity = { x: 0, y: 0, z: 0 };
  }
}
