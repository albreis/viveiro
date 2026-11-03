import { readFileSync } from "node:fs";
import { join } from "node:path";
import { modelDocuments } from "../../src/modules/model-documentation/catalog.ts";
import {
  escapeHtml,
  teachingMarkdown,
} from "../../src/modules/teaching/markdown.ts";
import { supportedLocales } from "../../src/i18n/catalogs.ts";
import {
  localePrefix,
  documentText,
  documentSource,
  documentLanguages,
  laboratoryLink,
  documentAssets,
} from "./localized-docs.ts";
export function modelDocPages(root: string) {
  const pages = new Map<string, string>(),
    links = new Map<string, string>();
  for (const d of modelDocuments) {
    links.set(d.source.replace(/^docs\//, ""), d.slug + ".html");
    links.set(d.source.replace(/^docs\/odd\//, ""), d.slug + ".html");
    links.set("../" + d.source.replace(/^docs\//, ""), d.slug + ".html");
  }
  for (const locale of supportedLocales) {
    const prefix = localePrefix(locale) + "modelo/";
    const text = (key: Parameters<typeof documentText>[1]) =>
      documentText(locale, key);
    const nav = modelDocuments
      .map(
        (d) =>
          '<li><a href="' +
          d.slug +
          '.html">' +
          escapeHtml(
            text(("documents.model." + d.slug) as Parameters<typeof text>[0]),
          ) +
          "</a></li>",
      )
      .join("\n");
    for (const d of modelDocuments) {
      const source = documentSource(root, d.source, locale);
      const linked = source.replace(/\(([^)]+\.md)\)/g, (all, file: string) =>
        links.has(file) ? "(" + links.get(file) + ")" : all,
      );
      const title = text(
        ("documents.model." + d.slug) as Parameters<typeof text>[0],
      );
      pages.set(
        prefix + d.slug + ".html",
        `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Viveiro</title><link rel="stylesheet" href="modelo.css"></head>
<body><a class="skip" href="#conteudo">${escapeHtml(text("documents.skip"))}</a>
<header><a href="${laboratoryLink(locale)}">${escapeHtml(text("documents.back"))}</a><a href="index.html">${escapeHtml(text("documents.model.home"))}</a></header>
${documentLanguages("modelo/" + d.slug + ".html", locale)}
<main id="conteudo" tabindex="-1">${documentAssets(teachingMarkdown(linked, locale), locale)}</main>
<nav aria-label="${escapeHtml(text("documents.model.nav"))}"><h2>${escapeHtml(text("documents.model.nav"))}</h2><ul>${nav}</ul></nav>
<p><a href="${d.slug}.txt" download="viveiro-${locale}-modelo-${d.slug}.txt">${escapeHtml(text("documents.model.download"))}</a></p>
<footer>${escapeHtml(text("documents.model.footer"))}</footer></body></html>`,
      );
      pages.set(prefix + d.slug + ".txt", source);
    }
    pages.set(
      prefix + "modelo.css",
      readFileSync(join(root, "src/styles/teaching.css"), "utf8"),
    );
    pages.set(
      prefix + "referencia.txt",
      readFileSync(
        join(root, "src/modules/model-documentation/reference-field.ts"),
        "utf8",
      ),
    );
    pages.set(
      prefix + "vetores.json",
      readFileSync(
        join(root, "src/modules/model-documentation/vectors.json"),
        "utf8",
      ),
    );
    pages.set(
      prefix + "verificador.txt",
      readFileSync(join(root, "scripts/check-odd-reference.ts"), "utf8"),
    );
  }
  return pages;
}
