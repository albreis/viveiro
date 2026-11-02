import type { ColonyWorld } from "../colony/types.ts";
import { hashSeed } from "../simulation/seed.ts";
import { FERTILITY_PARAMETERS as p } from "./types.ts";
export function fertilizeEgg(
  w: ColonyWorld,
  id: number,
  requested: "worker" | "gyne" | "male",
) {
  const s = w.colony.fertility;
  if (!s) return { kind: requested };
  const record = { version: 1 as const, requested, tick: w.tick };
  if (requested === "male") {
    s.intentionalMales++;
    return { kind: requested, record };
  }
  s.femaleAttempts++;
  const candidates = s.pools.filter((x) => x.viable >= p.usePerFemale),
    total = candidates.reduce((n, x) => n + x.viable, 0);
  let draw = (hashSeed(w.seed + ":paternity:" + id) / 4294967296) * total;
  const pool = candidates.find((x) => (draw -= x.viable) < 0);
  if (!pool) {
    s.failed++;
    return { kind: "male" as const, record };
  }
  pool.viable -= p.usePerFemale;
  pool.used += p.usePerFemale;
  s.fertilized++;
  return {
    kind: requested,
    record: { ...record, sireId: pool.maleId },
    sire: { id: pool.maleId, genome: pool.genome },
  };
}
