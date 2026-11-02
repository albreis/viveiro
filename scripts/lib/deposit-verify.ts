import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

/** Verify the stored (git archive -0) ZIP against our own manifest, before upload. */
export function verifyDepositZip(
  archive: Buffer,
  prefix: string,
  expected: Record<string, string>,
) {
  let end = archive.length - 22;
  while (
    end >= Math.max(0, archive.length - 65557) &&
    archive.readUInt32LE(end) !== 0x06054b50
  )
    end--;
  if (end < 0 || archive.readUInt32LE(end) !== 0x06054b50)
    throw Error("ZIP sem diretório.");
  const count = archive.readUInt16LE(end + 10);
  let offset = archive.readUInt32LE(end + 16);
  const actual = new Set<string>();
  for (let i = 0; i < count; i++) {
    if (archive.readUInt32LE(offset) !== 0x02014b50)
      throw Error("Diretório ZIP inválido.");
    const method = archive.readUInt16LE(offset + 10);
    const flags = archive.readUInt16LE(offset + 8);
    const size = archive.readUInt32LE(offset + 24);
    const nameLength = archive.readUInt16LE(offset + 28);
    const name = archive
      .subarray(offset + 46, offset + 46 + nameLength)
      .toString("utf8");
    const local = archive.readUInt32LE(offset + 42);
    offset +=
      46 +
      nameLength +
      archive.readUInt16LE(offset + 30) +
      archive.readUInt16LE(offset + 32);
    if (!name.startsWith(prefix) || flags & 1 || method !== 0)
      throw Error("Entrada ZIP inesperada: " + name);
    if (name.endsWith("/")) continue;
    const path = name.slice(prefix.length);
    if (!expected[path] || actual.has(path))
      throw Error("Arquivo extra ou duplicado: " + path);
    if (archive.readUInt32LE(local) !== 0x04034b50)
      throw Error("Cabeçalho ZIP inválido.");
    const data =
      local +
      30 +
      archive.readUInt16LE(local + 26) +
      archive.readUInt16LE(local + 28);
    const hash = createHash("sha256")
      .update(archive.subarray(data, data + size))
      .digest("hex");
    if (hash !== expected[path])
      throw Error("Bytes do pacote divergem: " + path);
    actual.add(path);
  }
  if (actual.size !== Object.keys(expected).length)
    throw Error("Pacote incompleto.");
  return actual.size;
}

export function verifyDepositFile(
  output: string,
  prefix: string,
  files: Record<string, string>,
  manifest: string,
) {
  const expected = {
    ...files,
    "source-manifest.json": createHash("sha256")
      .update(readFileSync(manifest))
      .digest("hex"),
  };
  return verifyDepositZip(readFileSync(output), prefix, expected);
}
