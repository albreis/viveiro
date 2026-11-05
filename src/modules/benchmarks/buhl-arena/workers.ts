import { BuhlEdgeContact, type EdgeContact } from "./edge.ts";
import { seededRandom } from "../../../libs/seeded-random.ts";
import type { BuhlArena } from "./geometry.ts";
import { placeBuhlWorkers } from "./placement.ts";
import {
  BUHL_INDIVIDUAL,
  chancePerTick,
  type BuhlLabPlan,
} from "./settings.ts";
import type { BuhlSoilLedger } from "./soil.ts";

interface DigTask {
  target: number;
  mass: number;
  untilTick: number;
}
interface Worker extends EdgeContact {
  id: number;
  load: number;
  dig: DigTask | null;
}

export class BuhlLabWorkers {
  readonly #agents: Worker[];
  readonly #occupied: Uint16Array;
  readonly #random: () => number;
  readonly #moveChance: number;
  readonly #digChance: number;
  readonly #dropChance: number;
  readonly #edge: BuhlEdgeContact | null;
  #steps = 0;

  private readonly arena: BuhlArena;
  private readonly soil: BuhlSoilLedger;
  private readonly plan: BuhlLabPlan;

  constructor(arena: BuhlArena, soil: BuhlSoilLedger, plan: BuhlLabPlan) {
    this.arena = arena;
    this.soil = soil;
    this.plan = plan;
    this.#random = seededRandom(plan.seed + ":buhl-lab-workers-v1").random;
    this.#occupied = new Uint16Array(arena.cellsPerSide ** 2);
    const seconds = plan.tickMilliseconds / 1000;
    this.#edge =
      plan.mechanism === "local"
        ? null
        : new BuhlEdgeContact(
            arena,
            this.#random,
            seconds,
            plan.mechanism === "edge-recruit",
            plan.contactAccess,
          );
    this.#moveChance =
      (BUHL_INDIVIDUAL.speedMmPerSecond * seconds) / plan.pitchMm;
    this.#digChance = chancePerTick(plan.digRatePerSecond, seconds);
    this.#dropChance = chancePerTick(
      BUHL_INDIVIDUAL.dropRatePerSecond,
      seconds,
    );
    this.#agents = placeBuhlWorkers(
      arena,
      plan.seed,
      plan.workers,
      plan.separationMm,
    ).map((point, index) => {
      const cell = arena.indexAt(point)!;
      if (this.#occupied[cell])
        throw Error("Duas operárias na mesma célula inicial.");
      const id = index + 1;
      this.#occupied[cell] = id;
      return {
        id,
        cell,
        heading: Math.floor(this.#random() * 4),
        load: 0,
        face: -1,
        freshContact: false,
        following: false,
        dig: null,
      };
    });
  }

  step(tick: number): void {
    for (const worker of this.#agents) {
      if (worker.dig) {
        if (tick >= worker.dig.untilTick) {
          worker.load = this.soil.dig(
            worker.cell,
            worker.dig.target,
            worker.dig.mass,
          );
          if (worker.load) this.#edge?.deposit(worker.dig.target, tick);
          worker.dig = null;
        }
        continue;
      }
      if (worker.load && this.#random() < this.#dropChance) {
        this.soil.drop(worker.cell, worker.load);
        worker.load = 0;
        continue;
      }
      this.#edge?.observe(worker);
      if (!worker.load && this.#startDig(worker, tick)) continue;
      if (this.#random() < this.#moveChance) this.#move(worker);
    }
  }

  #startDig(worker: Worker, tick: number): boolean {
    const target = this.#edge
      ? worker.face
      : this.arena.neighbor(worker.cell, worker.heading);
    const allowed = this.#edge
      ? this.#edge.shouldDig(worker, tick, this.#digChance)
      : this.#digChance > 0 &&
        this.arena.solid(target) &&
        this.#random() < this.#digChance;
    if (!allowed) return false;
    const mass = this.soil.nextLoad(target);
    const elapsedTicks = Math.ceil(
      (BUHL_INDIVIDUAL.pelletSeconds * 1000 * mass) /
        (this.plan.tickMilliseconds * BUHL_INDIVIDUAL.pelletMicrograms),
    );
    worker.dig = { target, mass, untilTick: tick + elapsedTicks };
    return true;
  }

  #move(worker: Worker): void {
    const draw = this.#random();
    const turn = draw < 0.04 ? 1 : draw < 0.08 ? 3 : draw < 0.085 ? 2 : 0;
    const side = draw < 0.5 ? 1 : 3;
    const facing = (worker.heading + turn) & 3;
    let target = -1;
    let direction = facing;
    for (let attempt = 0; attempt < 4; attempt++) {
      const offset =
        attempt === 0 ? 0 : attempt === 1 ? side : attempt === 2 ? 4 - side : 2;
      const heading = (facing + offset) & 3;
      const cell = this.arena.neighbor(worker.cell, heading);
      if (this.#occupied[cell] || !this.arena.walkable(cell)) continue;
      if (target < 0) {
        target = cell;
        direction = heading;
      }
      if (!worker.following || this.#edge!.firstFace(cell, heading) >= 0) {
        target = cell;
        direction = heading;
        break;
      }
    }
    if (target < 0) return;
    this.#occupied[worker.cell] = 0;
    this.#occupied[target] = worker.id;
    worker.cell = target;
    worker.heading = direction;
    this.#steps++;
    if (
      !worker.load &&
      this.soil.hasDeposit(target) &&
      this.#random() < this.plan.pickupPerContact
    )
      worker.load = this.soil.pickUp(target);
  }

  sample() {
    let digging = 0;
    let carrying = 0;
    for (const worker of this.#agents) {
      if (worker.dig) digging++;
      if (worker.load) carrying++;
    }
    return {
      workers: this.#agents.length,
      digging,
      carrying,
      distanceMm: this.#steps * this.arena.pitchMm,
      ...this.#edge?.sample(),
    };
  }
}
