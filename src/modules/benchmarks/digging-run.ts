import { modelMath } from "../../libs/model-math.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import {
  finishLessonWorld,
  lessonWorld,
  type LessonWorld,
} from "../lessons/world.ts";
import { TICKS_PER_DAY } from "../simulation/constants.js";

export interface DiggingRunOptions {
  seed: string;
  workers: number;
  days: number;
  sampleEvery?: number;
}
export interface DiggingSample {
  tick: number;
  /** Cumulative soil removed since the start, in model volume units. */
  removed: number;
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
export function prepareDiggingWorld(seed: string, workers: number) {
  if (!Number.isInteger(workers) || workers < 1 || workers > 400)
    throw Error("Grupo deve ter de 1 a 400 operárias.");
  const w = lessonWorld(seed, false, false);
  w.ants = w.ants.filter((a) => a.kind === "queen");
  const entry = w.nest.nodes.find((n) => n.type === "entrance")!;
  for (let i = 0; i < workers; i++) {
    const ant = w.makeAnt("worker", entry.x, entry.z);
    if (!placeWorker(w, ant, entry, i))
      throw Error("Não há espaço para posicionar " + workers + " operárias.");
    w.ants.push(ant);
  }
  w.food = 1000;
  w.born = workers;
  finishLessonWorld(w, true);
  return w;
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

function sample(w: LessonWorld, start: number): DiggingSample {
  return {
    tick: w.tick,
    removed: w.soil.removed - start,
    workers: w.ants.filter((a) => a.kind === "worker").length,
    activeProjects: w.soil.projects.filter((p) => !p.completed).length,
    nestNodes: w.nest.nodes.length,
  };
}

/** Runs the production step function; only the starting group is prepared. */
export function runDigging(options: DiggingRunOptions): DiggingRun {
  const every = options.sampleEvery ?? 5;
  if (!Number.isInteger(options.days) || options.days < 1 || options.days > 365)
    throw Error("Dias devem ser inteiros de 1 a 365.");
  if (!Number.isInteger(every) || every < 1)
    throw Error("Intervalo de amostragem deve ser inteiro positivo.");
  const w = prepareDiggingWorld(
    options.seed,
    options.workers,
  ) as LessonWorld & {
    step(): void;
  };
  const start = w.soil.removed,
    total = options.days * TICKS_PER_DAY,
    samples = [sample(w, start)];
  while (w.tick < total) {
    w.step();
    if (w.tick % every === 0 || w.tick === total)
      samples.push(sample(w, start));
  }
  return {
    seed: options.seed,
    workers: options.workers,
    days: options.days,
    samples,
  };
}
