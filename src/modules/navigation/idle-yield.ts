import type { AgentState, NavigationWorld } from "./types.ts";
import { loaded } from "./social-forces.ts";

/**
 * Optional traffic rule: idle workers give way to workers on a task.
 * Ants avoid time-consuming interactions in crowded traffic (Poissonnier et
 * al. 2019) and idle workers keep out of the way of excavators in narrow
 * tunnels (Aguilar et al. 2018). Off unless `nest.traffic.idleYield` is set,
 * so existing seeds, saves and published outputs keep their trajectories.
 */
export const idleYieldOn = (world: Pick<NavigationWorld, "nest">) =>
  !!world.nest.traffic?.idleYield;

export function enableIdleYield(world: Pick<NavigationWorld, "nest">) {
  world.nest.traffic = { ...world.nest.traffic, idleYield: true };
}

/** Carrying something or holding a soil task (digging, hauling, returning). */
export const working = (ant: AgentState) =>
  loaded(ant) || !!(ant as AgentState & { soilTask?: unknown }).soilTask;

export const idleWorker = (ant: AgentState) =>
  ant.kind === "worker" &&
  !working(ant) &&
  !(ant as AgentState & { bioTask?: unknown }).bioTask;

/**
 * An idle worker that a working ant may pass over or squeeze past: one
 * stepping aside, or one resting. Ants in crowded galleries walk over idle
 * nestmates; a resting worker does not hold its place against one at work.
 */
export const givingWay = (world: NavigationWorld, ant: AgentState) =>
  idleWorker(ant) &&
  (world.tick < (ant.navigation?.yieldUntil || 0) ||
    ((ant as AgentState & { rest?: number }).rest || 0) > 0);
