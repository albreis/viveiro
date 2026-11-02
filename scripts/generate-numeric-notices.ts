import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { createRequire } from "node:module";
interface Dependency {
  name: string;
  version: string;
  folder: string;
  license: string;
}
const root = process.cwd(),
  packages = new Map<string, Dependency>();
function visit(path: string) {
  const p = JSON.parse(readFileSync(path, "utf8")),
    id = p.name + "@" + p.version;
  if (packages.has(id)) return;
  const permitted =
    (/^@stdlib\/[a-z0-9-]+$/.test(p.name) && p.license === "Apache-2.0") ||
    ([
      "debug",
      "ms",
      "resolve",
      "es-errors",
      "is-core-module",
      "hasown",
      "function-bind",
      "path-parse",
      "supports-preserve-symlinks-flag",
    ].includes(p.name) &&
      p.license === "MIT");
  if (!permitted) throw Error("Revisar licença numérica: " + p.name);
  packages.set(id, {
    name: p.name,
    version: p.version,
    folder: dirname(path),
    license: p.license,
  });
  const require = createRequire(path);
  for (const dep of Object.keys(p.dependencies ?? {}))
    visit(require.resolve(dep + "/package.json"));
}
const require = createRequire(join(root, "package.json"));
const project = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const dep of Object.keys(project.dependencies).filter((n) =>
  n.startsWith("@stdlib/"),
))
  visit(require.resolve(dep + "/package.json"));
function license(folder: string) {
  const name = readdirSync(folder).find((n) =>
    /^licen[sc]e(?:\.(?:txt|md))?$/i.test(n),
  );
  if (!name) throw Error("Texto de licença ausente.");
  return readFileSync(join(folder, name), "utf8");
}
const output = join(root, "public/notices/stdlib");
mkdirSync(output, { recursive: true });
writeFileSync(
  join(root, "public/notices/apache-2.0.txt"),
  license(
    [...packages.values()].find((p) => p.license === "Apache-2.0")!.folder,
  ),
);
function headers(folder: string, all: Set<string>) {
  if (!existsSync(folder)) return;
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name);
    if (entry.isDirectory()) headers(file, all);
    else if (entry.name.endsWith(".js")) {
      const header = /^\s*(\/\*\*[\s\S]*?\*\/)/.exec(
        readFileSync(file, "utf8"),
      )?.[1];
      if (header?.includes("@license")) all.add(header);
    }
  }
}
const index = [
  "Stdlib numerical dependencies and transitive notices",
  "Apache-2.0 full text: apache-2.0.txt; MIT text included in applicable package files.",
  "Generated from locked installed dependencies by scripts/generate-numeric-notices.ts",
  "Source: https://github.com/stdlib-js/stdlib",
  "",
];
let maximumLines = 0;
const sorted = [...packages.values()].sort((a, b) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
);
for (const p of sorted) {
  const notices = new Set<string>();
  headers(join(p.folder, "lib"), notices);
  const notice = existsSync(join(p.folder, "NOTICE"))
    ? readFileSync(join(p.folder, "NOTICE"), "utf8")
    : "";
  const ownLicense =
    p.license === "MIT" ? license(p.folder) : "Apache-2.0: ../apache-2.0.txt";
  const text =
    [p.name + "@" + p.version, ownLicense, notice, ...notices].join("\n\n") +
    "\n";
  const file = p.name.replace(/^@stdlib\//, "") + "-" + p.version + ".txt";
  writeFileSync(join(output, file), text);
  index.push(p.name + "@" + p.version + " -> stdlib/" + file);
  maximumLines = Math.max(maximumLines, text.split("\n").length);
}
writeFileSync(
  join(root, "public/notices/stdlib-index.txt"),
  index.join("\n") + "\n",
);
console.log(
  JSON.stringify({ packages: packages.size, maximumNoticeLines: maximumLines }),
);
