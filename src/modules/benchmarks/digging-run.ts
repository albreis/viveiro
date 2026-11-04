import { modelMath } from "../../libs/model-math.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { projectSupport } from "../terrain/terrain.js";
import {
  finishLessonWorld,
  lessonWorld,
  type LessonWorld,
} from "../lessons/world.ts";
import { TICKS_PER_DAY } from "../simulation/constants.js";
import { enableStigmergy, type StigmergyParams } from "../soil/stigmergy.ts";
import { enableIdleYield } from "../navigation/idle-yield.ts";

export type DiggingMode = "projetos" | "estigmergia";
export interface DiggingSetup {
  mode?: DiggingMode;
  /** Workers only, no queen: no new adults, as in Buhl's fixed groups. */
  workersOnly?: boolean;
  /** Start every worker resting in a nest room instead of on the surface. */
  insideNest?: boolean;
  stigmergy?: Partial<StigmergyParams>;
  /** Idle workers give way to workers on a task (optional traffic rule). */
  idleYield?: boolean;
  /**
   * Hold day-scaled biology still (age, disease hazard, food and each
   * worker's energy) so a run of
   * hundreds of thousands of ticks tests behaviour, not ageing. Used when a
   * tick is read as a short real interval rather than 1/100 of a day.
   */
  freezeDaily?: boolean;
  /** Remove predators, as in a laboratory arena (Buhl et al. had none). */
  noPredators?: boolean;
}

export interface DiggingRunOptions {
  seed: string;
  workers: number;
  days: number;
  /** Exact number of ticks to run; overrides `days` when given. */
  ticks?: number;
  sampleEvery?: number;
  setup?: DiggingSetup;
  /** Called with the current tick every `progressEvery` ticks. */
  onProgress?: (tick: number, total: number) => void;
  progressEvery?: number;
}
export interface DiggingSample {
  tick: number;
  /** Cumulative soil removed since the start, in model volume units. */
  removed: number;
  /**
   * Part of `removed` that came from widening crowded links
   * (navigation/contact.ts) rather than from digging fronts. Measured only;
   * the rules are unchanged.
   */
  traffic: number;
  workers: number;
  activeProjects: number;
  nestNodes: number;
}
export interface DiggingRun {
  seed: string;
  workers: number;
  days: number;
  samples: DiggingSample[];
}

/**
 * Prepared group of adult workers around the nest entrance, with the queen
 * kept and abundant food. This is a test condition, not a colony history.
 */
export function prepareDiggingWorld(
  seed: string,
  workers: number,
  setup: DiggingSetup = {},
) {
  if (!Number.isInteger(workers) || workers < 1 || workers > 400)
    throw Error("Grupo deve ter de 1 a 400 operárias.");
  const w = lessonWorld(seed, false, false);
  w.ants = setup.workersOnly ? [] : w.ants.filter((a) => a.kind === "queen");
  if (setup.workersOnly) w.brood = [];
  const entry = w.nest.nodes.find((n) => n.type === "entrance")!;
  const rooms = w.nest.nodes
    .map((n, index) => ({ n, index }))
    .filter(({ n }) =>
      ["royal", "nursery", "storage", "chamber"].includes(n.type),
    );
  for (let i = 0; i < workers; i++) {
    const ant = w.makeAnt("worker", entry.x, entry.z);
    if (setup.insideNest && rooms.length) {
      placeInRoom(w, ant, rooms[i % rooms.length], i);
      w.ants.push(ant);
      continue;
    }
    if (!placeWorker(w, ant, entry, i))
      throw Error("Não há espaço para posicionar " + workers + " operárias.");
    w.ants.push(ant);
  }
  w.food = 1000;
  w.born = workers;
  finishLessonWorld(w, true);
  if (setup.mode === "estigmergia") enableStigmergy(w, setup.stigmergy);
  if (setup.idleYield) enableIdleYield(w);
  if (setup.noPredators) w.predators.length = 0;
  return w;
}

function placeInRoom(
  w: LessonWorld,
  ant: LessonWorld["ants"][number],
  room: { n: { x: number; y: number; z: number; r: number }; index: number },
  i: number,
) {
  const angle = i * 2.39996,
    reach = room.n.r * 0.5;
  const support = projectSupport(w.nest, {
    x: room.n.x + modelMath.cos(angle) * reach,
    y: room.n.y - room.n.r * 0.85,
    z: room.n.z + modelMath.sin(angle) * reach,
  });
  Object.assign(ant, support.point, {
    normal: support.normal,
    node: room.index,
    tunnelY: room.n.y,
    angle,
    age: 20,
  });
}

