import { World } from "../modules/simulation/world.js";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import type { SessionState } from "../modules/persistence/types.ts";
import { normalizeSession } from "../modules/persistence/validation.ts";
export function restoreSessionModels(value: unknown) {
  const session = normalizeSession(value),
    world: FamilyWorld = World.restore(session.world),
    comparison: FamilyWorld | null = session.comparison
      ? World.restore(session.comparison)
      : null;
  const initial = {
    ...session.initial,
    startMode:
      session.initial.startMode ||
      (world.founding ? "founding" : "established"),
  };
  return { session, world, comparison, initial };
}
export function captureSession(value: {
  world: FamilyWorld;
  comparison: FamilyWorld | null;
  scenario: string;
  initial: SessionState["initial"];
  interventions: Record<string, unknown>[];
  running: boolean;
  replaying: boolean;
  replayIndex: number;
}): SessionState {
  return normalizeSession({
    version: 1,
    ...value,
    world: value.world.snapshot(),
    comparison: value.comparison?.snapshot() ?? null,
  });
}
