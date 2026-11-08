import { modelMath } from "../../libs/model-math.ts";
import { profileReference } from "../biology/catalog.ts";
import { World } from "../simulation/world.js";
import type { LessonWorld } from "../lessons/world.ts";
import { invalidateNeighbors } from "../navigation/sensors.ts";
import { positionClear } from "../navigation/collision.ts";
import { position, length, sub } from "../navigation/vectors.ts";
import { projectSupport } from "../terrain/surface-queries.ts";
import { sampleSupport } from "../terrain/field.ts";
import { proposeDig } from "../soil/projects.ts";
import { soilBalance } from "../soil/ledger.ts";
import { surfaceHeight, timberLevel } from "../landscape/queries.ts";
import { addStock } from "../stores/ledger.ts";

export interface DigAccessOptions {
  seed: string;
  workers: number;
  profileVersion: 2 | 3;
  ticks: number;
  sampleEvery?: number;
}
type TestWorld = LessonWorld & { step(count?: number): void };

/** Prepared adult cohort in a procedural mature nest, not Buhl's planar arena. */
export function prepareDigAccess(
  options: Pick<DigAccessOptions, "seed" | "workers" | "profileVersion">,
): TestWorld {
  if (
    !Number.isInteger(options.workers) ||
    options.workers < 1 ||
    options.workers > 200
  )
    throw Error("Expected 1–200 workers");
  if (![2, 3].includes(options.profileVersion))
    throw Error("Expected Narbonne revision 2 or 3");
  const w = new World(
    options.seed,
    { humidity: 68, temperatureC: 24, windX: 0, windZ: 0 },
    {
      founding: false,
      biologicalProfile: profileReference(
        "messor-narbonne",
        options.profileVersion,
      ),
    },
  ) as unknown as TestWorld;
  w.ants = [];
  w.brood = [];
  w.predators = [];
  const rooms = w.nest.nodes
    .map((n, index) => ({ n, index }))
    .filter(({ n }) =>
      ["royal", "nursery", "storage", "chamber", "waste"].includes(n.type),
    );
  for (let i = 0; i < options.workers; i++) {
    const ant = w.makeAnt("worker", 0, 0);
    let placed = false;
    for (let attempt = 0; attempt < 128; attempt++) {
      const j = i + attempt,
        room = rooms[j % rooms.length];
      const angle = j * 2.399963229728653;
      const y = 1 - 2 * (((j * 0.618033988749895) % 1) * 0.9 + 0.05);
      const radial = Math.sqrt(1 - y * y);
      const input = {
        x: room.n.x + modelMath.cos(angle) * radial * room.n.r,
        y: room.n.y + y * room.n.r,
        z: room.n.z + modelMath.sin(angle) * radial * room.n.r,
      };
      const support = projectSupport(w.nest, input);
      if (
        Math.abs(support.gap - 0.008) > 0.015 ||
        length(sub(support.point, room.n)) > room.n.r + 0.06 ||
        !positionClear(w, ant, support.point, angle, 0, support.normal, false)
      )
        continue;
      Object.assign(ant, support.point, {
        normal: support.normal,
        angle,
        node: room.index,
        tunnelCenter: position(room.n),
        tunnelY: room.n.y,
        age: 20,
        route: [],
      });
      w.ants.push(ant);
      invalidateNeighbors(w);
      placed = true;
      break;
    }
    // Do not stack a large cohort into the small pre-existing chambers.
    for (let attempt = 0; !placed && attempt < 8000; attempt++) {
      const j = i + attempt,
        angle = j * 2.399963229728653;
      const x = -9.2 + ((j * 0.618033988749895) % 1) * 18.4;
      const z = -5.7 + ((j * 0.414213562373095) % 1) * 11.4;
      const top = surfaceHeight(w.nest.relief, x, z);
      if (w.inPond(x, z) || timberLevel(w.landscape, x, z) < 2) continue;
      const support = projectSupport(w.nest, { x, y: top + 0.008, z });
      if (
        Math.abs(support.gap - 0.008) > 0.015 ||
        !positionClear(w, ant, support.point, angle, 0, support.normal, false)
      )
        continue;
      Object.assign(ant, support.point, {
        normal: support.normal,
        angle,
        age: 20,
        node: null,
        route: [],
      });
      w.ants.push(ant);
      invalidateNeighbors(w);
      placed = true;
    }
    if (!placed)
      throw Error(
        "Cohort does not fit without initial body overlap: " + (i + 1),
      );
  }
  const storage = w.nest.nodes.findIndex((n) => n.type === "storage");
  addStock(w, 200, "foraged", storage);
  w.born = options.workers;
  if (!proposeDig(w, 3)) throw Error("No local excavation goal for this seed");
  return w;
}

export function digAccessSample(w: TestWorld) {
  return {
    tick: w.tick,
    removed: w.soil.removed,
    deposited: w.soil.deposited,
    frontRemoved: w.soil.projects.reduce((n, p) => n + p.excavated, 0),
    workers: w.ants.filter((a) => a.kind === "worker").length,
    openFronts: w.soil.projects.filter((p) => !p.completed).length,
    assigned: w.ants.filter((a) => a.soilTask).length,
    atFace: w.ants.filter((a) => a.soilTask?.phase === "dig").length,
  };
}

/** Actual World.step; no time/volume conversion to Buhl, no fatigue or productivity tuning. */
export function runDigAccess(
  options: DigAccessOptions,
  world = prepareDigAccess(options),
) {
  const every = options.sampleEvery ?? 100;
  if (
    !Number.isInteger(options.ticks) ||
    options.ticks < 1 ||
    options.ticks > 100_000 ||
    !Number.isInteger(every) ||
    every < 1
  )
    throw Error("Invalid tick budget or sampling interval");
  const samples = [digAccessSample(world)];
  let maxBalanceError = 0,
    maxStepToSpeed = 0,
    maxSupportGap = 0;
  const started = world.tick;
  while (world.tick < started + options.ticks) {
    const before = new Map(world.ants.map((a) => [a.id, position(a)]));
    world.predators = []; // Deliberate control: no predation, all other biology runs.
    world.step();
    maxBalanceError = Math.max(
      maxBalanceError,
      Math.abs(soilBalance(world).error),
    );
    for (const ant of world.ants) {
      const old = before.get(ant.id);
      if (old)
        maxStepToSpeed = Math.max(
          maxStepToSpeed,
          length(sub(position(ant), old)) / ant.speed,
        );
      if ((ant.y ?? 0) < -0.04)
        maxSupportGap = Math.max(
          maxSupportGap,
          Math.abs(sampleSupport(world.nest, position(ant)).distance - 0.008),
        );
      if (![ant.x, ant.y, ant.z].every(Number.isFinite))
        throw Error("Non-finite agent position");
    }
    if (world.tick % every === 0 || world.tick === started + options.ticks)
      samples.push(digAccessSample(world));
  }
  return {
    options,
    engine: "World.step",
    buhlComparable: false,
    timeUnit: "model tick",
    volumeUnit: "model volume",
    maxBalanceError,
    maxStepToSpeed,
    maxSupportGap,
    samples,
  };
}
