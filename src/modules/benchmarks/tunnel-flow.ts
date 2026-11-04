import { modelMath } from "../../libs/model-math.ts";
import { lessonWorld, type LessonWorld } from "../lessons/world.ts";
import { projectSupport } from "../terrain/terrain.js";
import { moveInNest } from "../navigation/tunnel-motion.ts";
import type { AgentState, NavigationWorld } from "../navigation/types.ts";

/**
 * Flow against density in one tunnel, to compare the shape of Viveiro's
 * traffic with ant traffic measured by Poissonnier et al. (2019). Workers
 * shuttle between the two rooms at the ends of one link using only the
 * production tunnel motion (social forces, contact, collision, retreat and
 * congestion widening). Tasks, hunger and the rest of the colony are off.
 */
export interface TunnelFlowOptions {
  seed: string;
  workers: number;
  ticks: number;
  /** Ticks discarded before measuring. */
  warmup?: number;
  /** Link index; defaults to the longest link between two rooms. */
  link?: number;
}
export interface TunnelFlowResult {
  seed: string;
  workers: number;
  link: number;
  length: number;
  /** Mean workers per unit length in the middle 70% of the tunnel. */
  density: number;
  /** Arrivals at either end per tick. */
  flow: number;
  /** Mean displacement per tick of workers in the middle of the tunnel. */
  speed: number;
  /** Displacement per tick a worker would make with nothing in the way. */
  nominalSpeed: number;
  /** Times a worker widened the tunnel because it was stuck. */
  widenings: number;
  finalWidth: number;
}

const ROOMS = ["royal", "nursery", "storage", "chamber", "waste"];

export function defaultFlowLink(world: LessonWorld) {
  let best = -1,
    longest = -1;
  world.nest.links.forEach(([a, b], i) => {
    const A = world.nest.nodes[a],
      B = world.nest.nodes[b];
    if (!ROOMS.includes(A.type) || !ROOMS.includes(B.type)) return;
    const d = modelMath.hypot(A.x - B.x, A.y - B.y, A.z - B.z);
    if (d > longest) {
      longest = d;
      best = i;
    }
  });
  if (best < 0) throw Error("O ninho não tem túnel entre duas câmaras.");
  return best;
}

export function runTunnelFlow(options: TunnelFlowOptions): TunnelFlowResult {
  const warmup = options.warmup ?? 100;
  if (
    !Number.isInteger(options.workers) ||
    options.workers < 1 ||
    options.workers > 400
  )
    throw Error("Grupo deve ter de 1 a 400 operárias.");
  if (!Number.isInteger(options.ticks) || options.ticks <= warmup)
    throw Error("Ticks devem ser inteiros e maiores que o aquecimento.");
  const w = lessonWorld(options.seed, false, false) as LessonWorld &
    NavigationWorld & {
      onNestArrival?: (ant: AgentState, id: number) => boolean;
      recordSoilRemoval?: (ant: AgentState, mass: number) => void;
    };
  const link = options.link ?? defaultFlowLink(w);
  if (!w.nest.links[link]) throw Error("Túnel inexistente: " + link);
  const [A, B] = w.nest.links[link],
    a = w.nest.nodes[A],
    b = w.nest.nodes[B];
  const other = (node: number) => (node === A ? B : A);
  w.ants = [];
  for (let i = 0; i < options.workers; i++) {
    const home = i % 2 ? A : B,
      room = w.nest.nodes[home];
    const ant = w.makeAnt("worker", room.x, room.z);
    const angle = i * 2.39996,
      reach = (room.r * 0.6 * ((i % 5) + 1)) / 5;
    const support = projectSupport(w.nest, {
      x: room.x + modelMath.cos(angle) * reach,
      y: room.y - room.r * 0.85,
      z: room.z + modelMath.sin(angle) * reach,
    });
    Object.assign(ant, support.point, {
      normal: support.normal,
      node: home,
      tunnelY: room.y,
      angle,
      age: 20,
      route: [other(home)],
    });
    w.ants.push(ant);
  }
  let arrivals = 0,
    widenings = 0;
  w.onNestArrival = (ant, id) => {
    if (w.tick > warmup) arrivals++;
    ant.route = [other(id)];
    return true;
  };
  // Widening still happens (it changes the tunnel); only the soil is not carried.
  w.recordSoilRemoval = () => {
    widenings++;
  };
  const length = modelMath.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  const along = (p: { x: number; y?: number; z: number }) =>
    ((p.x - a.x) * (b.x - a.x) +
      ((p.y || 0) - a.y) * (b.y - a.y) +
      (p.z - a.z) * (b.z - a.z)) /
    (length * length);
  let inside = 0,
    moved = 0,
    measured = 0;
  const nominalSpeed = (w.ants[0]?.speed ?? 0) * 0.85;
  while (w.tick < options.ticks) {
    w.tick++;
    for (const ant of w.ants) {
      if (ant.node != null && !ant.route?.length && !ant.supportMotion)
        ant.route = [other(ant.node)];
      const x = ant.x,
        y = ant.y || 0,
        z = ant.z;
      moveInNest(w, ant);
      if (w.tick <= warmup) continue;
      const f = along(ant);
      if (f > 0.15 && f < 0.85) {
        inside++;
        moved += modelMath.hypot(ant.x - x, (ant.y || 0) - y, ant.z - z);
      }
    }
    if (w.tick > warmup) measured++;
  }
  return {
    seed: options.seed,
    workers: options.workers,
    link,
    length,
    density: inside / measured / (0.7 * length),
    flow: arrivals / measured,
    speed: inside ? moved / inside : 0,
    nominalSpeed,
    widenings,
    finalWidth: w.nest.linkWidths?.[link] ?? 0.38,
  };
}

/**
 * Shape checks against Poissonnier et al. (2019): flow should rise with the
 * number of workers and level off without collapsing. Ordered by group size,
 * not measured density: a clog at the tunnel mouth lowers both flow and the
 * density inside the tunnel, which would hide it in a density ordering.
 */
export function flowShape(
  results: Pick<TunnelFlowResult, "workers" | "flow" | "speed">[],
) {
  const sorted = [...results].sort((p, q) => p.workers - q.workers);
  const peak = Math.max(...sorted.map((r) => r.flow));
  const last = sorted.at(-1)!;
  const first = sorted[0];
  return {
    collapse: peak > 0 && last.flow < 0.5 * peak,
    lastToPeak: peak > 0 ? last.flow / peak : null,
    speedRatio: first.speed > 0 ? last.speed / first.speed : null,
  };
}
