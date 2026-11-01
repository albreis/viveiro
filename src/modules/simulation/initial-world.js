import { NEST } from "./constants.js";
import { hashSeed } from "./seed.ts";
import { createNest } from "./nest.ts";
import { createSoilState } from "../soil/ledger.ts";
import { tunnelEnvelope } from "../terrain/terrain.js";
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export function initializeWorld(world, seed, parameters) {
  world.seed = String(seed);
  world.rng = hashSeed(seed);
  world.params = { humidity: 58, light: 72, randomness: 28, ...parameters };
  world.tick = 0;
  world.nextId = 1;
  world.food = 18;
  world.queenHealth = 100;
  world.ants = [];
  world.brood = [];
  world.predators = [];
  world.plants = [];
  world.patches = [];
  world.nest = createNest();
  world.soil = createSoilState();
  world.physicsVersion = 5;
  world.events = [];
  world.history = [];
  world.deaths = 0;
  world.born = 0;
  world.lastLaying = -50;
  world.lastRecord = -25;
  world.lastWarning = -1000;
  world.lastDiscovery = -1000;
  world.pheromones = new Array(40 * 26).fill(0);
  world.ants.push(world.makeAnt("queen", NEST.x, NEST.z));
  Object.assign(world.ants[0], world.nest.nodes[2], { kind: "queen", node: 2 });
  world.ants[0].x -= 0.34;
  world.ants[0].z -= 0.33;
  world.ants[0].tunnelY = world.nest.nodes[2].y;
  world.ants[0].y =
    tunnelEnvelope(
      world.nest,
      world.ants[0].x,
      world.ants[0].z,
      world.ants[0].tunnelY,
    ).floor + 0.008;
  world.ants.push(world.makeAnt("male", NEST.x + 0.8, NEST.z + 0.3));
  for (let i = 0; i < 32; i++) {
    let x = world.range(-8.7, 8.7),
      z = world.range(-5.2, 5.2);
    if (distance({ x, z }, NEST) < 1.6 || world.inPond(x, z)) {
      i--;
      continue;
    }
    world.plants.push({
      id: world.nextId++,
      x,
      z,
      biomass: world.range(0.45, 1),
      kind: i % 4,
    });
  }
  for (let i = 0; i < 12; i++) {
    const plant = world.plants[(i * 2 + 1) % world.plants.length];
    world.patches.push({
      id: world.nextId++,
      x: plant.x + 0.25,
      z: plant.z + 0.2,
      amount: world.range(1, 3.5),
      capacity: 4,
      discovered: false,
    });
  }
  world.addPredator(6, 3.5, false);
  world.addPredator(4.5, -4, false);
  world.log("Uma rainha e um macho. O começo de uma colônia.", "birth");
  world.record();
}
