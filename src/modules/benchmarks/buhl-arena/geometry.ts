export const BUHL_DISK_MM = Object.freeze({
  arenaDiameter: 500,
  sandDiameter: 200,
  sandThickness: 5,
});

const materials = ["outside", "floor", "sand", "gallery"] as const;
export type ArenaMaterial = (typeof materials)[number];
export interface ArenaPoint {
  xMm: number;
  zMm: number;
}

/** Planar geometry only. Digging and movement rules belong to the lab runner. */
export class BuhlArena {
  readonly pitchMm: number;
  readonly cellsPerSide: number;
  readonly initialSandCells: number;
  readonly cellVolumeCm3: number;
  readonly #cells: Uint8Array;
  #removed = 0;

  constructor(pitchMm = 0.8) {
    const width = BUHL_DISK_MM.arenaDiameter / pitchMm;
    if (
      !Number.isFinite(pitchMm) ||
      pitchMm < 0.5 ||
      pitchMm > 5 ||
      !Number.isInteger(width)
    )
      throw Error("A célula deve ter 0,5–5 mm e dividir a largura da arena.");
    this.pitchMm = pitchMm;
    this.cellsPerSide = width;
    this.cellVolumeCm3 =
      (pitchMm * pitchMm * BUHL_DISK_MM.sandThickness) / 1000;
    this.#cells = new Uint8Array(width * width);
    const arenaRadius = BUHL_DISK_MM.arenaDiameter / 2;
    const arenaR2 = arenaRadius * arenaRadius;
    const sandRadius = BUHL_DISK_MM.sandDiameter / 2;
    const sandR2 = sandRadius * sandRadius;
    let sand = 0;
    for (let index = 0; index < this.#cells.length; index++) {
      const point = this.center(index)!;
      const radius2 = point.xMm * point.xMm + point.zMm * point.zMm;
      if (radius2 < sandR2) {
        this.#cells[index] = 2;
        sand++;
      } else if (radius2 < arenaR2) this.#cells[index] = 1;
    }
    this.initialSandCells = sand;
  }

  center(index: number): ArenaPoint | null {
    if (!Number.isInteger(index) || index < 0 || index >= this.#cells.length)
      return null;
    const half = BUHL_DISK_MM.arenaDiameter / 2;
    return {
      xMm: ((index % this.cellsPerSide) + 0.5) * this.pitchMm - half,
      zMm: (Math.floor(index / this.cellsPerSide) + 0.5) * this.pitchMm - half,
    };
  }

  indexAt({ xMm, zMm }: ArenaPoint): number | null {
    const half = BUHL_DISK_MM.arenaDiameter / 2;
    if (
      !Number.isFinite(xMm) ||
      !Number.isFinite(zMm) ||
      xMm * xMm + zMm * zMm >= half * half
    )
      return null;
    const x = Math.floor((xMm + half) / this.pitchMm);
    const z = Math.floor((zMm + half) / this.pitchMm);
    if (x >= this.cellsPerSide || z >= this.cellsPerSide) return null;
    return z * this.cellsPerSide + x;
  }

  material(index: number | null): ArenaMaterial {
    return index === null
      ? "outside"
      : (materials[this.#cells[index]] ?? "outside");
  }

  solid(index: number): boolean {
    return this.#cells[index] === 2;
  }

  walkable(index: number): boolean {
    const material = this.#cells[index];
    return material === 1 || material === 3;
  }

  /** Cardinal headings clockwise from east; -1 denotes the grid boundary. */
  neighbor(index: number, heading: number): number {
    const n = this.cellsPerSide;
    switch (heading) {
      case 0:
        return index % n === n - 1 ? -1 : index + 1;
      case 1:
        return index >= n * (n - 1) ? -1 : index + n;
      case 2:
        return index % n === 0 ? -1 : index - 1;
      default:
        return index < n ? -1 : index - n;
    }
  }

  adjacent(from: number, target: number): boolean {
    const n = this.cellsPerSide;
    return (
      Math.abs((from % n) - (target % n)) +
        Math.abs(Math.floor(from / n) - Math.floor(target / n)) ===
      1
    );
  }

  /** Opens only one solid cell sharing a side with reachable floor or gallery. */
  open(from: number, target: number): boolean {
    if (
      (this.material(from) !== "floor" && this.material(from) !== "gallery") ||
      this.material(target) !== "sand"
    )
      return false;
    if (!this.adjacent(from, target)) return false;
    this.#cells[target] = 3;
    this.#removed++;
    return true;
  }

  measure() {
    return {
      initialSandCells: this.initialSandCells,
      remainingSandCells: this.initialSandCells - this.#removed,
      openedCells: this.#removed,
      voidVolumeCm3: this.#removed * this.cellVolumeCm3,
    };
  }
}
