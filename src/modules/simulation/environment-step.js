import { diffuseEvaporate } from "../chemistry/reaction-diffusion.ts";
import { updateLandscape } from "../landscape/dynamics.ts";
export function updateEnvironment(world) {
  world.tick++;
  const h = world.params.humidity / 100;
  const suitability = Math.max(0.02, 1 - Math.abs(h - 0.62) * 1.7);
  updateLandscape(world);
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
  return suitability;
}
