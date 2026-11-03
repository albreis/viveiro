import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "@babel/parser";
interface Candidate {
  file: string;
  line: number;
  kind: string;
  preview: string;
}
const found: Candidate[] = [],
  files: string[] = [];
const roots = [
  "src/app",
  "src/services",
  "src/modules/renderer",
  "src/modules/biology",
  "src/modules/lessons",
];
function scan(folder: string) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.(ts|js)$/.test(file)) files.push(file);
  }
}
const human = (s: string) =>
  /[À-ÿ]/.test(s) || /\b[A-Za-z]{2,}\s+[A-Za-z]{2,}\b/.test(s);
function candidate(file: string, line: number, kind: string, text: string) {
  const visible = text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (human(visible))
    found.push({
      file: file.replaceAll("\\", "/"),
      line,
      kind,
      preview: visible.slice(0, 140),
    });
}
for (const root of roots) scan(root);
for (const file of files) {
  const source = readFileSync(file, "utf8");
  const ast = parse(source, { sourceType: "module", plugins: ["typescript"] });
  function visit(value: unknown): void {
    if (Array.isArray(value)) {
      for (const child of value) visit(child);
      return;
    }
    if (!value || typeof value !== "object") return;
    const node = value as Record<string, any>;
    if (node.type === "StringLiteral")
      candidate(file, node.loc.start.line, "string", node.value);
    if (node.type === "TemplateLiteral")
      candidate(
        file,
        node.loc.start.line,
        "template",
        node.quasis
          .map(
            (q: any, i: number) =>
              (q.value.cooked ?? q.value.raw) +
              (i < node.expressions.length ? "{value" + i + "}" : ""),
          )
          .join(""),
      );
    for (const [key, child] of Object.entries(node))
      if (
        ![
          "loc",
          "start",
          "end",
          "comments",
          "leadingComments",
          "trailingComments",
          "innerComments",
          "extra",
        ].includes(key)
      )
        visit(child);
  }
  visit(ast);
}
for (const file of [
  "index.html",
  "experimentos.html",
  "public/licencas.html",
]) {
  const source = readFileSync(file, "utf8"),
    masked = source.replace(/<(script|style|code|pre)\b[\s\S]*?<\/\1>/gi, (m) =>
      m.replace(/[^\r\n]/g, " "),
    );
  for (const match of masked.matchAll(/>([^<>]+)</g))
    candidate(
      file,
      masked.slice(0, match.index! + 1).split(/\r?\n/).length,
      "html-text",
      match[1],
    );
  for (const match of masked.matchAll(
    /(?:aria-label|title|placeholder)\s*=\s*(["'])(.*?)\1/g,
  ))
    candidate(
      file,
      masked.slice(0, match.index!).split(/\r?\n/).length,
      "html-attribute",
      match[2],
    );
}
const counts = new Map<string, number>();
for (const item of found)
  counts.set(item.file, (counts.get(item.file) ?? 0) + 1);
if (process.argv.includes("--json"))
  process.stdout.write(
    JSON.stringify(
      {
        schema: "viveiro-i18n-inventory-v1",
        heuristic: true,
        candidates: found,
      },
      null,
      2,
    ) + "\n",
  );
else {
  process.stdout.write(
    "Heuristic inventory; review candidates. Counts do not prove translation coverage.\n",
  );
  for (const [file, count] of [...counts].sort(([a], [b]) =>
    a.localeCompare(b),
  ))
    process.stdout.write(count + "\t" + file + "\n");
  process.stdout.write(
    "Total: " + found.length + " candidates in " + counts.size + " files.\n",
  );
}
