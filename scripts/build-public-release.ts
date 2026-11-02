import {
  readFileSync,
  mkdirSync,
  mkdtempSync,
  existsSync,
  copyFileSync,
} from "node:fs";
import { resolve, join, relative, isAbsolute, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build } from "vite";
import { releaseBase, releaseTag } from "../src/modules/publication/release.ts";
import { installRelease, plainParents } from "./lib/release-files.ts";
import { updateReleaseIndex } from "./lib/release-index.ts";
const checkout = resolve(fileURLToPath(new URL("..", import.meta.url)));
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== "--mirror")
  throw Error(
    "Uso: node scripts/build-public-release.ts --mirror PASTA_ABSOLUTA",
  );
if (!isAbsolute(args[1])) throw Error("O espelho precisa de caminho absoluto.");
const mirror = resolve(args[1]);
plainParents(mirror);
const local = relative(checkout, mirror);
if (
  !isAbsolute(local) &&
  !local.startsWith(".." + sep) &&
  local.split(sep)[0] !== ".runtime"
)
  throw Error("Não crie o espelho dentro da fonte de desenvolvimento.");
const config = join(mirror, ".openai", "hosting.json");
if (
  existsSync(config) &&
  JSON.parse(readFileSync(config, "utf8")).project_id ===
    JSON.parse(readFileSync(join(checkout, ".openai", "hosting.json"), "utf8"))
      .project_id
)
  throw Error("O espelho não pode reutilizar a identidade do Site privado.");
if (mirror === checkout)
  throw Error("O espelho deve ser separado do checkout de desenvolvimento.");
const status = execFileSync(
  "git",
  ["status", "--porcelain", "--untracked-files=normal"],
  { cwd: checkout, encoding: "utf8" },
);
if (status.trim())
  throw Error("Faça commit da fonte revisada antes de gerar uma release.");
const sourceSha = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: checkout,
  encoding: "utf8",
}).trim();
const { version } = JSON.parse(
  readFileSync(join(checkout, "package.json"), "utf8"),
);
const tag = releaseTag(version);
mkdirSync(join(checkout, ".runtime"), { recursive: true });
const output = mkdtempSync(join(checkout, ".runtime", "public-build-"));
await build({
  root: checkout,
  base: releaseBase(version),
  build: { outDir: output, emptyOutDir: false },
});
installRelease(output, mirror, version, sourceSha);
const catalog = updateReleaseIndex(mirror);
copyFileSync(
  join(checkout, "scripts", "mirror-static-build.ts"),
  join(mirror, "build-static.ts"),
);
console.log(
  JSON.stringify({
    mirror,
    tag,
    sourceSha,
    base: releaseBase(version),
    latest: catalog.latest,
    staticDirectory: "dist",
    buildCommand: ["node", "build-static.ts"],
  }),
);
