import { modelMath } from "../../libs/model-math.ts";
import type { DigProject, SoilAgent, SoilWorld } from "./types.ts";

/**
 * Optional digging mode in which a pheromone left at each tunnel front
 * recruits diggers, after Buhl et al. (2005). Absent from worlds that did not
 * opt in, so the default project rules, saves and published outputs stay as
 * they were. Parameters below were tuned against the published patterns, not
 * measured: Buhl's per-second rates have no direct tick equivalent.
 */
export interface StigmergyParams {
  /** Hill constant K of P = X² / (X² + K²), in deposit units. */
  k: number;
  /** Pheromone added per bite. */
  deposit: number;
  /** Fraction lost per tick (evaporation and diffusion together). */
  evaporation: number;
  /** Chance per tick that an idle worker in a room opens a front unprompted. */
  spontaneous: number;
  /** Chance that an idle worker joins a front with no pheromone. */
  baseJoin: number;
  maxFronts: number;
  maxNodes: number;
  perFront: number;
  /** Multiplies the length dug per bite, so galleries grow at colony scale. */
  biteScale: number;
  /**
   * Workers per unit of excavated volume at which the urge to dig halves.
   * Buhl et al. propose falling density as the brake; this is that brake,
   * sensed as crowding, not a stopping rule.
   */
  crowding: number;
}
export interface StigmergyState {
  version: 1;
  params: StigmergyParams;
  /** Soil removed before the mode was enabled; only later digging counts. */
  removedAtStart: number;
  /** Pheromone per project id, stored with the tick of its last update. */
  marks: Record<number, { value: number; tick: number }>;
}

export const DEFAULT_STIGMERGY: Readonly<StigmergyParams> = Object.freeze({
  k: 1,
  deposit: 0.35,
  evaporation: 0.04,
  spontaneous: 0.006,
  baseJoin: 0.01,
  maxFronts: 12,
  maxNodes: 140,
  perFront: 6,
  biteScale: 4,
  crowding: 100,
});

export function enableStigmergy(
  world: SoilWorld,
  params: Partial<StigmergyParams> = {},
) {
  world.soil.stigmergy = {
    version: 1,
    params: { ...DEFAULT_STIGMERGY, ...params },
    removedAtStart: world.soil.removed,
    marks: {},
  };
}

export const stigmergyOf = (world: SoilWorld) => world.soil.stigmergy;

/** Lazy exponential decay: no per-tick sweep over all fronts is needed. */
export function markAt(world: SoilWorld, project: DigProject) {
  const s = world.soil.stigmergy;
  const mark = s?.marks[project.id];
  if (!s || !mark) return 0;
  const age = world.tick - mark.tick;
  return age <= 0
    ? mark.value
    : mark.value * modelMath.exp(-s.params.evaporation * age);
}

export function depositMark(world: SoilWorld, project: DigProject) {
  const s = world.soil.stigmergy;
  if (!s) return;
  s.marks[project.id] = {
    value: markAt(world, project) + s.params.deposit,
    tick: world.tick,
  };
}

/** Hill response to workers per excavated volume: 1 while crowded, falls as galleries open up. */
export function crowdingFactor(world: SoilWorld) {
  const s = world.soil.stigmergy;
  if (!s) return 1;
  const dug = world.soil.removed - s.removedAtStart;
  if (!(dug > 0)) return 1;
  let workers = 0;
  for (const a of world.ants) if (a.kind === "worker") workers++;
  const density = workers / dug,
    c = s.params.crowding;
  return (density * density) / (density * density + c * c);
}

/** Buhl's recruitment response plus a small chance with no pheromone. */
export function joinProbability(world: SoilWorld, project: DigProject) {
  const s = world.soil.stigmergy!;
  const x = markAt(world, project),
    k = s.params.k;
  const hill = (x * x) / (x * x + k * k);
  return (
    (s.params.baseJoin + (1 - s.params.baseJoin) * hill) * crowdingFactor(world)
  );
}

/**
 * Carriers lay a trail between the front and the exit, so a worker anywhere in
 * the galleries can follow it. Abstracted here as: from any nest node, the
 * open front with the strongest mark and a free place in its crew.
 */
export function recruitingProject(world: SoilWorld, ant: SoilAgent) {
  if (ant.node == null) return null;
  const crews = new Map<number, number>();
  for (const a of world.ants)
    if (a.soilTask?.projectId)
      crews.set(
        a.soilTask.projectId,
        (crews.get(a.soilTask.projectId) || 0) + 1,
      );
  let best: DigProject | null = null,
    strongest = -1;
  for (const p of world.soil.projects) {
    if (p.completed || (crews.get(p.id) || 0) >= crewLimit(world)) continue;
    const mark = markAt(world, p);
    if (mark > strongest) {
      best = p;
      strongest = mark;
    }
  }
  return best;
}

/** Switches a recruit to the open front it actually reached, if any. */
export function adoptFrontHere(world: SoilWorld, ant: SoilAgent) {
  const here = world.soil.projects.find(
    (p) => !p.completed && p.front === ant.node,
  );
  if (!here || !ant.soilTask) return false;
  ant.soilTask.projectId = here.id;
  return true;
}

export function forgetMark(world: SoilWorld, project: DigProject) {
  if (world.soil.stigmergy) delete world.soil.stigmergy.marks[project.id];
}

export const nodeLimit = (world: SoilWorld, fallback: number) =>
  world.soil.stigmergy?.params.maxNodes ?? fallback;
export const frontLimit = (world: SoilWorld) =>
  world.soil.stigmergy?.params.maxFronts ?? 2;
export const crewLimit = (world: SoilWorld) =>
  world.soil.stigmergy?.params.perFront ?? 2;
