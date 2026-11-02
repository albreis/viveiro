import { GENES } from "../genetics/genome.ts";
import type { FertilityState } from "./types.ts";
import { FERTILITY_PARAMETERS as p } from "./types.ts";
export function validateFertility(value: unknown, required: boolean): void {
  if (!required) return;
  const w = value as {
    tick: number;
    colony?: { fertility?: FertilityState };
    brood?: Array<{
      kind?: string;
      node: number;
      x: number;
      y: number;
      z: number;
      genome?: { ploidy: number; fatherId?: number };
      fertilization?: {
        version: number;
        requested: string;
        tick: number;
        sireId?: number;
      };
    }>;
  };
  const s = w.colony?.fertility,
    nonnegative = (n: unknown) =>
      typeof n === "number" && Number.isFinite(n) && n >= 0,
    integer = (n: unknown) => nonnegative(n) && Number.isSafeInteger(n);
  const fail = () => {
    throw new Error("Balanço ou parentesco da espermateca inválido.");
  };
  if (
    !s ||
    s.version !== 1 ||
    !integer(s.lastTick) ||
    s.lastTick > w.tick ||
    !Array.isArray(s.pools) ||
    s.pools.length > p.maxMates ||
    ![s.femaleAttempts, s.fertilized, s.failed, s.intentionalMales].every(
      integer,
    ) ||
    s.femaleAttempts !== s.fertilized + s.failed
  )
    return fail();
  const ids = new Set<number>();
  let used = 0;
  for (const x of s.pools) {
    if (
      !x ||
      !integer(x.maleId) ||
      ids.has(x.maleId) ||
      !integer(x.tick) ||
      x.tick > w.tick ||
      !["contact", "scenario"].includes(x.origin) ||
      x.received !== p.creditsPerMating ||
      ![x.viable, x.used, x.lost].every(nonnegative) ||
      !integer(x.used) ||
      Math.abs(x.received - x.viable - x.used - x.lost) > 1e-7 ||
      x.genome?.ploidy !== 1 ||
      x.genome.haplotypes?.length !== 1 ||
      x.genome.haplotypes[0]?.length !== GENES.length ||
      !x.genome.haplotypes[0].every(
        (n) => Number.isFinite(n) && n >= 0 && n <= 1,
      )
    )
      return fail();
    ids.add(x.maleId);
    used += x.used;
  }
  if (used !== s.fertilized * p.usePerFemale) return fail();
  for (const b of w.brood ?? []) {
    if (
      !Number.isSafeInteger(b.node) ||
      b.node < 0 ||
      ![b.x, b.y, b.z].every(Number.isFinite)
    )
      return fail();
    const f = b.fertilization;
    if (
      !f ||
      f.version !== 1 ||
      !["worker", "gyne", "male"].includes(f.requested) ||
      !integer(f.tick) ||
      f.tick > w.tick
    )
      return fail();
    const female = b.kind !== "male";
    if (
      !b.genome ||
      b.genome.ploidy !== (female ? 2 : 1) ||
      (female
        ? !ids.has(f.sireId!) ||
          f.sireId !== b.genome.fatherId ||
          f.requested === "male" ||
          f.requested !== b.kind
        : f.sireId !== undefined || b.genome.fatherId !== undefined)
    )
      return fail();
  }
}
