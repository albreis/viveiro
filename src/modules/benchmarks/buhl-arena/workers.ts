import { moveBuhlWorker, type BuhlMotionContext } from "./worker-motion.ts";
import { BuhlWorkerProfile } from "./worker-profile.ts";
import { BuhlBodyContacts } from "./body-contacts.ts";
import { BuhlMicroclimate } from "./microclimate.ts";
import { BuhlActivity } from "./activity.ts";
import { BuhlDigFatigue } from "./dig-fatigue.ts";
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
  effortTicks: number;
}
interface Worker extends EdgeContact {
  id: number;
  bodyScale: number;
  headScale: number;
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
  readonly #activity?: BuhlActivity;
  readonly #microclimate?: BuhlMicroclimate;
  readonly #walkingEffortPerStep: number;
  readonly #profile?: BuhlWorkerProfile;
  readonly #motion: BuhlMotionContext;
  #steps = 0;

  private readonly arena: BuhlArena;
  private readonly soil: BuhlSoilLedger;
  private readonly plan: BuhlLabPlan;

  constructor(arena: BuhlArena, soil: BuhlSoilLedger, plan: BuhlLabPlan) {
    this.arena = arena;
    this.soil = soil;
    this.plan = plan;
    if (plan.workerProfile) this.#profile = new BuhlWorkerProfile(plan);
    this.#random = seededRandom(plan.seed + ":buhl-lab-workers-v1").random;
    this.#occupied = new Uint16Array(arena.cellsPerSide * arena.cellsPerSide);
    const seconds = plan.tickMilliseconds / 1000;
    if (plan.observeActivity)
      this.#activity = new BuhlActivity(plan.workers, seconds);
    this.#edge =
      plan.mechanism === "local"
        ? null
        : new BuhlEdgeContact(
            arena,
            this.#random,
            seconds,
            plan.mechanism === "edge-recruit",
            plan.contactAccess,
            plan.digFatigue
              ? seededRandom(plan.seed + ":buhl-dig-fatigue-v1").random
              : null,
          );
    if (plan.microclimate)
      this.#microclimate = new BuhlMicroclimate(plan.microclimate, seconds);
    const speed =
      this.#microclimate?.walkingMmPerSecond ??
      BUHL_INDIVIDUAL.speedMmPerSecond;
    this.#moveChance = (speed * seconds) / plan.pitchMm;
    this.#walkingEffortPerStep =
      plan.digFatigue === "action-recovery"
        ? plan.pitchMm / BUHL_INDIVIDUAL.speedMmPerSecond
        : 0;
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
        ...(plan.digFatigue ? { digFatigue: new BuhlDigFatigue(seconds) } : {}),
        id,
        ...(this.#profile?.body(plan.seed, id) ?? {
          bodyScale: 1,
          headScale: 1,
        }),
        cell,
        heading: Math.floor(this.#random() * 4),
        load: 0,
        face: -1,
        freshContact: false,
        following: false,
        dig: null,
      };
    });
    this.#motion = {
      arena,
      soil,
      plan,
      random: this.#random,
      occupied: this.#occupied,
      edge: this.#edge,
      activity: this.#activity,
      walkingEffortPerStep: this.#walkingEffortPerStep,
      ...(this.#profile
        ? {
            contacts: new BuhlBodyContacts(
              arena,
              this.#agents,
              this.#profile.mmPerModelUnit,
            ),
          }
        : {}),
    };
  }

  step(tick: number): void {
    for (const worker of this.#agents) {
      if (worker.dig) {
        this.#activity?.digging(worker.id, tick);
        if (tick >= worker.dig.untilTick) {
          worker.digFatigue?.recordWork(tick, worker.dig.effortTicks);
          worker.load = this.soil.dig(
            worker.cell,
            worker.dig.target,
            worker.dig.mass,
          );
          this.#activity?.completedDig(worker.id, worker.load);
          if (worker.load) this.#edge?.deposit(worker.dig.target, tick);
          worker.dig = null;
        }
        continue;
      }
      if (worker.load) this.#activity?.carrying(worker.id, tick);
      if (worker.load && this.#random() < this.#dropChance) {
        this.soil.drop(worker.cell, worker.load);
        worker.load = 0;
        continue;
      }
      this.#edge?.observe(worker);
      if (!worker.load && this.#startDig(worker, tick)) continue;
      const chance = this.#profile
        ? (this.#profile.walkingSpeed(
            worker.load / BUHL_INDIVIDUAL.pelletMicrograms,
            this.arena.material(worker.cell) === "gallery",
          ) *
            (this.plan.tickMilliseconds / 1000)) /
          this.plan.pitchMm
        : this.#moveChance;
      if (this.#random() < chance && moveBuhlWorker(this.#motion, worker, tick))
        this.#steps++;
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
      (BUHL_INDIVIDUAL.pelletSeconds *
        (this.#microclimate?.pelletTimeFactor(tick) ?? 1) *
        1000 *
        mass) /
        (this.plan.tickMilliseconds * BUHL_INDIVIDUAL.pelletMicrograms),
    );
    worker.dig = {
      target,
      mass,
      untilTick: tick + elapsedTicks,
      effortTicks: elapsedTicks,
    };
    return true;
  }

  workerPhenotypes() {
    if (!this.#profile) return undefined;
    const ref = this.#profile.reference;
    return this.#agents.map((a) => ({
      id: a.id,
      bodyMm: a.bodyScale * ref.bodyMm,
      bodyScale: a.bodyScale,
      headScale: a.headScale,
      walkingMmPerSecond: this.#profile!.walkingMmPerSecond,
      loadedGalleryWalkingMmPerSecond: this.#profile!.walkingSpeed(1, true),
    }));
  }

  individualActivity() {
    return this.#activity?.byWorker();
  }

  sample(tick: number) {
    let digging = 0;
    let carrying = 0;
    let readiness = 0;
    for (const worker of this.#agents) {
      if (worker.dig) digging++;
      if (worker.load) carrying++;
      if (worker.digFatigue) readiness += worker.digFatigue.readiness(tick);
    }
    return {
      workers: this.#agents.length,
      digging,
      carrying,
      ...(this.plan.digFatigue
        ? { meanDigReadiness: readiness / this.#agents.length }
        : {}),
      distanceMm: this.#steps * this.arena.pitchMm,
      ...this.#motion.contacts?.sample(),
      ...(this.#microclimate
        ? { microclimate: this.#microclimate.sample(tick) }
        : {}),
      ...(this.#activity
        ? {
            activity: this.#activity.sample(
              this.arena,
              this.#agents,
              this.#occupied,
              tick,
            ),
          }
        : {}),
      ...this.#edge?.sample(),
    };
  }
}
