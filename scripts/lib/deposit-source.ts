import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { verifyDepositFile } from "./deposit-verify.ts";
import { join, resolve } from "node:path";
import { plainParents } from "./release-files.ts";
import {
  sourceFiles,
  excludedOperationalTests,
  sourceRoots,
  permittedSourcePath,
  checkDepositBytes,
  citationMetadata,
  checkDepositMetadata,
} from "../../src/modules/publication/deposit.ts";

export function gitBytes(root: string, args: string[], input?: string) {
  return execFileSync("git", args, {
    cwd: root,
    input,
    maxBuffer: 50 * 1024 * 1024,
    windowsHide: true,
  });
}
const sha256 = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");

export function prepareDeposit(root: string, outputRoot: string) {
  plainParents(outputRoot);
  mkdirSync(outputRoot, { recursive: true });
  const folder = mkdtempSync(join(resolve(outputRoot), "deposit-"));
  plainParents(join(root, "CITATION.cff"));
  plainParents(join(root, ".zenodo.json"));
  const citationBytes = Buffer.from(
    readFileSync(join(root, "CITATION.cff"), "utf8").replace(/\r\n/g, "\n"),
  );
  const zenodoBytes = Buffer.from(
    readFileSync(join(root, ".zenodo.json"), "utf8").replace(/\r\n/g, "\n"),
  );
  const c = citationMetadata(JSON.parse(citationBytes.toString()));
  checkDepositMetadata(c, JSON.parse(zenodoBytes.toString()));
  const tag = "v" + c.version;
  const sha = gitBytes(root, ["rev-parse", tag + "^{commit}"])
    .toString()
    .trim();
  if (sha !== c.commit)
    throw Error("A tag não corresponde à fonte da citação.");
  const packageVersion = JSON.parse(
    gitBytes(root, ["show", sha + ":package.json"]).toString(),
  ).version;
  const lock = JSON.parse(
    gitBytes(root, ["show", sha + ":package-lock.json"]).toString(),
  );
  if (
    packageVersion !== c.version ||
    lock.version !== c.version ||
    lock.packages[""].version !== c.version
  )
    throw Error("Versão da fonte e citação divergem.");
  const files: Record<string, string> = {};
  const entries = gitBytes(root, ["ls-tree", "-rz", sha])
    .toString()
    .split("\0")
    .filter(Boolean);
  const selected: { path: string; object: string }[] = [];
  for (const entry of entries) {
    const tab = entry.indexOf("\t");
    const [mode, type, object] = entry.slice(0, tab).split(" ");
    const path = entry.slice(tab + 1);
    if (excludedOperationalTests.includes(path)) continue;
    if (!permittedSourcePath(path)) {
      if (sourceRoots.includes(path.split("/")[0]))
        throw Error("Arquivo não permitido dentro da fonte: " + path);
      continue;
    }
    if ((mode !== "100644" && mode !== "100755") || type !== "blob")
      throw Error("Somente arquivos regulares são permitidos: " + path);
    selected.push({ path, object });
  }
  const batch = gitBytes(
    root,
    ["cat-file", "--batch"],
    selected.map((entry) => entry.object).join("\n") + "\n",
  );
  let cursor = 0;
  for (const { path, object } of selected) {
    const newline = batch.indexOf(10, cursor);
    const [actual, type, sizeText] = batch
      .subarray(cursor, newline)
      .toString()
      .split(" ");
    const size = Number(sizeText);
    if (
      actual !== object ||
      type !== "blob" ||
      !Number.isSafeInteger(size) ||
      size < 0
    )
      throw Error("Objeto Git inesperado.");
    const bytes = batch.subarray(newline + 1, newline + 1 + size);
    if (bytes.length !== size) throw Error("Objeto Git incompleto.");
    cursor = newline + 1 + size + 1;
    checkDepositBytes(bytes);
    files[path] = sha256(bytes);
  }
  if (!files["src/main.ts"] || !files["public/THREE-LICENSE.txt"])
    throw Error("Fonte incompleta ou licença de terceiros ausente.");
  const readme = [
    "# Viveiro " + c.version,
    "",
    "Simulador exploratório; não calibrado por espécie.",
    "Modelo: " + tag + ", commit " + sha + ".",
    "Aplicação publicada: " + c.url,
    "",
    "Requer Node.js 24. Instale com npm ci; valide com npm test e npm run build.",
    "Use npm run dev para abrir a aplicação local; a porta padrão é 4173.",
    "Scripts de hospedagem precisam de configuração local própria, excluída deste pacote.",
    "",
    "O modelo vem da tag. Este README, CITATION.cff, .zenodo.json e o manifesto",
    "foram preparados posteriormente e não alteram a tag original.",
    "Não contém histórico Git, saves, documentos operacionais ou credenciais.",
    "Testes de publicação/depósito e suas fixtures locais ficam no repositório;",
    "os testes do modelo estão incluídos. Exclusões explícitas no manifesto.",
    "Código original MIT; documentação original CC BY 4.0; avisos de terceiros preservados.",
    "Consulte LICENSE, LICENSE-DOCS.md e public/THREE-LICENSE.txt.",
    "",
    "O arquivo .zenodo.json é um rascunho. Não há DOI emitido por este pacote.",
    "",
  ].join("\n");
  const additions: Record<string, Uint8Array> = {
    "README.md": Buffer.from(readme),
    "CITATION.cff": citationBytes,
    ".zenodo.json": zenodoBytes,
  };
  for (const [path, bytes] of Object.entries(additions)) {
    checkDepositBytes(bytes);
    files[path] = sha256(bytes);
    writeFileSync(join(folder, path), bytes, { flag: "wx" });
  }
  const manifest = {
    schemaVersion: 1,
    tag,
    version: c.version,
    sourceSha: sha,
    excludedOperationalTests,
    sourceSelection: [...sourceRoots.map((path) => path + "/"), ...sourceFiles],
    metadataAddedAfterTag: Object.keys(additions),
    files,
  };
  writeFileSync(
    join(folder, "source-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    { flag: "wx" },
  );
  return { folder, manifest };
}

export function archiveDeposit(
  root: string,
  folder: string,
  manifest: {
    tag: string;
    version: string;
    sourceSha: string;
    files: Record<string, string>;
  },
) {
  const output = join(folder, "viveiro-" + manifest.tag + "-source.zip");
  const timestamp = gitBytes(root, [
    "show",
    "-s",
    "--format=%cI",
    manifest.sourceSha,
  ])
    .toString()
    .trim();
  gitBytes(root, [
    "-c",
    "core.autocrlf=false",
    "-c",
    "core.eol=lf",
    "archive",
    "--format=zip",
    "-0",
    "--mtime=" + timestamp,
    "--prefix=viveiro-" + manifest.tag + "/",
    "--output=" + output,
    ...[
      "README.md",
      "CITATION.cff",
      ".zenodo.json",
      "source-manifest.json",
    ].map((file) => "--add-file=" + join(folder, file)),
    manifest.sourceSha,
    ...sourceRoots,
    ...sourceFiles,
    ...excludedOperationalTests.map((path) => ":(exclude)" + path),
  ]);
  verifyDepositFile(
    output,
    "viveiro-" + manifest.tag + "/",
    manifest.files,
    join(folder, "source-manifest.json"),
  );
  return { output, sha256: sha256(readFileSync(output)) };
}
