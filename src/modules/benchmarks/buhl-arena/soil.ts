import type { BuhlArena } from "./geometry.ts";
import { BUHL_INDIVIDUAL } from "./settings.ts";

/** Mass accounts use integer micrograms. A cell opens at full depletion. */
export class BuhlSoilLedger {
  readonly cellMassMicrograms: number;
  readonly #removedByCell: Uint32Array;
  readonly #piles = new Map<number, number[]>();
  #dug = 0;
  #carried = 0;
  #deposited = 0;
  #fullPellets = 0;
  #fragments = 0;
  #pickups = 0;
  #drops = 0;

  private readonly arena: BuhlArena;
  private readonly density: number;

  constructor(arena: BuhlArena, density: number) {
    this.arena = arena;
    this.density = density;
    this.cellMassMicrograms = Math.round(arena.cellVolumeCm3 * density * 1e6);
    this.#removedByCell = new Uint32Array(
      arena.cellsPerSide * arena.cellsPerSide,
    );
  }

  nextLoad(target: number): number {
    if (this.arena.material(target) !== "sand") return 0;
    return Math.min(
      BUHL_INDIVIDUAL.pelletMicrograms,
      this.cellMassMicrograms - this.#removedByCell[target],
    );
  }

  dig(from: number, target: number, expected: number): number {
    const amount = this.nextLoad(target);
    if (amount === 0 || amount !== expected) return 0;
    if (!this.arena.adjacent(from, target) || !this.arena.walkable(from))
      return 0;
    const removed = this.#removedByCell[target] + amount;
    if (removed === this.cellMassMicrograms && !this.arena.open(from, target))
      throw Error("A face escavada perdeu a ligação com a galeria.");
    this.#removedByCell[target] = removed;
    this.#dug += amount;
    this.#carried += amount;
    if (amount === BUHL_INDIVIDUAL.pelletMicrograms) this.#fullPellets++;
    else this.#fragments++;
    return amount;
  }

  drop(cell: number, mass: number): void {
    const pile = this.#piles.get(cell) ?? [];
    pile.push(mass);
    this.#piles.set(cell, pile);
    this.#carried -= mass;
    this.#deposited += mass;
    this.#drops++;
  }

  hasDeposit(cell: number): boolean {
    return this.#piles.has(cell);
  }

  pickUp(cell: number): number {
    const pile = this.#piles.get(cell);
    if (!pile) return 0;
    const mass = pile.pop()!;
    if (!pile.length) this.#piles.delete(cell);
    this.#deposited -= mass;
    this.#carried += mass;
    this.#pickups++;
    return mass;
  }

  sample() {
    return {
      ...this.arena.measure(),
      removedSoilCm3: this.#dug / (this.density * 1e6),
      trafficOpenedCells: 0,
      fullPellets: this.#fullPellets,
      fragments: this.#fragments,
      pickups: this.#pickups,
      drops: this.#drops,
      dugMicrograms: this.#dug,
      carriedMicrograms: this.#carried,
      depositedMicrograms: this.#deposited,
    };
  }
}
