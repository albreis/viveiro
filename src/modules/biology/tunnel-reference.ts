import { sampleClimate } from "../microclimate/grid.ts";
import type { AgentState, NavigationWorld } from "../navigation/types.ts";
import {
  temperatureWalkingFactor,
  workerReference,
  workerSizeFactor,
} from "./worker-reference.ts";

export function tunnelWalkingSpeed(
  world: NavigationWorld,
  ant: AgentState,
  speed: number,
) {
  const reference = workerReference(world, ant);
  if (!reference?.tunnelWalking) return speed;
  const { wallFactor, soilLoadFactor } = reference.tunnelWalking;
  const local = sampleClimate(world.microclimate, {
    x: ant.x,
    y: ant.y ?? 0,
    z: ant.z,
  });
  const temperature = local?.temperature ?? world.params?.temperatureC ?? 24;
  const wall = 1 - Math.max(0, ant.normal?.y ?? 1);
  const soil = Math.min(1, (ant.carryingSoil ?? 0) / 0.022);
  const seed =
    (ant.carrying > 0 || ant.seedRation) && reference.seedForaging
      ? workerSizeFactor(
          reference,
          ant,
          reference.seedForaging.loadedWalkingFactor,
        )
      : 1;
  return (
    speed *
    temperatureWalkingFactor(reference, temperature) *
    (1 - wall * (1 - wallFactor)) *
    (1 - soil * (1 - soilLoadFactor)) *
    seed
  );
}
