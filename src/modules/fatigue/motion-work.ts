export const WALK_WORK_PER_REFERENCE_SECOND = 0.05;

/** Equivalent effort relative to the time a distance takes at reference speed. */
export function motionWork(referenceSeconds: number, loadFraction: number) {
  return (
    referenceSeconds *
    WALK_WORK_PER_REFERENCE_SECOND *
    (1 + Math.min(1, Math.max(0, loadFraction)))
  );
}
