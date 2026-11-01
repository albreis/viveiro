import type { SoilAgent, SoilWorld } from "./types.ts";
import { nestPath } from "../simulation/nest.ts";
import { distance3 } from "./ledger.ts";
import { startSupportedMotion } from "../navigation/support-motion.ts";

export function soilEntrance(world: SoilWorld, ant: SoilAgent) {
  let best = 0,
    bestDistance = Infinity;
  world.nest.nodes.forEach((node, i) => {
    if (node.type !== "entrance") return;
    const route = ant.node == null ? [] : nestPath(world.nest, ant.node, i);
    const distance =
      ant.node == null
        ? Math.hypot(ant.x - node.x, ant.z - node.z)
        : route.reduce(
            (n, id, j) =>
              n +
              distance3(
                world.nest.nodes[j ? route[j - 1] : ant.node!],
                world.nest.nodes[id],
              ),
            0,
          );
    if (
      (ant.node == null || route.length || ant.node === i) &&
      distance < bestDistance
    ) {
      best = i;
      bestDistance = distance;
    }
  });
  return best;
}
export function beginSoilHaul(world: SoilWorld, ant: SoilAgent) {
  const task = ant.soilTask;
  if (!task || ant.node == null) return;
  task.phase = "haul";
  task.entrance = soilEntrance(world, ant);
  if (task.reversing) return;
  ant.route = nestPath(world.nest, ant.node, task.entrance);
  if (ant.node === task.entrance) world.onNestArrival?.(ant, task.entrance);
}
export function arriveWithSoil(
  world: SoilWorld,
  ant: SoilAgent,
  node: number,
): boolean {
  const task = ant.soilTask;
  if (!task) return false;
  ant.route = [];
  if (
    world.nest.nodes[node].type === "storage" &&
    ant.energy < 85 &&
    world.food >= 0.15
  ) {
    world.food -= 0.15;
    ant.energy = 100;
  }
  if (world.nest.nodes[node].type === "entrance" && task.phase === "haul") {
    task.phase = "dump";
    task.entrance = node;
    const entrance = world.nest.nodes[node];
    const dx = ant.x - entrance.x,
      dz = ant.z - entrance.z,
      size = Math.hypot(dx, dz) || 1;
    const target = {
      x: entrance.x + (dx / size || 1) * 0.68,
      y: 0.008,
      z: entrance.z + (dz / size) * 0.68,
    };
    startSupportedMotion(world, ant, target, { x: 0, y: 1, z: 0 }, target);
    ant.node = null;
  } else if (task.phase === "return")
    task.phase = task.rubbleId ? "repair" : "dig";
  return true;
}
export function enterForSoil(world: SoilWorld, ant: SoilAgent, target: number) {
  const entranceId = soilEntrance(world, ant),
    entrance = world.nest.nodes[entranceId];
  const d = Math.hypot(entrance.x - ant.x, entrance.z - ant.z);
  if (d > 0.6) {
    world.moveSurface(
      ant,
      Math.atan2(entrance.z - ant.z, entrance.x - ant.x),
      ant.speed,
    );
    ant.state = "Voltando à escavação";
    return;
  }
  ant.node = entranceId;
  ant.tunnelCenter = { x: entrance.x, y: entrance.y, z: entrance.z };
  ant.tunnelY = entrance.y;
  ant.route = nestPath(world.nest, entranceId, target);
}
