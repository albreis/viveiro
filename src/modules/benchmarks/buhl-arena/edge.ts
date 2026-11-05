import { modelMath } from "../../../libs/model-math.ts";
import type { BuhlArena } from "./geometry.ts";
import { chancePerTick } from "./settings.ts";

const edgeLeavePerSecond = 0.0176;
const recessPerContact = 0.054;
const markerDeposit = 100;
const halfLifeSeconds = 1200;

export interface EdgeContact {
  cell: number;
  heading: number;
  face: number;
  freshContact: boolean;
  following: boolean;
}

export class BuhlEdgeContact {
  private readonly arena: BuhlArena;
  private readonly random: () => number;
  readonly #leaveChance: number;
  readonly #access: number;
  readonly #decayPerTick: number;
  readonly #marks: Map<number, { tick: number; value: number }> | null;
  #ticksOnEdge = 0;
  #digStarts = 0;
  #recruited = 0;

  constructor(
    arena: BuhlArena,
    random: () => number,
    seconds: number,
    recruit: boolean,
    access: number,
  ) {
    this.arena = arena;
    this.random = random;
    this.#access = access;
    this.#leaveChance = chancePerTick(edgeLeavePerSecond, seconds);
    this.#decayPerTick = (Math.LN2 * seconds) / halfLifeSeconds;
    this.#marks = recruit ? new Map() : null;
  }

  observe(agent: EdgeContact): void {
    const previous = agent.face;
    agent.face = this.firstFace(agent.cell, agent.heading);
    agent.freshContact = agent.face >= 0 && agent.face !== previous;
    if (agent.face < 0) agent.following = false;
    else {
      this.#ticksOnEdge++;
      if (previous < 0) agent.following = true;
      else if (agent.following && this.random() < this.#leaveChance)
        agent.following = false;
    }
  }

  firstFace(cell: number, heading: number): number {
    for (let turn = 0; turn < 4; turn++) {
      const target = this.arena.neighbor(cell, (heading + turn) & 3);
      if (this.arena.solid(target)) return target;
    }
    return -1;
  }

  shouldDig(agent: EdgeContact, tick: number, flatChance: number): boolean {
    if (agent.face < 0 || this.#access === 0) return false;
    let recess = false;
    if (this.arena.material(agent.cell) === "gallery") {
      let sides = 0;
      for (let heading = 0; heading < 4; heading++)
        if (this.arena.solid(this.arena.neighbor(agent.cell, heading))) sides++;
      recess = sides >= 2;
    }
    if (
      recess
        ? agent.freshContact && this.random() < recessPerContact * this.#access
        : flatChance > 0 && this.random() < flatChance * this.#access
    ) {
      this.#digStarts++;
      return true;
    }
    if (!this.#marks || !agent.freshContact) return false;
    let mark = this.#strength(agent.face, tick);
    for (let heading = 0; heading < 4; heading++) {
      const neighbor = this.arena.neighbor(agent.face, heading);
      mark = Math.max(mark, this.#strength(neighbor, tick));
    }
    const k = recess ? 200 : 3500;
    const chance = ((mark * mark) / (mark * mark + k * k)) * this.#access;
    if (chance === 0 || this.random() >= chance) return false;
    this.#recruited++;
    this.#digStarts++;
    return true;
  }

  deposit(target: number, tick: number): void {
    this.#marks?.set(target, {
      tick,
      value: this.#strength(target, tick) + markerDeposit,
    });
  }

  #strength(target: number, tick: number): number {
    const mark = this.#marks?.get(target);
    return mark
      ? mark.value * modelMath.exp(-this.#decayPerTick * (tick - mark.tick))
      : 0;
  }

  sample() {
    return {
      contactWorkerTicks: this.#ticksOnEdge,
      digStarts: this.#digStarts,
      recruitedDigStarts: this.#recruited,
    };
  }
}
