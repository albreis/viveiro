import type { SessionState } from "../persistence/types.ts";
import type { SaveOutcome } from "../../services/checkpoints/results.ts";
import { normalizeSession } from "../persistence/validation.ts";

export interface LessonSwitchContext {
  pause(): void;
  capture(): SessionState;
  backup(session: SessionState, label: string): Promise<SaveOutcome>;
  apply(session: SessionState): void;
}
export async function switchLesson(
  candidate: SessionState,
  context: LessonSwitchContext,
) {
  const next = normalizeSession(candidate);
  context.pause();
  const prior = normalizeSession(context.capture()),
    fingerprint = JSON.stringify(prior);
  const label =
    "Antes da aula · " +
    prior.world.seed +
    " · D" +
    (prior.world.tick / 100).toFixed(1);
  const saved = await context.backup(prior, label);
  if (!saved.ok || saved.backend !== "indexedDB")
    throw Error(
      "O checkpoint anterior não foi guardado no IndexedDB. O terrário atual foi mantido em pausa.",
    );
  if (JSON.stringify(context.capture()) !== fingerprint)
    throw Error(
      "O experimento mudou durante a gravação. Nenhuma aula foi aplicada.",
    );
  context.apply(next);
  return saved.id;
}
