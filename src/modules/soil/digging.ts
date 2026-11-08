import { readyForDigBite } from "../fatigue/terrarium.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import {
  advanceSupportedMotion,
  settleSupport,
  startSupportedMotion,
} from "../navigation/support-motion.ts";
import { approachDigFace } from "./approach.ts";
import { geometricDigAccess } from "./access-rule.ts";
import { availableDigSite, touchingDigFace } from "./front-access.ts";
import { distance3 } from "./ledger.ts";
import { advanceDigFront, digBite } from "./projects.ts";
import { beginSoilHaul } from "./routing.ts";
import type { DigProject, SoilAgent, SoilWorld } from "./types.ts";

function yieldFace(world: SoilWorld, ant: SoilAgent, project: DigProject) {
  delete ant.supportMotion;
  if (ant.navigation) ant.navigation.retreating = false;
  if ((ant.carryingSoil ?? 0) > 0) beginSoilHaul(world, ant);
  else {
    delete ant.soilTask;
    requestRoute(world, ant, project.from);
  }
  ant.state = "Reavaliando o caminho";
}

/** A bite belongs to the ant that reached the soil, not a project-wide lock. */
export function workAtDigFace(
  world: SoilWorld,
  ant: SoilAgent,
  project: DigProject,
): boolean {
  const task = ant.soilTask!,
    geometric = geometricDigAccess(world);
  task.phase = "dig";
  const front = world.nest.nodes[project.front];
  if (geometric) {
    if (task.lastWorkedTick === world.tick) return true;
    if (distance3(front, project.goal) < 0.001) {
      advanceDigFront(world, project);
      task.lastWorkedTick = world.tick;
      return true;
    }
    if (ant.navigation?.retreating) {
      yieldFace(world, ant, project);
      return true;
    }
    if (ant.supportMotion) {
      advanceSupportedMotion(world, ant, ant.speed * 0.85);
      return true;
    }
    if (!touchingDigFace(world, ant, project)) {
      const site = availableDigSite(world, ant, project);
      if (!site) yieldFace(world, ant, project);
      else {
        startSupportedMotion(world, ant, site.position, site.normal, {
          ...front,
        });
        advanceSupportedMotion(world, ant, ant.speed * 0.85);
      }
      return true;
    }
  } else if (
    distance3({ x: ant.x, y: ant.y || 0, z: ant.z }, front) >
    Math.max(0.46, world.nest.nodes[project.from].r + 0.18)
  ) {
    approachDigFace(world, ant, project);
    return true;
  }
  ant.state = "Escavando a frente do túnel";
  if (
    ++task.digTicks % 4 === 0 &&
    (geometric || project.lastWorkedTick !== world.tick) &&
    readyForDigBite(world, ant)
  ) {
    if (geometric) task.lastWorkedTick = world.tick;
    else project.lastWorkedTick = world.tick;
    digBite(world, ant, project);
    settleSupport(world, ant, ant.speed * 0.85);
  }
  if ((ant.carryingSoil || 0) >= 0.022) beginSoilHaul(world, ant);
  return true;
}
