import { isStock } from "./rooms.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import type { ColonyAgent, ColonyWorld } from "./types.ts";
import { feedFromStock } from "./nutrition.ts";
import { broodPosition } from "./brood.ts";
import { startSupportedMotion } from "../navigation/support-motion.ts";

export function arriveColony(
  world: ColonyWorld,
  ant: ColonyAgent,
  node: number,
): boolean {
  const task = ant.bioTask;
  if (!task) return false;
  if (
    node !== task.destination &&
    world.nest.nodes[node].type === world.nest.nodes[task.destination].type &&
    ["entrance", "royal", "nursery", "storage", "waste"].includes(
      world.nest.nodes[node].type,
    )
  )
    task.destination = node;
  if (node !== task.destination) {
    requestRoute(world, ant, task.destination);
    return true;
  }
  ant.route = [];
  if (isStock(world.nest, node)) feedFromStock(world, ant);
  if (task.kind === "brood" || task.kind === "waste") {
    const support = broodPosition(world, task.item!, node);
    task.placing = true;
    startSupportedMotion(
      world,
      ant,
      support.point,
      support.normal,
      world.nest.nodes[node],
    );
  } else if (task.kind === "care") task.until = world.tick + 15;
  else {
    ant.node = null;
    ant.tunnelCenter = null;
    ant.tunnelY = 0;
    delete ant.bioTask;
    ant.state = "Vigiando a entrada";
  }
  return true;
}
