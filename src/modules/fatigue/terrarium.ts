import { surfaceHeight } from "../landscape/queries.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import type { SoilClimate } from "../microclimate/types.ts";
import type { AgentState, NavigationWorld, Vec3 } from "../navigation/types.ts";
import { position } from "../navigation/vectors.ts";
import {
  climateCost,
  digReadiness,
  EFFORT_PROFILE,
  locomotionEffort,
  spendEffort,
} from "./effort-model.ts";

export interface EffortEnvironment {
  biologicalProfile?: import("../biology/types.ts").BiologicalReference;
  microclimate?: SoilClimate;
  params?: {
    temperatureC?: number;
    windX?: number;
    windZ?: number;
  };
}

export function effortEnabled(world: EffortEnvironment, ant: AgentState) {
  return (
    world.biologicalProfile?.id === EFFORT_PROFILE &&
    world.biologicalProfile.version === 1 &&
    ant.kind === "worker"
  );
}

function spendLocal(
  world: NavigationWorld,
  ant: AgentState,
  point: Vec3,
  work: number,
  exposed: boolean,
) {
  if (work <= 0) return;
  const soil = sampleClimate(world.microclimate, point);
  const airTemperature = world.params?.temperatureC ?? 24;
  const factor = climateCost({
    temperature: exposed
      ? airTemperature
      : (soil?.temperature ?? airTemperature),
    water: soil?.water,
  });
  ant.effort = spendEffort(ant.effort, world.tick, work * factor);
}

export function recordMotionEffort(
  world: NavigationWorld,
  ant: AgentState,
  step: Vec3 | null,
  detour = false,
  onSurface = false,
) {
  if (!effortEnabled(world, ant)) return;
  const point = position(ant);
  const exposed =
    onSurface ||
    point.y >= surfaceHeight(world.nest.relief, point.x, point.z) - 0.06;
  const load =
    ant.carrying / 0.65 +
    (ant.carryingSoil ?? 0) / 0.022 +
    (ant.carryingBrood || ant.carryingMimic || ant.carryingWaste ? 1 : 0);
  const work = locomotionEffort(
    step,
    ant.normal?.y ?? 1,
    load,
    detour,
    exposed ? world.params?.windX : 0,
    exposed ? world.params?.windZ : 0,
  );
  spendLocal(world, ant, point, work, exposed);
}

export function recordDigEffort(
  world: NavigationWorld,
  ant: AgentState,
  biteFraction: number,
) {
  if (effortEnabled(world, ant))
    spendLocal(world, ant, position(ant), 0.3 * biteFraction, false);
}

export function readyForDigBite(
  world: NavigationWorld & { random(): number },
  ant: AgentState,
) {
  return (
    !effortEnabled(world, ant) ||
    !ant.effort ||
    world.random() < digReadiness(ant.effort, world.tick)
  );
}
