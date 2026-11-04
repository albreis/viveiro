import { readFileSync } from "node:fs";
import { resolve, posix } from "node:path";
import type {
  RoadmapData,
  RoadmapGroup,
  RoadmapItem,
  RoadmapView,
} from "../../src/modules/roadmap/types.ts";
const repository = "https://github.com/albreis/viveiro/blob/main/";
export const roadmapDocuments = [
  "docs/cronograma.md",
  "docs/planejamento/tecnico.md",
  "docs/planejamento/voce-sozinho.md",
  "docs/planejamento/com-terceiros.md",
  "docs/planejamento/ux-interface.md",
  "docs/planejamento/buhl.md",
  "docs/planejamento/dados-opcionais.md",
  "docs/planejamento/entregas-concluidas.md",
];
export const plainRoadmapText = (value: string) =>
  value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
function safeLink(value: string, source: string): string | undefined {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("//")) return;
  const path = posix.normalize(posix.join(posix.dirname(source), value));
  return path.startsWith("../") ? undefined : repository + path;
}
function item(
  id: string,
  text: string,
  source: string,
  done = false,
  detail = "",
  optional = false,
): RoadmapItem {
  const links = Array.from(
    (text + " " + detail).matchAll(/\[([^\]]+)\]\(([^)]+)\)/g),
  ).flatMap((match) => {
    const url = safeLink(match[2], source);
    return url ? [{ label: plainRoadmapText(match[1]), url }] : [];
  });
  const full = plainRoadmapText(text);
  const split = full.indexOf(": ");
  return {
    id,
    title: split > 0 && split < 100 ? full.slice(0, split) : full,
    detail: plainRoadmapText(
      [split > 0 && split < 100 ? full.slice(split + 2) : "", detail].join(" "),
    ),
    done,
    optional,
    links,
  };
}
function sections(
  markdown: string,
  level: number,
): { title: string; body: string }[] {
  const pattern = new RegExp("^" + "#".repeat(level) + " (.+)$", "gm");
  const matches = Array.from(markdown.matchAll(pattern));
  return matches.map((match, index) => ({
    title: match[1],
    body: markdown.slice(
      match.index! + match[0].length,
      matches[index + 1]?.index,
    ),
  }));
}
function checks(body: string): { text: string; done: boolean }[] {
  const result: { text: string; done: boolean }[] = [];
  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^- \[([ x])\] (.*)/);
    if (match) result.push({ text: match[2], done: match[1] === "x" });
    else if (/^  \S/.test(line) && result.length)
      result.at(-1)!.text += " " + line.trim();
  }
  return result;
}
function rows(body: string): string[][] {
  return body
    .split(/\r?\n/)
    .filter((line) => line.startsWith("|"))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
    .filter((row) => !row.every((cell) => /^[-: ]+$/.test(cell)))
    .slice(1);
}
export function readRoadmap(root: string): RoadmapData {
  const read = (path: string) => readFileSync(resolve(root, path), "utf8");
  const groups: RoadmapGroup[] = [];
  const add = (
    id: string,
    title: string,
    view: RoadmapView,
    source: string,
    items: RoadmapItem[],
    started = false,
  ) => {
    if (items.length)
      groups.push({
        id,
        title,
        view,
        source: repository + source,
        items,
        started,
      });
  };
  const main = read(roadmapDocuments[0]);
  const accepts = sections(main, 2).find(
    (s) => s.title === "Aceites que continuam abertos",
  );
  add(
    "acceptance",
    "Aceites que continuam abertos",
    "overview",
    roadmapDocuments[0],
    rows(accepts?.body ?? "").map((r, i) =>
      item(
        "acceptance-" + i,
        r[0] + " · " + r[1],
        roadmapDocuments[0],
        false,
        r[2],
      ),
    ),
  );
  for (const [view, source] of [
    ["technical", roadmapDocuments[1]],
    ["personal", roadmapDocuments[2]],
  ] as const) {
    for (const [index, section] of sections(read(source), 2).entries()) {
      const id = view + "-" + index;
      add(
        id,
        section.title,
        view,
        source,
        checks(section.body).map((c, i) =>
          item(id + "-" + i, c.text, source, c.done),
        ),
      );
    }
  }
  const external = roadmapDocuments[3];
  add(
    "external",
    "Participação e dependências externas",
    "external",
    external,
    rows(read(external)).map((r, i) =>
      item(
        "external-" + i,
        r[0] + " · " + r[1],
        external,
        false,
        r[2],
        /opcional/i.test(r[0]),
      ),
    ),
  );
  const ux = roadmapDocuments[4];
  for (const [index, section] of sections(read(ux), 2).entries()) {
    if (!section.title.startsWith("Fase")) continue;
    add(
      "ux-" + index,
      section.title,
      "ux",
      ux,
      rows(section.body).map((r) =>
        item(r[0], r[0] + " · " + r[1], ux, r[3] === "Entregue", r[2]),
      ),
    );
  }
  const buhl = roadmapDocuments[5];
  const steps = sections(read(buhl), 2).find(
    (s) => s.title === "Ordem técnica de retomada",
  );
  add(
    "buhl",
    "Buhl / P3 — iniciado, sem aceite científico",
    "buhl",
    buhl,
    checks(steps?.body ?? "").map((c, i) =>
      item("buhl-" + i, c.text, buhl, c.done),
    ),
    true,
  );
  const optional = roadmapDocuments[6];
  add(
    "optional",
    "Dados adicionais — incremento opcional",
    "optional",
    optional,
    sections(read(optional), 3)
      .filter((s) => /^OP-\d/.test(s.title))
      .map((s) => {
        const body = s.body.replace(/^- \[ \] /gm, "").replace(/^- /gm, "");
        return item(s.title.slice(0, 5), s.title, optional, false, body, true);
      }),
  );
  const completed = roadmapDocuments[7];
  add(
    "done",
    "Entregas registradas",
    "done",
    completed,
    rows(read(completed)).map((r, i) =>
      item("done-" + i, r[0] + " · " + r[1], completed, true),
    ),
  );
  add(
    "verified",
    "Verificações recentes",
    "done",
    roadmapDocuments[0],
    checks(main)
      .filter((c) => c.done && /P0.4:|P1.6B2-/.test(c.text))
      .map((c, i) =>
        item(
          "verified-" + i,
          c.text.replace(":", " ·"),
          roadmapDocuments[0],
          true,
        ),
      ),
  );
  if (!groups.length || groups.some((group) => !group.items.length))
    throw Error("Empty roadmap");
  return {
    updated: main.match(/Atualizado em ([\d/]+)/)?.[1] ?? "",
    version: JSON.parse(read("package.json")).version,
    groups,
  };
}