function placeWorker(
  w: LessonWorld,
  ant: LessonWorld["ants"][number],
  entry: { x: number; z: number },
  i: number,
) {
  for (let attempt = 0; attempt < 400; attempt++) {
    const angle = i * 1.8 + attempt * 2.4,
      radius = 0.8 + attempt * 0.03;
    const x = Math.max(
      -9.4,
      Math.min(9.4, entry.x + modelMath.cos(angle) * radius),
    );
    const z = Math.max(
      -5.9,
      Math.min(5.9, entry.z + modelMath.sin(angle) * radius),
    );
    const point = { x, y: surfaceHeight(w.nest.relief, x, z) + 0.008, z };
    if (
      !w.inPond(x, z) &&
      w.positionClear(ant, point, angle, 0, { x: 0, y: 1, z: 0 })
    ) {
      Object.assign(ant, point, { angle, age: 20 });
      return true;
    }
  }
  return false;
}

function sample(w: LessonWorld, start: number, traffic: number): DiggingSample {
  return {
    tick: w.tick,
    removed: w.soil.removed - start,
    traffic,
    workers: w.ants.filter((a) => a.kind === "worker").length,
    activeProjects: w.soil.projects.filter((p) => !p.completed).length,
    nestNodes: w.nest.nodes.length,
  };
}

/** Keeps day-scaled biology where it started; behaviour still runs per tick. */
export function holdDaily(
  w: LessonWorld,
  held: Map<number, { age: number; energy: number }>,
) {
  w.food = 1000;
  for (const a of w.ants) {
    const start = held.get(a.id);
    if (start) {
      a.age = start.age;
      // Buhl's workers did not starve in 72 h; a full store alone does not
      // reach every worker in time when 200 share the nest.
      if (a.energy < start.energy) a.energy = start.energy;
    }
    const life = (a as { life?: { diseaseHazard: number; infection?: number } })
      .life;
    if (life) {
      life.diseaseHazard = 0;
      life.infection = 0;
    }
  }
}

/** Runs the production step function; only the starting group is prepared. */
export function runDigging(options: DiggingRunOptions): DiggingRun {
  const every = options.sampleEvery ?? 5;
  if (
    options.ticks === undefined &&
    (!Number.isInteger(options.days) || options.days < 1 || options.days > 365)
  )
    throw Error("Dias devem ser inteiros de 1 a 365.");
  if (
    options.ticks !== undefined &&
    (!Number.isInteger(options.ticks) ||
      options.ticks < 1 ||
      options.ticks > 3_000_000)
  )
    throw Error("Ticks devem ser inteiros de 1 a 3.000.000.");
  if (!Number.isInteger(every) || every < 1)
    throw Error("Intervalo de amostragem deve ser inteiro positivo.");
  const w = prepareDiggingWorld(
    options.seed,
    options.workers,
    options.setup,
  ) as LessonWorld & {
    step(): void;
    recordSoilRemoval(ant: unknown, mass: number): void;
  };
  // Congestion widening is the only caller of recordSoilRemoval; a counting
  // wrapper on this instance attributes its share without changing behaviour.
  let traffic = 0;
  const record = w.recordSoilRemoval.bind(w);
  w.recordSoilRemoval = (ant, mass) => {
    const before = w.soil.removed;
    record(ant, mass);
    traffic += w.soil.removed - before;
  };
  const start = w.soil.removed,
    total = options.ticks ?? options.days * TICKS_PER_DAY,
    samples = [sample(w, start, traffic)],
    progressEvery = options.progressEvery ?? 10_000;
  const frozen = options.setup?.freezeDaily
    ? new Map(w.ants.map((a) => [a.id, { age: a.age, energy: a.energy }]))
    : null;
  while (w.tick < total) {
    w.step();
    if (frozen) holdDaily(w, frozen);
    if (options.setup?.noPredators) w.predators.length = 0;
    if (w.tick % every === 0 || w.tick === total)
      samples.push(sample(w, start, traffic));
    if (options.onProgress && w.tick % progressEvery === 0)
      options.onProgress(w.tick, total);
  }
  return {
    seed: options.seed,
    workers: options.workers,
    days: options.days,
    samples,
  };
}
