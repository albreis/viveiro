import type { SessionState } from "../../modules/persistence/types.ts";
export interface SaveOutcome {
  ok: boolean;
  backend?: "indexedDB" | "localStorage";
  id?: string;
  superseded?: boolean;
  message?: string;
}
export interface RestoreOutcome {
  session: SessionState | null;
  notice?: string;
  blocked: boolean;
}
export interface CheckpointFallback {
  current(): unknown | null;
  legacy(): unknown | null;
  write(
    record: import("../../modules/persistence/types.ts").Checkpoint,
  ): boolean;
}
