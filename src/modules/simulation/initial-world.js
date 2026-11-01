import { createSocialChemistry } from "../social-chemistry/types.ts";
import { initializeFounding } from "../founding/initialize.ts";
import { createGenetics } from "../genetics/reproduction.ts";
import { createColonyState } from "../colony/individual.ts";
import { createNestOdors } from "../chemistry/nest-odors.ts";
import { hashSeed } from "./seed.ts";
import { createNest } from "./nest.ts";
import { createSoilState } from "../soil/ledger.ts";
import { projectSupport } from "../terrain/terrain.js";
import { generateLandscape, generatePlants } from "../landscape/generate.ts";
import { timberLevel, surfaceHeight } from "../landscape/queries.ts";
export function initializeWorld(world, seed, parameters, options = {}) {
  world.seed = String(seed);
  world.rng = hashSeed(seed);
  world.params = { humidity: 58, light: 72, randomness: 28, ...parameters };
  Object.assign(world, {
    colonyId: 1,
    colonies: [],
    nextColonyId: 2,
    capacityOffset: 0,
    tick: 0,
    nextId: 1,
    food: 18,
    queenHealth: 100,
    ants: [],
    brood: [],
    predators: [],
    plants: [],
    patches: [],
    events: [],
    history: [],
    deaths: 0,
    born: 0,
    lastLaying: -50,
    lastRecord: -25,
    lastWarning: -1000,
    lastDiscovery: -1000,
  });
  world.landscape = generateLandscape(world.seed);
  world.landscape.wetness = world.params.humidity / 100;
  world.nest = createNest(world.seed, world.landscape);
  world.nestOdors = createNestOdors(world.nest);
  world.soil = createSoilState();
  world.colony = createColonyState();
  world.socialChemistry = createSocialChemistry();
  world.genetics = createGenetics(world.seed);
  world.physicsVersion = 5;
  world.localRoutingVersion = 1;
  world.pheromones = new Array(40 * 26).fill(0);
  const royal = world.nest.nodes[2],
    entry = world.nest.nodes[0];
  const support = projectSupport(world.nest, {
    x: royal.x + (Math.abs(royal.x) > 9 ? -Math.sign(royal.x) * 0.34 : -0.33),
    y: royal.y - royal.r * 0.85,
    z: royal.z + (Math.abs(royal.z) > 6 ? -Math.sign(royal.z) * 0.34 : -0.33),
  });
  world.ants.push(
    Object.assign(world.makeAnt("queen", royal.x, royal.z), support.point, {
      normal: support.normal,
      node: 2,
      tunnelY: royal.y,
    }),
  );
  world.ants.push(world.makeAnt("male", entry.x + 0.7, entry.z));
  if (options.founding !== false) {
    initializeFounding(world);
    world.nestOdors = createNestOdors(world.nest);
  }
  world.plants = generatePlants(
    world.seed,
    world.landscape,
    world.nest,
    () => world.nextId++,
  );
  for (let i = 0; i < 14; i++) {
    const p = world.plants[(i * 3 + 1) % world.plants.length];
    world.patches.push({
      id: world.nextId++,
      x: p.x,
      z: p.z,
      amount: world.range(1, 3.5),
      capacity: 4,
      discovered: false,
      sourcePlant: p.id,
    });
  }
  for (let i = 0; i < 2; i++)
    for (let attempt = 0; attempt < 80; attempt++) {
      const x = world.range(-8, 8),
        z = world.range(-5, 5);
      if (
        world.inPond(x, z) ||
        timberLevel(world.landscape, x, z) < 1 ||
        world.nest.nodes.some(
          (n) => n.type === "entrance" && Math.hypot(n.x - x, n.z - z) < 2,
        )
      )
        continue;
      world.addPredator(x, z, false);
      break;
    }
  if (!world.founding)
    world.log("Uma rainha e um macho. O começo de uma colônia.", "birth");
  world.record();
}
