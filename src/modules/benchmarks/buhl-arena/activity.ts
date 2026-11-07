import type { BuhlArena } from "./geometry.ts";

interface ObservedWorker {
  id: number;
  cell: number;
  load: number;
  dig: unknown;
}

export const BUHL_ACTIVITY_IDLE_SECONDS = 10;

/** Observational counters. Sampling never chooses or changes an action. */
export class BuhlActivity {
  readonly #lastActive: Uint32Array;
  readonly #lastBlocked: Uint32Array;
  readonly #diggingByWorker: Uint32Array;
  readonly #massByWorker: Float64Array;
  readonly #secondsPerTick: number;
  #diggingTicks = 0;
  #carryingTicks = 0;
  #successfulDigs = 0;
  #failedDigs = 0;
  #removedMicrograms = 0;
  #blockedMoves = 0;
  #unloadedSteps = 0;
  #loadedSteps = 0;

  constructor(workers: number, secondsPerTick: number) {
    this.#lastActive = new Uint32Array(workers + 1);
    this.#lastBlocked = new Uint32Array(workers + 1);
    this.#diggingByWorker = new Uint32Array(workers + 1);
    this.#massByWorker = new Float64Array(workers + 1);
    this.#secondsPerTick = secondsPerTick;
  }

  digging(id: number, tick: number): void {
    this.#diggingTicks++;
    this.#diggingByWorker[id]++;
    this.moved(id, tick);
  }

  carrying(id: number, tick: number): void {
    this.#carryingTicks++;
    this.moved(id, tick);
  }

  stepped(id: number, tick: number, loaded: boolean): void {
    if (loaded) this.#loadedSteps++;
    else this.#unloadedSteps++;
    this.moved(id, tick);
  }

  moved(id: number, tick: number): void {
    this.#lastActive[id] = tick;
  }

  blocked(id: number, tick: number): void {
    this.#blockedMoves++;
    this.#lastBlocked[id] = tick;
  }

  completedDig(id: number, removedMicrograms: number): void {
    this.#massByWorker[id] += removedMicrograms;
    if (removedMicrograms > 0) this.#successfulDigs++;
    else this.#failedDigs++;
    this.#removedMicrograms += removedMicrograms;
  }

  byWorker() {
    return Array.from(
      this.#massByWorker.subarray(1),
      (removedMicrograms, index) => ({
        workerId: index + 1,
        removedMicrograms,
        diggingSeconds: this.#diggingByWorker[index + 1] * this.#secondsPerTick,
      }),
    );
  }

  sample(
    arena: BuhlArena,
    workers: readonly ObservedWorker[],
    occupied: Uint16Array,
    tick: number,
  ) {
    let workersAdjacentToSand = 0;
    const idle = new Set<number>();
    const cutoff = tick - BUHL_ACTIVITY_IDLE_SECONDS / this.#secondsPerTick;
    for (const worker of workers) {
      let atFace = false;
      for (let heading = 0; heading < 4; heading++) {
        if (arena.solid(arena.neighbor(worker.cell, heading))) atFace = true;
      }
      if (atFace) workersAdjacentToSand++;
      if (
        !atFace &&
        !worker.dig &&
        !worker.load &&
        this.#lastActive[worker.id] <= cutoff &&
        this.#lastBlocked[worker.id] <= cutoff
      )
        idle.add(worker.id);
    }
    let adjacentIdleWorkers = 0;
    for (const worker of workers) {
      if (!idle.has(worker.id)) continue;
      for (let heading = 0; heading < 4; heading++) {
        if (idle.has(occupied[arena.neighbor(worker.cell, heading)])) {
          adjacentIdleWorkers++;
          break;
        }
      }
    }
    const diggingSeconds = this.#diggingTicks * this.#secondsPerTick;
    return {
      workersAdjacentToSand,
      adjacentIdleWorkers,
      blockedMoves: this.#blockedMoves,
      unloadedSteps: this.#unloadedSteps,
      loadedSteps: this.#loadedSteps,
      diggingSeconds,
      carryingSeconds: this.#carryingTicks * this.#secondsPerTick,
      successfulDigs: this.#successfulDigs,
      failedDigs: this.#failedDigs,
      removedMicrograms: this.#removedMicrograms,
      microgramsPerDiggingHour:
        diggingSeconds === 0
          ? null
          : (3600 * this.#removedMicrograms) / diggingSeconds,
    };
  }
}
