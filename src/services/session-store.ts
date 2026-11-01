import { CheckpointStore } from "./checkpoints/store.ts";
import { IndexedCheckpointDriver } from "./checkpoints/indexed-driver.ts";
import { LocalCheckpointFallback } from "./checkpoints/local-fallback.ts";
import { normalizeSession } from "../modules/persistence/validation.ts";
export const checkpointStore = new CheckpointStore(
  new IndexedCheckpointDriver(),
  new LocalCheckpointFallback(),
);
let notice: string | undefined;
export async function readState() {
  const result = await checkpointStore.load();
  notice = result.notice;
  return result.session;
}
export async function writeState(value: unknown) {
  try {
    return await checkpointStore.save(normalizeSession(value));
  } catch {
    return {
      ok: false,
      message: "Não foi possível validar o estado para salvar.",
    };
  }
}
export const storageNotice = () => notice;
export function protectWrites(message: string) {
  notice = message;
  checkpointStore.protectWrites();
}
export function emergencyState(value: unknown) {
  try {
    return checkpointStore.emergency(normalizeSession(value));
  } catch {
    return false;
  }
}
