import {
  readdirSync,
  readFileSync,
  lstatSync,
  copyFileSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  renameSync,
  mkdtempSync,
  constants,
} from "node:fs";
import { join, resolve, relative, isAbsolute, sep } from "node:path";
import { createHash } from "node:crypto";
import {
  releaseTag,
  validAssetPath,
  validateSourceSha,
  validateReleaseManifest,
} from "../../src/modules/publication/release.ts";
import type { ReleaseManifest } from "../../src/modules/publication/release.ts";
export function plainParents(path: string) {
  let p = resolve(path);
  while (true) {
    if (existsSync(p) && lstatSync(p).isSymbolicLink())
      throw Error("Link no caminho do espelho.");
    const next = resolve(p, "..");
    if (next === p) break;
    p = next;
  }
}
export function within(root: string, path: string) {
  const r = relative(resolve(root), resolve(path));
  if (!r || r.startsWith(".." + sep) || r === ".." || isAbsolute(r))
    throw Error("Destino fora da pasta selecionada.");
  return resolve(path);
}
export function inventory(root: string) {
  const files: Record<string, string> = {},
    folded = new Set<string>();
  let total = 0;
  const scan = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort(
      (a, b) => (a.name < b.name ? -1 : 1),
    )) {
      const absolute = join(dir, entry.name),
        path = relative(root, absolute).split(sep).join("/");
      if (entry.isSymbolicLink())
        throw Error("Links não são permitidos nos artefatos.");
      if (entry.isDirectory()) {
        if (entry.name.startsWith("."))
          throw Error("Diretório oculto no artefato.");
        scan(absolute);
        continue;
      }
      if (!entry.isFile() || !validAssetPath(path) || path === "release.json")
        throw Error("Arquivo de artefato não permitido: " + path);
      const lower = path.toLowerCase();
      if (folded.has(lower)) throw Error("Nomes de arquivos colidem.");
      folded.add(lower);
      const bytes = readFileSync(absolute);
      total += bytes.length;
      if (bytes.length > 25 * 1024 * 1024 || total > 50 * 1024 * 1024)
        throw Error("Release excede o orçamento de arquivos.");
      if (
        /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{30,}|\bsk-proj-[A-Za-z0-9_-]{30,}/.test(
          bytes.toString("utf8"),
        )
      )
        throw Error("Padrão de credencial encontrado; publicação bloqueada.");
      files[path] = createHash("sha256").update(bytes).digest("hex");
    }
  };
  if (lstatSync(root).isSymbolicLink())
    throw Error("Raiz do artefato não pode ser link.");
  scan(root);
  if (!files["index.html"]) throw Error("Release sem index.html.");
  return files;
}
export function checkRelease(root: string, expected: ReleaseManifest) {
  plainParents(root);
  validateReleaseManifest(expected);
  const manifest = JSON.parse(
    readFileSync(join(root, "release.json"), "utf8"),
  ) as ReleaseManifest;
  if (JSON.stringify(manifest) !== JSON.stringify(expected))
    throw Error("Esta tag já contém outro manifesto.");
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, e.name),
        p = relative(root, abs).split(sep).join("/");
      if (e.isSymbolicLink()) throw Error("Link em release existente.");
      if (e.isDirectory()) {
        walk(abs);
        continue;
      }
      if (p === "release.json") continue;
      if (
        !Object.hasOwn(expected.files, p) ||
        createHash("sha256").update(readFileSync(abs)).digest("hex") !==
          expected.files[p]
      )
        throw Error("Release existente foi alterada.");
    }
  };
  walk(root);
  for (const p of Object.keys(expected.files))
    if (!existsSync(join(root, p)))
      throw Error("Release existente incompleta.");
}
export function installRelease(
  build: string,
  mirror: string,
  version: string,
  sourceSha: string,
) {
  validateSourceSha(sourceSha);
  const tag = releaseTag(version),
    root = resolve(mirror),
    releases = within(root, join(root, "public", "releases")),
    target = within(root, join(releases, tag));
  plainParents(root);
  const marker = join(root, "mirror.json");
  if (existsSync(root) && readdirSync(root).length && !existsSync(marker))
    throw Error("Pasta existente não é um espelho gerado do Viveiro.");
  mkdirSync(root, { recursive: true });
  if (!existsSync(marker))
    writeFileSync(
      marker,
      JSON.stringify({ format: "viveiro-public-mirror", version: 1 }) + "\n",
      { flag: "wx" },
    );
  const identity = JSON.parse(readFileSync(marker, "utf8"));
  if (identity.format !== "viveiro-public-mirror" || identity.version !== 1)
    throw Error("Espelho desconhecido.");
  const ignore = join(root, ".gitignore");
  if (!existsSync(ignore)) writeFileSync(ignore, ".runtime/\n", { flag: "wx" });
  else {
    const current = readFileSync(ignore, "utf8");
    if (!current.split(/\r?\n/).includes(".runtime/"))
      writeFileSync(ignore, current + "\n.runtime/\n");
  }
  for (const p of [root, join(root, "public"), releases])
    if (existsSync(p) && lstatSync(p).isSymbolicLink())
      throw Error("Espelho não pode conter links nos diretórios de destino.");
  const manifest: ReleaseManifest = {
    format: "viveiro-release",
    version,
    tag,
    sourceSha,
    files: inventory(build),
  };
  validateReleaseManifest(manifest);
  if (existsSync(target)) {
    checkRelease(target, manifest);
    return manifest;
  }
  const runtime = within(root, join(root, ".runtime"));
  plainParents(runtime);
  mkdirSync(runtime, { recursive: true });
  const stage = within(root, mkdtempSync(join(runtime, "release-")));
  for (const file of Object.keys(manifest.files)) {
    const dest = within(stage, join(stage, file));
    mkdirSync(resolve(dest, ".."), { recursive: true });
    copyFileSync(join(build, file), dest, constants.COPYFILE_EXCL);
  }
  writeFileSync(
    join(stage, "release.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    { flag: "wx" },
  );
  mkdirSync(releases, { recursive: true });
  // Both absolute paths are checked inside the explicitly selected mirror; destination is new.
  within(root, stage);
  within(root, target);
  renameSync(stage, target);
  return manifest;
}
