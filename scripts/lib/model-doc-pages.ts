import { readFileSync } from "node:fs";
import { join } from "node:path";
import { modelDocuments } from "../../src/modules/model-documentation/catalog.ts";
import {
  escapeHtml,
  teachingMarkdown,
} from "../../src/modules/teaching/markdown.ts";
export function modelDocPages(root: string) {
  const pages = new Map<string, string>();
  const links = new Map<string, string>();
  for (const d of modelDocuments) {
    links.set(d.source.replace(/^docs\//, ""), d.slug + ".html");
    links.set(d.source.replace(/^docs\/odd\//, ""), d.slug + ".html");
    links.set("../" + d.source.replace(/^docs\//, ""), d.slug + ".html");
  }
  const nav = modelDocuments
    .map((d) => `<li><a href="${d.slug}.html">${escapeHtml(d.title)}</a></li>`)
    .join("\n");
  for (const d of modelDocuments) {
    const source = readFileSync(join(root, d.source), "utf8");
    const linked = source.replace(/\(([^)]+\.md)\)/g, (all, file: string) =>
      links.has(file) ? "(" + links.get(file) + ")" : all,
    );
    pages.set(
      "modelo/" + d.slug + ".html",
      `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(d.title)} · Viveiro</title><link rel="stylesheet" href="modelo.css"></head>
<body><a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header><a href="../index.html">← Voltar ao laboratório</a><a href="index.html">Documentação ODD</a></header>
<main id="conteudo" tabindex="-1">${teachingMarkdown(linked)}</main>
<nav aria-label="Documentos do modelo"><h2>Documentos do modelo</h2><ul>${nav}</ul></nav>
<p><a href="${d.slug}.txt" download>Baixar a fonte deste documento</a></p>
<footer>Viveiro · Modelo exploratório · Documentação original CC BY4.0 · Revisão externa pendente.</footer></body></html>`,
    );
    pages.set("modelo/" + d.slug + ".txt", source);
  }
  pages.set(
    "modelo/modelo.css",
    readFileSync(join(root, "src/styles/teaching.css"), "utf8"),
  );
  pages.set(
    "modelo/referencia.txt",
    readFileSync(
      join(root, "src/modules/model-documentation/reference-field.ts"),
      "utf8",
    ),
  );
  pages.set(
    "modelo/vetores.json",
    readFileSync(
      join(root, "src/modules/model-documentation/vectors.json"),
      "utf8",
    ),
  );
  pages.set(
    "modelo/verificador.txt",
    readFileSync(join(root, "scripts/check-odd-reference.ts"), "utf8"),
  );
  return pages;
}
