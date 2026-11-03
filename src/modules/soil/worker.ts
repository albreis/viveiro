import { modelMath } from "../../libs/model-math.ts";
import { approachDigFace } from "./approach.ts";
import { requestRoute } from "../navigation/local-routing.ts";
import type { SoilAgent, SoilWorld } from "./types.ts";
import { proposeDig } from "./projects.ts";
import { digBite } from "./projects.ts";
import { beginSoilHaul, enterForSoil } from "./routing.ts";
import { depositSoil, distance3 } from "./ledger.ts";
import {
  adoptFrontHere,
  crowdingFactor,
  joinProbability,
  recruitingProject,
} from "./stigmergy.ts";
import {
  advanceSupportedMotion,
  settleSupport,
} from "../navigation/support-motion.ts";

const CAPACITY = 0.022;
export function updateSoilWorker(world: SoilWorld, ant: SoilAgent): boolean {
  if (
    !ant.soilTask &&
    (ant.carryingBrood ||
      ant.carryingWaste ||
      ("bioTask" in ant && ant.bioTask))
  )
    return false;
  const stigmergy = world.soil.stigmergy;
  if (
    !ant.soilTask &&
    ant.node != null &&
    (stigmergy
      ? !ant.carrying &&
        world.random() < stigmergy.params.spontaneous * crowdingFactor(world)
      : "role" in ant &&
        ant.role === "excavator" &&
        world.tick - world.soil.lastProject >= 450) &&
    ["royal", "nursery", "storage", "chamber", "junction"]
      .slice(0, stigmergy ? 5 : 4)
      .includes(world.nest.nodes[ant.node].type) &&
    (!ant.tunnelCenter ||
      distance3(ant.tunnelCenter, world.nest.nodes[ant.node]) < 0.03)
  )
    proposeDig(world, ant.node);
  if (!ant.soilTask) {
    const rubble = (world.nest.rubble || []).find(
      (p) =>
        p.mass > 0.0001 &&
        distance3({ x: ant.x, y: ant.y || 0, z: ant.z }, p) < 0.8 &&
        world.ants.filter((a) => a.soilTask?.rubbleId === p.id).length < 2,
    );
    if (rubble && ant.node != null && !ant.carrying)
      ant.soilTask = {
        phase: "repair",
        rubbleId: rubble.id,
        digTicks: 0,
        sourceNode: ant.node,
      };
    else if ((ant.carryingSoil || 0) > 0 && ant.node != null) {
      ant.soilTask = { phase: "haul", digTicks: 0 };
      beginSoilHaul(world, ant);
    } else {
      const project = stigmergy
        ? recruitingProject(world, ant)
        : world.soil.projects.find(
            (p) =>
              !p.completed &&
              ant.node === p.from &&
              world.ants.filter((a) => a.soilTask?.projectId === p.id).length <
                2,
          );
      if (
        !project ||
        (stigmergy
          ? world.random() >= joinProbability(world, project)
          : "role" in ant
            ? ant.role !== "excavator"
            : ant.id % 4 !== 0) ||
        ant.carrying ||
        ant.energy < 50
      )
        return false;
      ant.soilTask = { projectId: project.id, phase: "return", digTicks: 0 };
      requestRoute(world, ant, project.front);
    }
  }
  const task = ant.soilTask;
  if (
    (task.phase === "dig" || task.phase === "repair") &&
    settleSupport(world, ant, ant.speed * 0.85)
  )
    return true;
  if (
    (ant.y || 0) >= -0.04 &&
    ant.node != null &&
    modelMath.hypot(
      ant.x - world.nest.nodes[ant.node].x,
      ant.z - world.nest.nodes[ant.node].z,
    ) > 1.2
  ) {
    ant.node = null;
    ant.route = [];
    ant.tunnelCenter = null;
    delete ant.supportMotion;
    if (ant.navigation) ant.navigation.retreating = false;
  }
  if (ant.node == null && task.phase !== "dump") {
    ant.route = [];
    task.phase = (ant.carryingSoil || 0) > 0 ? "dump" : "return";
  }
  if (task.phase === "return" && task.rubbleId && ant.node != null) {
    const rubble = world.nest.rubble?.find((p) => p.id === task.rubbleId);
    if (
      rubble &&
      distance3({ x: ant.x, y: ant.y || 0, z: ant.z }, rubble) < 0.8
    )
      task.phase = "repair";
  }
  if (task.phase === "haul" && task.reversing) {
    if (ant.navigation?.retreating) {
      world.moveInNest(ant);
      return true;
    }
    task.reversing = false;
    beginSoilHaul(world, ant);
  }
  if (task.phase === "repair") {
    const rubble = world.nest.rubble?.find((p) => p.id === task.rubbleId);
    if (!rubble || rubble.mass < 0.0001) {
      if ((ant.carryingSoil || 0) > 0) beginSoilHaul(world, ant);
      else delete ant.soilTask;
      return true;
    }
    if (distance3({ x: ant.x, y: ant.y || 0, z: ant.z }, rubble) > 0.8) {
      const edge =
        rubble.edge === undefined ? null : world.nest.links[rubble.edge];
      if (edge && !ant.route?.length)
        ant.route = [edge[0] === ant.node ? edge[1] : edge[0]];
      if (ant.route?.length) world.moveInNest(ant);
      return true;
    }
    ant.state = "Removendo terra de um bloqueio";
    if (++task.digTicks % 5) return true;
    const mass = Math.min(
      0.007,
      rubble.mass,
      CAPACITY - (ant.carryingSoil || 0),
    );
    rubble.mass -= mass;
    ant.carryingSoil = (ant.carryingSoil || 0) + mass;
    world.nest.revision++;
    if (ant.carryingSoil >= CAPACITY - 0.0001 || rubble.mass < 0.0001) {
      // Walk back to the start of this segment before selecting a new route.
      if (ant.route?.length && ant.navigation) {
        ant.navigation.retreating = true;
        task.reversing = true;
        delete ant.supportMotion;
      }
      beginSoilHaul(world, ant);
    }
    return true;
  }
  if (task.phase === "dump") {
    ant.state = "Levando terra para fora";
    if (settleSupport(world, ant, ant.speed * 0.85)) return true;
    if (ant.supportMotion) {
      advanceSupportedMotion(world, ant, ant.speed * 0.85);
      return true;
    }
    depositSoil(world, ant);
    ant.tunnelCenter = null;
    ant.tunnelY = 0;
    task.phase = "return";
    task.digTicks = 0;
    const worked = stigmergy
      ? world.soil.projects.find((p) => p.id === task.projectId)
      : undefined;
    if (
      (!task.projectId && !task.rubbleId) ||
      (worked && world.random() >= joinProbability(world, worked))
    )
      delete ant.soilTask;
    return true;
  }
  const project = world.soil.projects.find((p) => p.id === task.projectId);
  if (task.phase === "return" && ant.node == null) {
    const rubble = world.nest.rubble?.find(
      (p) => p.id === task.rubbleId && p.mass > 0.0001,
    );
    if ((!project || project.completed) && !rubble) {
      delete ant.soilTask;
      return false;
    }
    enterForSoil(world, ant, project?.front ?? task.sourceNode!);
    return true;
  }
  if (ant.route?.length) {
    world.moveInNest(ant);
    if (task.phase === "haul") ant.state = "Levando terra para fora";
    return true;
  }
  if (task.phase === "haul") {
    beginSoilHaul(world, ant);
    return true;
  }
  if (!project || project.completed) {
    if ((ant.carryingSoil || 0) > 0) beginSoilHaul(world, ant);
    else {
      delete ant.soilTask;
      requestRoute(world, ant, 0);
    }
    return true;
  }
  if (ant.node !== project.front) {
    // The front odor leads to the nearest open front, not to a chosen one.
    const reached = stigmergy && adoptFrontHere(world, ant);
    if (!reached) {
      task.phase = "return";
      requestRoute(world, ant, project.front);
      return true;
    }
    return true;
  }
  task.phase = "dig";
  const front = world.nest.nodes[project.front];
  if (
    distance3({ x: ant.x, y: ant.y || 0, z: ant.z }, front) >
    Math.max(0.46, world.nest.nodes[project.from].r + 0.18)
  ) {
    approachDigFace(world, ant, project);
    return true;
  }
  ant.state = "Escavando a frente do túnel";
  if (++task.digTicks % 4 === 0 && project.lastWorkedTick !== world.tick) {
    project.lastWorkedTick = world.tick;
    digBite(world, ant, project);
    settleSupport(world, ant, ant.speed * 0.85);
  }
  if ((ant.carryingSoil || 0) >= CAPACITY) beginSoilHaul(world, ant);
  return true;
}
