import { diffuseEvaporate } from "../chemistry/reaction-diffusion.ts";
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
  diffuseEvaporate(world.pheromones, {
    width: 40,
    height: 26,
    cellSize: 0.5,
    diffusion: 0.008 + h * 0.008,
    decay: 0.012 + (1 - h) * 0.012,
    dt: 1,
    windX: world.params.windX || 0,
    windZ: world.params.windZ || 0,
  });
  updateBroodLifecycle(world, suitability);
  return suitability;
}
