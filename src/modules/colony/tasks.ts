import { roomNode } from "./rooms.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import type { ColonyAgent, ColonyWorld } from "./types.ts";
import { enterForSoil } from "../soil/routing.ts";
import { advanceSupportedMotion } from "../navigation/support-motion.ts";
import { arriveColony } from "./arrival.ts";

export function updateColonyTask(
  world: ColonyWorld,
  ant: ColonyAgent,
): boolean {
  const task = ant.bioTask;
  if (!task) return false;
  if (task.placing) {
    if (ant.supportMotion) {
      advanceSupportedMotion(world, ant, ant.speed * 0.85);
      return true;
    }
    if (task.kind === "brood") {
      const brood = world.brood.find((b) => b.id === task.item);
      if (brood) {
        delete brood.carrier;
        Object.assign(brood, {
          x: ant.x,
          y: (ant.y || 0) + 0.025,
          z: ant.z,
          node: task.destination,
        });
      }
      ant.carryingBrood = 0;
    } else {
      const waste = world.colony.waste.find((w) => w.id === task.item);
      if (waste) {
        delete waste.carrier;
        Object.assign(waste, {
          x: ant.x,
          y: (ant.y || 0) + 0.025,
          z: ant.z,
          stored: true,
        });
        world.colony.cemeteryMass += waste.mass;
      }
      ant.carryingWaste = 0;
    }
    delete ant.bioTask;
    return true;
  }
  if (task.until) {
    ant.state =
      ant.crop > 0.02 ? "Cuidando da rainha" : "Buscando alimento social";
    if (world.tick >= task.until) {
      delete ant.bioTask;
      requestRoute(world, ant, roomNode(world.nest, "storage"));
    }
    return true;
  }
  if (ant.node == null) {
    enterForSoil(world, ant, task.destination);
    ant.state =
      task.kind === "waste"
        ? "Levando resíduos ao cemitério"
        : "Voltando ao berçário";
    return true;
  }
  if (ant.route?.length) {
    world.moveInNest(ant);
    return true;
  }
  if (ant.node === task.destination) arriveColony(world, ant, ant.node);
  else requestRoute(world, ant, task.destination);
  return true;
}
