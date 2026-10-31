import type { AgentState, NavigationWorld } from "./types.ts";
import { nestPath } from "../simulation/nest.ts";
import { navigationState } from "./contact.ts";
function rerouteAfterRetreat(
  world: NavigationWorld,
  ant: AgentState,
  blocked: [number, number],
) {
  if (ant.node === null) return;
  const destination = ant.route.at(-1);
  let route = nestPath(world.nest, ant.node, destination, blocked);
  if (!route.length) {
    const exits = world.nest.nodes
      .map((node, id) => ({ ...node, id }))
      .filter((n) => n.type === "entrance");
    for (const exit of exits) {
      route = nestPath(world.nest, ant.node, exit.id, blocked);
      if (route.length) {
        ant.avoidEntrance = exit.id;
        ant.avoidEntranceUntil = world.tick + 250;
        break;
      }
    }
  }
  if (route.length) ant.route = route;
}

export function finishSegment(
  world: NavigationWorld,
  ant: AgentState,
  targetId: number,
  reversing: boolean,
  blocked: [number, number],
) {
  const nav = navigationState(ant);
  if (reversing) {
    nav.retreating = false;
    nav.stagnantTicks = 0;
    nav.contactTicks = 0;
    if (world.nest.nodes[targetId].type === "entrance") {
      ant.avoidEntrance = targetId;
      ant.avoidEntranceUntil = world.tick + 250;
      ant.route = [];
      ant.y = 0;
      ant.node = null;
      ant.tunnelCenter = null;
      ant.tunnelY = 0;
      ant.normal = { x: 0, y: 1, z: 0 };
      ant.pitch = 0;
      ant.state = "Buscando outro acesso";
      nav.retreats++;
      return;
    }
    nav.retreats++;
    rerouteAfterRetreat(world, ant, blocked);
    ant.state = "Reavaliando o caminho";
    return;
  }
  ant.node = ant.route.shift() ?? targetId;
  if (ant.route.length) return;
  const target = world.nest.nodes[targetId];
  if (world.onNestArrival?.(ant, targetId)) return;
  if (target.type === "storage") {
    world.food += ant.carrying;
    ant.carrying = 0;
    if (world.onStorageVisit) world.onStorageVisit(ant);
    else if (world.food > 0.15) {
      world.food -= 0.15;
      ant.energy = 100;
    }
    ant.route = nestPath(world.nest, ant.node, ant.id % 2 ? 0 : 6);
  } else if (target.type !== "entrance") {
    ant.route = nestPath(world.nest, ant.node, ant.id % 2 ? 0 : 6);
  } else {
    ant.y = 0;
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
