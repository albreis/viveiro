import type { Checkpoint } from "../../modules/persistence/types.ts";
import type { CheckpointFallback } from "./results.ts";
interface StorageAccess {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
const CURRENT = "viveiro-v2-fallback",
  LEGACY = "viveiro-v1",
  UNREADABLE = "viveiro-v2-unreadable";
export class LocalCheckpointFallback implements CheckpointFallback {
  private access: () => StorageAccess;
  constructor(access: () => StorageAccess = () => localStorage) {
    this.access = access;
  }
  current() {
    const raw = this.access().getItem(CURRENT);
    return raw ? JSON.parse(raw) : null;
  }
  legacy() {
    const raw = this.access().getItem(LEGACY);
    return raw ? JSON.parse(raw) : null;
  }
  write(record: Checkpoint) {
    const storage = this.access(),
      previous = storage.getItem(CURRENT);
    if (previous) {
      try {
        const old = JSON.parse(previous) as Partial<Checkpoint>;
        if ((old.createdAt ?? 0) > record.createdAt) return false;
      } catch {
        if (!storage.getItem(UNREADABLE)) storage.setItem(UNREADABLE, previous);
      }
    }
    storage.setItem(CURRENT, JSON.stringify(record));
    return true;
  }
}
