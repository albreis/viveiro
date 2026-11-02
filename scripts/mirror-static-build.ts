import {
  readFileSync,
  readdirSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
  existsSync,
  lstatSync,
  realpathSync,
} from "node:fs";
import { resolve, join, relative, sep, isAbsolute } from "node:path";
const root = realpathSync(process.cwd());
const marker = JSON.parse(readFileSync(join(root, "mirror.json"), "utf8"));
if (marker.format !== "viveiro-public-mirror" || marker.version !== 1)
  throw Error("Este comando só prepara o espelho gerado do Viveiro.");
const input = join(root, "public"),
  output = join(root, "dist");
function files(dir: string, base = dir): string[] {
  if (lstatSync(dir).isSymbolicLink())
    throw Error("Links não são permitidos na preparação estática.");
  const result: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isSymbolicLink()) throw Error("Link em artefato.");
    if (e.isDirectory()) result.push(...files(full, base));
    else if (e.isFile()) result.push(relative(base, full));
    else throw Error("Tipo de arquivo não suportado.");
  }
  return result.sort();
}
const source = files(input),
  expected = new Set(source);
if (!expected.has("index.html")) throw Error("Espelho sem página inicial.");
if (existsSync(output) && files(output).some((p) => !expected.has(p)))
  throw Error(
    "Há arquivos desconhecidos no build anterior; nada foi removido.",
  );
for (const file of source) {
  const dest = resolve(output, file),
    rel = relative(root, dest);
  if (isAbsolute(rel) || rel === ".." || rel.startsWith(".." + sep))
    throw Error("Destino fora do espelho.");
  mkdirSync(resolve(dest, ".."), { recursive: true });
  copyFileSync(join(input, file), dest);
}
console.log(
  JSON.stringify({ staticDirectory: "dist", copiedFiles: source.length }),
);
