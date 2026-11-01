import type { ColonyAgent, ColonyWorld } from "./types.ts";
import { nestPath } from "../simulation/nest.ts";
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
  if (node !== task.destination) {
    ant.route = nestPath(world.nest, node, task.destination);
    return true;
  }
  ant.route = [];
  if (world.nest.nodes[node].type === "storage") feedFromStock(world, ant);
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
