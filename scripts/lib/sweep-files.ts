import {
  readFileSync,
  writeFileSync,
  lstatSync,
  existsSync,
  linkSync,
  unlinkSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { plainParents } from "./release-files.ts";
export function readSweepFile(path: string, max = 512 * 1024): string {
  plainParents(path);
  const s = lstatSync(path);
  if (!s.isFile() || s.size > max)
    throw Error("Arquivo de varredura inválido ou grande demais.");
  return readFileSync(path, "utf8");
}
/** Publish a complete file atomically; an existing different result is never replaced. */
export function immutableSweepFile(path: string, text: string): void {
  plainParents(path);
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== text)
      throw Error("Arquivo existente difere: " + path);
    return;
  }
  const temp = join(dirname(path), ".write-" + randomUUID());
  try {
    writeFileSync(temp, text, { flag: "wx", flush: true });
    linkSync(temp, path);
  } finally {
    if (existsSync(temp)) unlinkSync(temp);
  }
}
export function sweepLease(folder: string): () => void {
  const path = join(folder, ".sweep.lock"),
    content = JSON.stringify({ pid: process.pid, token: randomUUID() });
  plainParents(path);
  try {
    writeFileSync(path, content, { flag: "wx", flush: true });
  } catch {
    throw Error(
      "Varredura bloqueada por .sweep.lock. Confira outro executor antes de remover um bloqueio abandonado.",
    );
  }
  return () => {
    if (readSweepFile(path, 2048) !== content)
      throw Error("Bloqueio mudou; preservado.");
    unlinkSync(path);
  };
}

export function readSweepJson(path: string, max = 65536): unknown {
  return JSON.parse(readSweepFile(path, max).replace(/^\uFEFF/, ""));
}
