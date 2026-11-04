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
    this.cellVolumeCm3 = (pitchMm ** 2 * BUHL_DISK_MM.sandThickness) / 1000;
    this.#cells = new Uint8Array(width * width);
    const arenaR2 = (BUHL_DISK_MM.arenaDiameter / 2) ** 2;
    const sandR2 = (BUHL_DISK_MM.sandDiameter / 2) ** 2;
    let sand = 0;
    for (let index = 0; index < this.#cells.length; index++) {
      const point = this.center(index)!;
      const radius2 = point.xMm ** 2 + point.zMm ** 2;
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
      xMm ** 2 + zMm ** 2 >= half ** 2
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

  /** Opens only one solid cell sharing a side with reachable floor or gallery. */
  open(from: number, target: number): boolean {
    if (
      (this.material(from) !== "floor" && this.material(from) !== "gallery") ||
      this.material(target) !== "sand"
    )
      return false;
    const n = this.cellsPerSide;
    const adjacent =
      Math.abs((from % n) - (target % n)) +
        Math.abs(Math.floor(from / n) - Math.floor(target / n)) ===
      1;
    if (!adjacent) return false;
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
