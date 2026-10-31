import type { ColonyAgent, ColonyWorld, Role } from "./types.ts";
import { ensureIndividual } from "./individual.ts";
import { distance3 } from "../soil/ledger.ts";
import { nestPath } from "../simulation/nest.ts";
import { updateColonyTask } from "./tasks.ts";

function roleFor(world: ColonyWorld, ant: ColonyAgent): Role {
  if (ant.caste === "major" && ant.age > 1) return "defender";
  if (
    ant.age < 1.5 &&
    ant.traits.exploration < 0.5 &&
    world.ants.filter((a) => a.kind === "worker").length > 4
  )
    return "nurse";
  if (ant.age < 4 && ant.traits.activity > 0.6) return "cleaner";
  return "forager";
}
export function updateColonyWorker(
  world: ColonyWorld,
  ant: ColonyAgent,
): boolean {
  ensureIndividual(world.seed, ant);
  if (updateColonyTask(world, ant)) return true;
  if (ant.carrying || ant.soilTask || (ant.carryingSoil || 0) > 0) return false;
  ant.role = roleFor(world, ant);
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
    ant.bioTask = { kind: "waste", item: waste.id, destination: 5 };
    if (ant.node != null) ant.route = nestPath(world.nest, ant.node, 5);
    ant.state = "Recolhendo resíduos";
    return true;
  }
  if (ant.role === "nurse" && ant.node != null) {
    const brood = world.brood.find(
      (b) => b.node !== 3 && !b.carrier && distance3(here, b) < 0.85,
    );
    if (brood) {
      brood.carrier = ant.id;
      ant.carryingBrood = brood.id;
      ant.bioTask = { kind: "brood", item: brood.id, destination: 3 };
      ant.route = nestPath(world.nest, ant.node, 3);
      ant.state = "Transportando uma cria";
      return true;
    }
    if (!ant.route?.length) {
      const destination = ant.crop < 0.15 ? 4 : 2;
      ant.bioTask = { kind: "care", destination };
      ant.route = nestPath(world.nest, ant.node, destination);
      return true;
    }
  }
  if (ant.role === "defender" && ant.energy > 35) {
    if (ant.node != null) {
      if (!ant.route?.length) {
        ant.bioTask = { kind: "guard", destination: ant.id % 2 ? 0 : 6 };
        ant.route = nestPath(world.nest, ant.node, ant.bioTask.destination);
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
    const entrance = world.nest.nodes[ant.id % 2 ? 0 : 6],
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
