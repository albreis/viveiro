import { normalizeSession } from "../../modules/persistence/validation.ts";
import type {
  Checkpoint,
  CheckpointDriver,
  SessionState,
} from "../../modules/persistence/types.ts";
import {
  createCheckpoint,
  decodeCheckpoint,
  checksum,
} from "../../modules/persistence/codec.ts";
import { compactSession } from "../../modules/persistence/compact.ts";
import { SerialCheckpointQueue } from "./serial-queue.ts";
import { recoverSession } from "./recovery.ts";
import type { SaveOutcome, CheckpointFallback } from "./results.ts";
export class CheckpointStore {
  private driver: CheckpointDriver;
  private fallback: CheckpointFallback;
  private clock: () => number;
  private unique: () => string;
  private queue: SerialCheckpointQueue;
  private sequence = 0;
  private timestamp = 0;
  private blocked = false;
  private lastHash = "";
  private lastResult: SaveOutcome = { ok: false };
  constructor(
    driver: CheckpointDriver,
    fallback: CheckpointFallback,
    clock: () => number = Date.now,
    unique: () => string = () => crypto.randomUUID(),
  ) {
    this.driver = driver;
    this.fallback = fallback;
    this.clock = clock;
    this.unique = unique;
    this.queue = new SerialCheckpointQueue((record) => this.persist(record));
  }
  async load() {
    const result = await recoverSession(this.driver, this.fallback);
    this.blocked = result.blocked;
    if (result.record) {
      this.sequence = result.record.sequence;
      this.timestamp = result.record.createdAt;
    }
    return result;
  }
  protectWrites() {
    this.blocked = true;
  }
  isProtected() {
    return this.blocked;
  }
  allowWrites() {
    this.blocked = false;
  }
  async save(
    session: SessionState,
    label = "",
    kind: "auto" | "manual" = "auto",
  ): Promise<SaveOutcome> {
    if (this.blocked)
      return {
        ok: false,
        message:
          "A gravação está protegida até recuperar ou iniciar um experimento.",
      };
    let record: Checkpoint;
    try {
      const hash = checksum(
        JSON.stringify(compactSession(normalizeSession(session))),
      );
      if (
        kind === "auto" &&
        hash === this.lastHash &&
        this.lastResult.backend === "indexedDB"
      )
        return this.lastResult;
      this.timestamp = Math.max(Math.floor(this.clock()), this.timestamp + 1);
      this.sequence++;
      record = createCheckpoint(session, {
        id: kind + "-" + this.unique(),
        createdAt: this.timestamp,
        sequence: this.sequence,
        kind,
        label: label || "Salvamento automático",
      });
    } catch {
      return { ok: false, message: "O estado não é válido para gravação." };
    }
    return this.queue.enqueue(record);
  }
  private async persist(record: Checkpoint): Promise<SaveOutcome> {
    const hash = checksum(JSON.stringify(record.payload));
    let result: SaveOutcome;
    try {
      const accepted = await this.driver.write(record);
      if (!accepted)
        return {
          ok: false,
          message:
            "Outra aba já gravou um registro mais recente. Recarregue antes de continuar.",
        };
      try {
        this.fallback.write(record);
      } catch {}
      result = { ok: true, backend: "indexedDB", id: record.id };
    } catch {
      try {
        if (!this.fallback.write(record))
          throw new Error("Registro mais recente.");
        result = {
          ok: true,
          backend: "localStorage",
          id: record.id,
          message:
            "Salvo no backup local; checkpoints do banco temporariamente indisponíveis.",
        };
      } catch {
        result = {
          ok: false,
          message: "Não foi possível salvar. Exporte o experimento em JSON.",
        };
      }
    }
    if (result.ok) {
      this.lastHash = hash;
      this.lastResult = result;
    }
    return result;
  }
  async list() {
    return this.driver.list();
  }
  async restore(id: string) {
    const record = await this.driver.read(id);
    if (!record) throw new Error("Checkpoint não encontrado.");
    return decodeCheckpoint(record);
  }
  async flush() {
    await this.queue.flush();
  }
  emergency(session: SessionState) {
    if (this.blocked) return false;
    try {
      this.timestamp = Math.max(Math.floor(this.clock()), this.timestamp + 1);
      return this.fallback.write(
        createCheckpoint(session, {
          id: "emergency-" + this.unique(),
          sequence: ++this.sequence,
          createdAt: this.timestamp,
          kind: "auto",
          label: "Cópia de fechamento",
        }),
      );
    } catch {
      return false;
    }
  }
}
