import { requestRoute } from "../navigation/local-routing.ts";
import type { SoilAgent, SoilWorld } from "./types.ts";
import { distance3 } from "./ledger.ts";
import { startSupportedMotion } from "../navigation/support-motion.ts";

export function soilEntrance(world: SoilWorld, ant: SoilAgent) {
  if (ant.node != null) {
    if (world.nest.nodes[ant.node].type === "entrance") return ant.node;
    return (
      ant.lastEntrance?.node ??
      world.nest.nodes.findIndex(
        (n) =>
          n.type === "entrance" && (n.colonyId || 1) === (ant.colonyId || 1),
      )
    );
  }
  const known = ant.lastEntrance;
  if (
    known &&
    !(ant.avoidEntranceUntil! > world.tick && ant.avoidEntrance === known.node)
  )
    return known.node;
  const visible = world.nest.nodes
    .map((node, index) => ({ ...node, index }))
    .filter(
      (n) =>
        n.type === "entrance" &&
        Math.hypot(n.x - ant.x, n.z - ant.z) < 2.3 &&
        !(
          ant.avoidEntranceUntil! > world.tick && ant.avoidEntrance === n.index
        ),
    );
  visible.sort(
    (a, b) =>
      Math.hypot(a.x - ant.x, a.z - ant.z) -
      Math.hypot(b.x - ant.x, b.z - ant.z),
  );
  return visible[0]?.index ?? -1;
}
export function beginSoilHaul(world: SoilWorld, ant: SoilAgent) {
  const task = ant.soilTask;
  if (!task || ant.node == null) return;
  task.phase = "haul";
  task.entrance = soilEntrance(world, ant);
  if (task.reversing) return;
  requestRoute(world, ant, task.entrance);
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
  } else if (task.phase === "return") {
    const project = world.soil.projects.find((p) => p.id === task.projectId);
    if (task.rubbleId && node === task.sourceNode) task.phase = "repair";
    else if (project && node === project.front) task.phase = "dig";
  }
  return true;
}
export function enterForSoil(world: SoilWorld, ant: SoilAgent, target: number) {
  const entranceId = soilEntrance(world, ant);
  if (entranceId < 0) {
    world.moveSurface(ant, ant.angle + world.range(-0.4, 0.4), ant.speed);
    ant.state = "Procurando uma entrada";
    return;
  }
  const entrance = world.nest.nodes[entranceId];
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
  requestRoute(world, ant, target);
}
