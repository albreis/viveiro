import type {
  Checkpoint,
  CheckpointDriver,
  SessionState,
} from "../../modules/persistence/types.ts";
import { decodeCheckpoint } from "../../modules/persistence/codec.ts";
import { normalizeSession } from "../../modules/persistence/validation.ts";
import type { CheckpointFallback, RestoreOutcome } from "./results.ts";
export async function recoverSession(
  driver: CheckpointDriver,
  fallback: CheckpointFallback,
): Promise<RestoreOutcome & { record?: Checkpoint }> {
  const candidates: { value: unknown; source: string }[] = [];
  let damaged = false;
  try {
    const current = await driver.current();
    if (current) candidates.push({ value: current, source: "indexedDB" });
  } catch {}
  try {
    const current = fallback.current();
    if (current) candidates.push({ value: current, source: "localStorage" });
  } catch (error) {
    if (error instanceof SyntaxError) damaged = true;
  }
  const valid: { record: Checkpoint; session: SessionState; source: string }[] =
    [];
  for (const c of candidates)
    try {
      valid.push({
        record: c.value as Checkpoint,
        session: decodeCheckpoint(c.value),
        source: c.source,
      });
    } catch {
      damaged = true;
    }
  valid.sort(
    (a, b) =>
      b.record.createdAt - a.record.createdAt ||
      b.record.sequence - a.record.sequence,
  );
  if (valid.length)
    return {
      session: valid[0].session,
      record: valid[0].record,
      blocked: false,
      notice: damaged
        ? "O último registro disponível foi recuperado."
        : undefined,
    };
  try {
    const list = await driver.list();
    if (list.length) damaged = true;
    for (const item of list.slice(0, 32)) {
      const record = await driver.read(item.id);
      if (!record) continue;
      try {
        return {
          session: decodeCheckpoint(record),
          record,
          blocked: false,
          notice:
            "Um checkpoint anterior foi recuperado; o registro atual não estava disponível.",
        };
      } catch {
        damaged = true;
      }
    }
  } catch {}
  let legacyFound = false;
  try {
    const legacy = fallback.legacy();
    legacyFound = !!legacy;
    if (legacy)
      return {
        session: normalizeSession(legacy),
        blocked: false,
        notice:
          "Save anterior carregado. O original será preservado na migração.",
      };
  } catch (error) {
    if (legacyFound || error instanceof SyntaxError) damaged = true;
  }
  return {
    session: null,
    blocked: damaged,
    notice: damaged
      ? "Não foi possível recuperar um registro válido. A gravação automática ficou protegida; importe um experimento ou crie outro terrário."
      : undefined,
  };
}
