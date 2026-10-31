import { updateBroodLifecycle } from "../colony/lifecycle.ts";
import { NEST, LIMIT, BOUNDS } from "./constants.js";
import { nestPath } from "./nest.ts";
import { tunnelEnvelope } from "../terrain/terrain.js";
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export function updateEnvironment(world) {
  world.tick++;
  const h = world.params.humidity / 100,
    light = world.params.light / 100;
  const suitability = Math.max(0.02, 1 - Math.abs(h - 0.62) * 1.7);
  const plantGrowth = light * suitability;
  for (const p of world.plants)
    p.biomass = clamp(
      p.biomass + (plantGrowth * 0.002 - 0.00045) * (1.15 - p.biomass),
      0.04,
      1.1,
    );
  for (const p of world.patches) {
    if (!p.supplemental)
      p.amount = Math.min(p.capacity, p.amount + plantGrowth * 0.0028);
  }
  for (let i = 0; i < world.pheromones.length; i++)
    world.pheromones[i] *= 0.986;
  updateBroodLifecycle(world, suitability);
  return suitability;
}
