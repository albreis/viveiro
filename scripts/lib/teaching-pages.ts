import { readFileSync } from "node:fs";
import { join } from "node:path";
import { teachingGuides } from "../../src/modules/teaching/catalog.ts";
import {
  teachingMarkdown,
  escapeHtml,
} from "../../src/modules/teaching/markdown.ts";
function page(title: string, body: string, download: string) {
  const links = teachingGuides
    .map((g) => `<li><a href="${g.slug}.html">${escapeHtml(g.title)}</a></li>`)
    .join("\n");
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} · Viveiro</title>
  <link rel="stylesheet" href="ensino.css">
</head>
<body>
  <a class="skip" href="#conteudo">Pular para o roteiro</a>
  <header>
    <a href="../index.html">← Voltar ao laboratório</a>
    <a href="index.html">Guia do professor</a>
  </header>
  <main id="conteudo">${body}</main>
  <nav aria-label="Roteiros"><h2>Outros roteiros</h2><ul>${links}</ul></nav>
  <p><a href="${download}">Baixar este roteiro em texto</a></p>
  <footer>Viveiro · Documentação original CC BY 4.0 · Revisão docente pendente.</footer>
</body>
</html>`;
}
export function teachingPages(root: string) {
  const pages = new Map<string, string>();
  const docs = [
    { slug: "index", title: "Guia do professor", file: "README.md" },
    ...teachingGuides.map((g) => ({ ...g, file: g.slug + ".md" })),
  ];
  const extra = ["microclima-local.md", "revisao-docente.md"];
  const localDocs = new Map([
    ...docs.map((d) => [d.file, d.slug + ".html"]),
    ...extra.map((file) => [file, file.replace(/\.md$/, ".txt")]),
  ] as [string, string][]);
  for (const d of docs) {
    const source = readFileSync(join(root, "docs", "ensino", d.file), "utf8");
    const linked = source.replace(/\(([^)]+\.md)\)/g, (all, file: string) =>
      localDocs.has(file) ? "(" + localDocs.get(file) + ")" : all,
    );
    pages.set(
      "ensino/" + d.slug + ".html",
      page(d.title, teachingMarkdown(linked), d.file.replace(/\.md$/, ".txt")),
    );
    pages.set("ensino/" + d.file.replace(/\.md$/, ".txt"), source);
  }
  for (const file of extra)
    pages.set(
      "ensino/" + file.replace(/\.md$/, ".txt"),
      readFileSync(join(root, "docs", "ensino", file), "utf8"),
    );
  pages.set(
    "ensino/ensino.css",
    readFileSync(join(root, "src", "styles", "teaching.css"), "utf8"),
  );
  return pages;
}
