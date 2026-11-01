import { compactSession, expandSession } from "./compact.ts";
import { normalizeSession, assertDataTree } from "./validation.ts";
import type { Checkpoint, SessionState } from "./types.ts";
/** CRC detects accidental corruption; it is not authentication or encryption. */
export function checksum(text: string) {
  let crc = 0xffffffff;
  for (const byte of new TextEncoder().encode(text)) {
    crc ^= byte;
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}
export function createCheckpoint(
  session: SessionState,
  meta: {
    id: string;
    sequence: number;
    createdAt: number;
    kind: "auto" | "manual";
    label: string;
  },
): Checkpoint {
  const payload = compactSession(normalizeSession(session));
  const record = {
    format: "viveiro-checkpoint" as const,
    version: 2 as const,
    ...meta,
    label: meta.label.slice(0, 80),
    payload,
  };
  return { ...record, checksum: checksum(JSON.stringify(record)) };
}
export function decodeCheckpoint(value: unknown): SessionState {
  assertDataTree(value);
  if (!value || typeof value !== "object")
    throw new Error("Checkpoint inválido.");
  const record = value as Checkpoint;
  if (
    record.format !== "viveiro-checkpoint" ||
    record.version !== 2 ||
    typeof record.id !== "string" ||
    !record.id.length ||
    record.id.length > 150 ||
    typeof record.label !== "string" ||
    record.label.length > 80 ||
    record.sequence < 0 ||
    record.createdAt < 0 ||
    !Number.isSafeInteger(record.sequence) ||
    !Number.isSafeInteger(record.createdAt) ||
    !["auto", "manual"].includes(record.kind)
  )
    throw new Error("Versão ou metadados de checkpoint inválidos.");
  const { checksum: expected, ...body } = record;
  if (
    typeof expected !== "string" ||
    checksum(JSON.stringify(body)) !== expected
  )
    throw new Error("O checkpoint está incompleto ou foi alterado.");
  return normalizeSession(expandSession(record.payload));
}
export function parseExperiment(text: string): SessionState {
  if (new TextEncoder().encode(text).length > 20000000)
    throw new Error("Arquivo maior que 20 MB.");
  const value = JSON.parse(text);
  return value?.format === "viveiro-checkpoint"
    ? decodeCheckpoint(value)
    : normalizeSession(value);
}
