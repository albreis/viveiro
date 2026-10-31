import type { AgentState, NavigationWorld } from "./types.ts";
import { knownRoute } from "./route-memory.ts";
import { chooseLocalExit } from "./local-route-policy.ts";
const SEMANTIC = ["entrance", "royal", "nursery", "storage", "waste"];

export function atRouteGoal(
  world: NavigationWorld,
  ant: AgentState,
  node: number,
) {
  const intent = ant.routeIntent;
  if (!intent) return true;
  const target = world.nest.nodes[node];
  return intent.tag === "node"
    ? node === intent.destination
    : target.type === intent.tag && (target.colonyId || 1) === intent.owner;
}
export function continueLocalRoute(
  world: NavigationWorld,
  ant: AgentState,
  blocked: [number, number] | null = null,
) {
  const intent = ant.routeIntent;
  if (!intent || ant.node == null) return false;
  if (atRouteGoal(world, ant, ant.node)) {
    delete ant.routeIntent;
    ant.route = [];
    return false;
  }
  const known = knownRoute(
    ant.knownEdges || [],
    ant.node,
    intent.destination,
    blocked,
  );
  if (known.length && world.range(0, 1) > 0.04) {
    ant.route = known;
    return true;
  }
  const from = world.nest.nodes[ant.node];
  let neighbors = world.nest.links.flatMap(([a, b]) =>
    a === ant.node ? [b] : b === ant.node ? [a] : [],
  );
  neighbors = [...new Set(neighbors)];
  const alternatives = blocked
    ? neighbors.filter(
        (id) =>
          !(
            (ant.node === blocked[0] && id === blocked[1]) ||
            (ant.node === blocked[1] && id === blocked[0])
          ),
      )
    : neighbors;
  if (alternatives.length) neighbors = alternatives;
  const options = neighbors.map((id) => {
    const node = world.nest.nodes[id],
      length = Math.hypot(node.x - from.x, node.y - from.y, node.z - from.z);
    return {
      id,
      signal:
        world.routeSignal?.(ant.node!, id, intent.odor, intent.owner) || 0,
      visited: (ant.recentNodes || []).includes(id),
      backtrack: ant.recentNodes?.at(-1) === id,
      goalVisible:
        length <= 1.2 &&
        (intent.tag === "node"
          ? id === intent.destination
          : node.type === intent.tag && (node.colonyId || 1) === intent.owner),
    };
  });
  const choice = chooseLocalExit(options, () => world.range(0, 1));
  ant.route = choice === null ? [] : [choice];
  return choice !== null;
}
export function requestRoute(
  world: NavigationWorld,
  ant: AgentState,
  destination: number,
) {
  const node = world.nest.nodes[destination];
  if (!node || ant.node == null) return;
  const oldHead = ant.route?.[0],
    center = ant.tunnelCenter;
  const from = world.nest.nodes[ant.node];
  const underway =
    oldHead !== undefined &&
    center &&
    Math.hypot(center.x - from.x, center.y - from.y, center.z - from.z) > 0.03;
  ant.routeIntent = {
    destination,
    tag: SEMANTIC.includes(node.type) ? node.type : "node",
    odor: SEMANTIC.includes(node.type)
      ? node.type
      : node.type === "front" || node.type === "chamber"
        ? "front"
        : "entrance",
    owner: ant.colonyId || 1,
  };
  if (underway) {
    ant.route = [oldHead];
    return;
  }
  ant.lastNodeDistance = ant.distanceWalked || 0;
  continueLocalRoute(world, ant);
}
