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
  const queen = world.ants.find((a) => a.kind === "queen");
  const consumption = (queen ? 0.004 : 0) + world.brood.length * 0.00065;
  const fed = world.food >= consumption;
  world.food = Math.max(0, world.food - consumption);
  if (queen) {
    world.queenHealth = clamp(
      world.queenHealth + (fed ? 0.018 : -0.09),
      0,
      100,
    );
    queen.energy = world.queenHealth;
    queen.state =
      world.tick < 40 ? "Preparando a primeira postura" : "Cuidando da colônia";
    if (
      world.tick >= 25 &&
      world.tick - world.lastLaying >= 65 &&
      world.food > 2 &&
      world.population + world.brood.length < LIMIT
    ) {
      const eggs = Math.min(
        4 + Math.floor(world.random() * 3),
        LIMIT - world.population - world.brood.length,
      );
      for (let i = 0; i < eggs; i++)
        world.brood.push({ id: world.nextId++, age: 0 });
      world.food = Math.max(0, world.food - eggs * 0.21);
      world.lastLaying = world.tick;
      world.log("A rainha colocou " + eggs + " ovos.", "birth");
    }
  }
  const remaining = [];
  let hatched = 0;
  for (const b of world.brood) {
    if (fed) b.age += 0.006 + suitability * 0.004;
    if (b.age >= 1.3 && world.population < LIMIT) {
      const ant = world.makeAnt(
        "worker",
        world.nest.nodes[3].x,
        world.nest.nodes[3].z,
      );
      ant.tunnelY = world.nest.nodes[3].y;
      ant.y =
        tunnelEnvelope(world.nest, ant.x, ant.z, ant.tunnelY).floor + 0.008;
      ant.node = 3;
      ant.route = nestPath(world.nest, 3, ant.id % 2 ? 0 : 6);
      world.ants.push(ant);
      world.born++;
      hatched++;
    } else remaining.push(b);
  }
  world.brood = remaining;
  if (hatched)
    world.log(
      hatched === 1
        ? "Uma operária nasceu e se juntou à colônia."
        : hatched + " operárias nasceram.",
      "birth",
    );

  return suitability;
}
