import { airEnergyCost } from "../ventilation/sensing.ts";
import { visitMimic } from "../ecology/mimic-worker.ts";
import { visitAphids } from "../ecology/aphid-worker.ts";
import { updateIntrusion } from "../social-chemistry/intrusion.ts";
import { updateEncounterMotion } from "../social-chemistry/contact-motion.ts";
import { updateSexualAgent } from "../colonies/sexual-motion.ts";
import { updateFounding } from "../founding/update.ts";
import { roomNode } from "../colony/rooms.ts";
import { recoverStall } from "../navigation/stall-recovery.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import { chooseForagingHeading } from "../chemistry/forage-heading.ts";
import { depositPheromone } from "../chemistry/reaction-diffusion.ts";
import { soilEntrance } from "../soil/routing.ts";
import { updateColonyWorker } from "../colony/worker.ts";
import { updateSoilWorker } from "../soil/worker.ts";
import { NEST, LIMIT, BOUNDS } from "./constants.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export function updateWorkers(world, suitability) {
  const dead = new Set();
  for (const ant of world.ants) {
    ant.previousAngle = ant.angle;
    ant.previousX = ant.x;
    ant.previousY = ant.y || 0;
    ant.previousZ = ant.z;
    ant.previousDistance = ant.distanceWalked || 0;
  }
  updateFounding(world);
  for (const ant of world.ants) {
    ant.age += 0.01;
    if ((ant.health ?? 100) <= 0) {
      dead.add(ant.id);
      world.deaths++;
      ant.deathCause = "combat";
      if (ant.kind === "queen")
        world.log("Uma rainha morreu durante um conflito.", "danger");
      continue;
    }
    if (updateSexualAgent(world, ant, dead)) continue;
    if (ant.kind === "queen") {
      if (world.queenHealth <= 0) {
        dead.add(ant.id);
        world.log("A rainha morreu por falta de alimento.", "danger");
      }
      continue;
    }
    if (ant.kind === "male") {
      if (!world.founding) ant.state = "Acasalamento";
      if (
        world.founding
          ? world.founding.matedTick !== undefined &&
            world.tick > world.founding.matedTick + 25 &&
            !ant.airborne
          : world.tick > 65
      ) {
        dead.add(ant.id);
        world.log("Após o acasalamento, o ciclo do macho terminou.", "info");
      }
      continue;
    }
    ant.energy -=
      (0.025 + (1 - suitability) * 0.015) * (ant.metabolicCost ?? 1) +
      airEnergyCost(world, ant);
    if (ant.energy <= 0 || ant.age > world.lifeLimit(ant)) {
      dead.add(ant.id);
      world.deaths++;
      ant.deathCause = ant.energy <= 0 ? "starvation" : "age";
      continue;
    }
    if (updateEncounterMotion(world, ant)) continue;
    if (updateIntrusion(world, ant)) continue;
    if (recoverStall(world, ant)) continue;
    if (visitMimic(world, ant)) continue;
    if (visitAphids(world, ant)) continue;
    if (ant.soilTask && updateSoilWorker(world, ant)) continue;
    if (updateColonyWorker(world, ant)) continue;
    if (updateSoilWorker(world, ant)) continue;
    if (ant.node != null && !ant.route?.length) {
      const node = world.nest.nodes[ant.node];
      if (
        (ant.y || 0) >= -0.04 &&
        Math.hypot(ant.x - node.x, ant.z - node.z) > 1.2
      ) {
        ant.node = null;
        ant.tunnelCenter = null;
        ant.tunnelY = 0;
      } else {
        const destination =
          (ant.carrying ||
            (ant.energy < 35 && world.tick >= (ant.stockEmptyUntil || 0))) &&
          ant.node !== roomNode(world.nest, "storage", 0, ant.colonyId || 1)
            ? roomNode(world.nest, "storage", 0, ant.colonyId || 1)
            : soilEntrance(world, ant);
        requestRoute(world, ant, destination);
        if (!ant.route.length && node.type === "entrance")
          ant.route = [ant.node];
      }
    }
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
    } else if (
      ant.carrying ||
      (ant.energy < 35 && world.tick >= (ant.stockEmptyUntil || 0))
    ) {
      const entranceIndex = soilEntrance(world, ant);
      if (entranceIndex < 0) {
        heading = chooseForagingHeading(world, ant, heading);
        world.moveSurface(ant, heading, ant.speed);
        ant.state = "Procurando a entrada pelo cheiro";
        continue;
      }
      const entrance = {
        ...world.nest.nodes[entranceIndex],
        index: entranceIndex,
      };
      heading = Math.atan2(entrance.z - ant.z, entrance.x - ant.x);
      ant.state = ant.carrying ? "Levando alimento" : "Voltando ao ninho";
      if (distance(ant, entrance) < 0.6) {
        ant.tunnelCenter = { x: entrance.x, y: entrance.y, z: entrance.z };
        ant.tunnelY = entrance.y;
        ant.node = entrance.index;
        requestRoute(
          world,
          ant,
          roomNode(world.nest, "storage", 0, ant.colonyId || 1),
        );
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
        heading = chooseForagingHeading(world, ant, heading);
      }
    }
    world.moveSurface(ant, heading, ant.speed);
    if (ant.carrying) {
      const idx = world.pheromoneIndex(ant.x, ant.z);
      depositPheromone(world.pheromones, idx, 0.25);
    }
  }

  return dead;
}
