import { recordDigEffort } from "../fatigue/terrarium.ts";
import { beginSoilHaul } from "./routing.ts";
import { distance3 } from "./ledger.ts";
import type { SoilAgent, SoilTask, SoilWorld } from "./types.ts";

const CAPACITY = 0.022;
/** Transfer loose material into cargo; it remains in the same mass ledger. */
export function repairSoil(
  world: SoilWorld,
  ant: SoilAgent,
  task: SoilTask,
): boolean {
  const rubble = world.nest.rubble?.find((p) => p.id === task.rubbleId);
  if (!rubble || rubble.mass < 0.0001) {
    if ((ant.carryingSoil || 0) > 0) beginSoilHaul(world, ant);
    else delete ant.soilTask;
    return true;
  }
  if (distance3({ x: ant.x, y: ant.y || 0, z: ant.z }, rubble) > 0.8) {
    const edge =
      rubble.edge === undefined ? null : world.nest.links[rubble.edge];
    if (edge && !ant.route?.length)
      ant.route = [edge[0] === ant.node ? edge[1] : edge[0]];
    if (ant.route?.length) world.moveInNest(ant);
    return true;
  }
  ant.state = "Removendo terra de um bloqueio";
  if (++task.digTicks % 5) return true;
  const mass = Math.min(0.007, rubble.mass, CAPACITY - (ant.carryingSoil || 0));
  recordDigEffort(world, ant, mass / 0.007);
  rubble.mass -= mass;
  ant.carryingSoil = (ant.carryingSoil || 0) + mass;
  world.nest.revision++;
  if (ant.carryingSoil >= CAPACITY - 0.0001 || rubble.mass < 0.0001) {
    // Walk back to the start of this segment before selecting a new route.
    if (ant.route?.length && ant.navigation) {
      ant.navigation.retreating = true;
      task.reversing = true;
      delete ant.supportMotion;
    }
    beginSoilHaul(world, ant);
  }
  return true;
}
