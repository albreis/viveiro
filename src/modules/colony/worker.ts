import { roomNode } from "./rooms.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import { allocateTask } from "./response.ts";
import type { ColonyAgent, ColonyWorld, Role } from "./types.ts";
import { ensureIndividual } from "./individual.ts";
import { distance3 } from "../soil/ledger.ts";
import { updateColonyTask } from "./tasks.ts";

export function updateColonyWorker(
  world: ColonyWorld,
  ant: ColonyAgent,
): boolean {
  ensureIndividual(world.seed, ant);
  if (updateColonyTask(world, ant)) return true;
  if (ant.carrying || ant.soilTask || (ant.carryingSoil || 0) > 0) return false;
  ant.role = allocateTask(world, ant);
  if (
    world.tick % 50 === ant.id % 50 &&
    world.random() > 0.3 + ant.traits.activity * 0.7 &&
    ant.energy > 50 &&
    !ant.route?.length
  )
    ant.rest = 5 + Math.round((1 - ant.traits.activity) * 15);
  if (ant.rest > 0) {
    ant.rest--;
    ant.state = "Descansando";
    return true;
  }
  const here = { x: ant.x, y: ant.y || 0, z: ant.z };
  const waste = world.colony.waste.find(
    (w) => !w.stored && !w.carrier && distance3(here, w) < 0.8,
  );
  if (waste && ["cleaner", "nurse"].includes(ant.role)) {
    waste.carrier = ant.id;
    ant.carryingWaste = waste.id;
    ant.bioTask = {
      kind: "waste",
      item: waste.id,
      destination: roomNode(world.nest, "waste", 0, ant.colonyId || 1),
    };
    if (ant.node != null)
      requestRoute(
        world,
        ant,
        roomNode(world.nest, "waste", 0, ant.colonyId || 1),
      );
    ant.state = "Recolhendo resíduos";
    return true;
  }
  if (ant.role === "nurse" && ant.node != null) {
    const brood = world.brood.find(
      (b) =>
        b.node !== roomNode(world.nest, "nursery", 0, ant.colonyId || 1) &&
        !b.carrier &&
        distance3(here, b) < 0.85,
    );
    if (brood) {
      brood.carrier = ant.id;
      ant.carryingBrood = brood.id;
      ant.bioTask = {
        kind: "brood",
        item: brood.id,
        destination: roomNode(world.nest, "nursery", 0, ant.colonyId || 1),
      };
      requestRoute(
        world,
        ant,
        roomNode(world.nest, "nursery", 0, ant.colonyId || 1),
      );
      ant.state = "Transportando uma cria";
      return true;
    }
    if (!ant.route?.length) {
      const destination = roomNode(
        world.nest,
        ant.crop < 0.15 ? "storage" : "royal",
      );
      ant.bioTask = { kind: "care", destination };
      requestRoute(world, ant, destination);
      return true;
    }
  }
  if (ant.role === "defender" && ant.energy > 35) {
    if (ant.node != null) {
      if (!ant.route?.length) {
        ant.bioTask = {
          kind: "guard",
          destination: roomNode(
            world.nest,
            "entrance",
            ant.id % 2,
            ant.colonyId || 1,
          ),
        };
        requestRoute(world, ant, ant.bioTask.destination);
      }
      return false;
    }
    const danger = world.predators.find(
      (p) => Math.hypot(p.x - ant.x, p.z - ant.z) < 1.2,
    );
    if (danger && ant.traits.courage > 0.3) {
      danger.energy = Math.max(0, danger.energy - 0.7);
      ant.energy -= 0.04;
      world.moveSurface(
        ant,
        Math.atan2(danger.z - ant.z, danger.x - ant.x),
        ant.speed,
      );
      ant.state = "Defendendo a entrada";
      return true;
    }
    const entrance =
        world.nest.nodes[
          roomNode(world.nest, "entrance", ant.id % 2, ant.colonyId || 1)
        ],
      angle = world.tick * 0.012 + ant.id;
    const target = {
      x: entrance.x + Math.cos(angle) * 0.8,
      z: entrance.z + Math.sin(angle) * 0.8,
    };
    world.moveSurface(
      ant,
      Math.atan2(target.z - ant.z, target.x - ant.x),
      ant.speed * 0.7,
    );
    ant.state = "Vigiando a entrada";
    return true;
  }
  return false;
}
