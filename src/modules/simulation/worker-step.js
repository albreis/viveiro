import { updateSoilWorker } from "../soil/worker.ts";
import { NEST, LIMIT, BOUNDS } from "./constants.js";
import { nestPath } from "./nest.ts";
import { tunnelEnvelope } from "../terrain/terrain.js";
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export function updateWorkers(world, suitability) {
  const dead = new Set();
  for (const ant of world.ants) {
    ant.previousX = ant.x;
    ant.previousY = ant.y || 0;
    ant.previousZ = ant.z;
    ant.previousDistance = ant.distanceWalked || 0;
    ant.age += 0.01;
    if (ant.kind === "queen") {
      if (world.queenHealth <= 0) {
        dead.add(ant.id);
        world.log("A rainha morreu por falta de alimento.", "danger");
      }
      continue;
    }
    if (ant.kind === "male") {
      ant.state = "Acasalamento";
      if (world.tick > 65) {
        dead.add(ant.id);
        world.log("Após o acasalamento, o ciclo do macho terminou.", "info");
      }
      continue;
    }
    ant.energy -= 0.025 + (1 - suitability) * 0.015;
    if (ant.energy <= 0 || ant.age > world.lifeLimit(ant)) {
      dead.add(ant.id);
      world.deaths++;
      continue;
    }
    if (updateSoilWorker(world, ant)) continue;
    if (ant.route?.length) {
      world.moveInNest(ant);
      continue;
    }
    ant.pitch = 0;
    ant.normal = { x: 0, y: 1, z: 0 };
    if (ant.rest > 0) {
      ant.rest--;
      continue;
    }
    const danger = world.predators.find((p) => distance(ant, p) < 1.5);
    let heading = ant.angle;
    if (danger) {
      heading = Math.atan2(ant.z - danger.z, ant.x - danger.x);
      ant.state = "Fugindo";
    } else if (ant.carrying || ant.energy < 35) {
      let entrances = world.nest.nodes
        .map((p, i) => ({ ...p, index: i }))
        .filter((p) => p.type === "entrance");
      if (ant.avoidEntranceUntil > world.tick) {
        const alternatives = entrances.filter(
          (p) => p.index !== ant.avoidEntrance,
        );
        if (alternatives.length) entrances = alternatives;
      }
      const entrance = entrances.reduce((best, p) =>
        distance(ant, p) < distance(ant, best) ? p : best,
      );
      heading = Math.atan2(entrance.z - ant.z, entrance.x - ant.x);
      ant.state = ant.carrying ? "Levando alimento" : "Voltando ao ninho";
      if (distance(ant, entrance) < 0.6) {
        ant.tunnelCenter = { x: entrance.x, y: entrance.y, z: entrance.z };
        ant.tunnelY = entrance.y;
        ant.node = entrance.index;
        ant.route = nestPath(world.nest, entrance.index, 4);
        continue;
      }
    } else {
      let nearest = null,
        best = 2.3;
      for (const patch of world.patches) {
        const d = distance(ant, patch);
        if (patch.amount > 0.12 && d < best) {
          best = d;
          nearest = patch;
        }
      }
      if (nearest) {
        heading = Math.atan2(nearest.z - ant.z, nearest.x - ant.x);
        ant.state = "Coletando";
        if (best < 0.38) {
          ant.carrying = Math.min(0.65, nearest.amount);
          nearest.amount -= ant.carrying;
          ant.angle += Math.PI;
          if (!nearest.discovered && world.tick - world.lastDiscovery > 30) {
            nearest.discovered = true;
            world.lastDiscovery = world.tick;
            world.log(
              "Uma exploradora encontrou uma fonte de alimento.",
              "food",
            );
          }
        }
      } else {
        ant.state = "Explorando";
        const spread = 0.7;
        const choices = [heading - spread, heading, heading + spread];
        let max = -1;
        for (const angle of choices) {
          const score =
            world.pheromones[
              world.pheromoneIndex(
                ant.x + Math.cos(angle) * 0.7,
                ant.z + Math.sin(angle) * 0.7,
              )
            ];
          if (score > max) {
            max = score;
            heading = angle;
          }
        }
        // Local exploration is stochastic and reproducible from this world's seed.
        heading +=
          world.range(-0.35, 0.35) * (world.params.randomness / 50 + 0.2);
        if (max < 0.04) heading = ant.angle + world.range(-0.5, 0.5);
      }
    }
    world.moveSurface(ant, heading, ant.speed);
    if (ant.carrying) {
      const idx = world.pheromoneIndex(ant.x, ant.z);
      world.pheromones[idx] = Math.min(5, world.pheromones[idx] + 0.25);
    }
  }

  return dead;
}
