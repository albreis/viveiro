import { resolveBiologicalProfile } from "./catalog.ts";
import type { BiologicalReference, WorkerReference } from "./types.ts";
import type { AgentState } from "../navigation/types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import { hashSeed } from "../simulation/seed.ts";

interface ReferenceHost {
  biologicalProfile?: BiologicalReference;
}

const MESH_BODY_UNITS = 0.445;
const REFERENCE_WALK_SECONDS = 0.05;
const DEFAULT_SPEED_MEAN = 0.0875;

export function workerReference(host: ReferenceHost, ant: AgentState) {
  return ant.kind === "worker" && host.biologicalProfile
    ? resolveBiologicalProfile(host.biologicalProfile).workerReference
    : undefined;
}

export function applyReferenceWorker(
  reference: WorkerReference,
  seed: string,
  ant: ColonyAgent,
) {
  const [min, max] = reference.bodyRangeMm;
  const draw = hashSeed(seed + ":" + ant.id + ":reference-size") / 4294967296;
  // Illustrative distribution biased toward smaller workers.
  const fraction = draw * draw * draw;
  ant.bodyScale = (min + (max - min) * fraction) / reference.bodyMm;
  ant.headScale = 1 + fraction * 0.35;
  ant.speed *=
    (MESH_BODY_UNITS *
      REFERENCE_WALK_SECONDS *
      reference.openWalkingMmPerSecond) /
    (reference.bodyMm * DEFAULT_SPEED_MEAN);
  ant.caste = "minor";
  ant.role = "forager";
}

export function clampWorkerScale(reference: WorkerReference, scale: number) {
  const [min, max] = reference.bodyRangeMm;
  return Math.min(
    max / reference.bodyMm,
    Math.max(min / reference.bodyMm, scale),
  );
}

export function workerSizeFactor(
  reference: WorkerReference,
  ant: AgentState,
  [small, large]: readonly [number, number],
) {
  const [min, max] = reference.bodyRangeMm;
  const length =
    clampWorkerScale(reference, ant.bodyScale ?? 1) * reference.bodyMm;
  return small + ((length - min) / (max - min)) * (large - small);
}

export function surfaceWalkingSpeed(
  host: ReferenceHost,
  ant: AgentState,
  speed: number,
  celsius: number,
) {
  const reference = workerReference(host, ant);
  if (!reference) return speed;
  if (ant.carrying > 0 && reference.seedForaging)
    speed *= workerSizeFactor(
      reference,
      ant,
      reference.seedForaging.loadedWalkingFactor,
    );
  const points = reference.temperatures;
  let previous = points[0];
  if (celsius <= previous.celsius)
    return (
      (speed * previous.speedMmPerSecond) / reference.openWalkingMmPerSecond
    );
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (celsius <= point.celsius) {
      const fraction =
        (celsius - previous.celsius) / (point.celsius - previous.celsius);
      const walking =
        previous.speedMmPerSecond +
        fraction * (point.speedMmPerSecond - previous.speedMmPerSecond);
      return (speed * walking) / reference.openWalkingMmPerSecond;
    }
    previous = point;
  }
  return (speed * previous.speedMmPerSecond) / reference.openWalkingMmPerSecond;
}
