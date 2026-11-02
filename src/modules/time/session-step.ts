export interface StepWorld {
  tick: number;
  step(): void;
  intervene(type: unknown, x: unknown, z: unknown, value: unknown): unknown;
}
export interface ReplayCursor {
  interventions: Record<string, unknown>[];
  replaying: boolean;
  replayIndex: number;
}
/** Shared by the visible simulation and the headless worker: actions precede exactly the same tick. */
export function stepSession(
  world: StepWorld,
  comparison: StepWorld | null,
  cursor: ReplayCursor,
) {
  let applied = 0;
  if (cursor.replaying) {
    while (
      cursor.replayIndex < cursor.interventions.length &&
      Number(cursor.interventions[cursor.replayIndex].tick) <= world.tick
    ) {
      const a = cursor.interventions[cursor.replayIndex++];
      world.intervene(a.type, a.x, a.z, a.value);
      comparison?.intervene(a.type, a.x, a.z, a.value);
      applied++;
    }
  }
  world.step();
  comparison?.step();
  return applied;
}
