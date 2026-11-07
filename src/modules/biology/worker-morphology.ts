import { hashSeed } from "../simulation/seed.ts";
import type { WorkerReference } from "./types.ts";

/** The same illustrative size distribution in the terrarium and physical arena. */
export function referenceWorkerMorphology(
  reference: WorkerReference,
  seed: string,
  id: number,
) {
  const [min, max] = reference.bodyRangeMm;
  const draw = hashSeed(seed + ":" + id + ":reference-size") / 4294967296;
  const fraction = draw * draw * draw;
  return {
    bodyScale: (min + (max - min) * fraction) / reference.bodyMm,
    headScale: 1 + fraction * 0.35,
  };
}
