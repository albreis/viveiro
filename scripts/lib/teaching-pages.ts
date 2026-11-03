import { readFileSync } from "node:fs";
import { join } from "node:path";
import { teachingGuides } from "../../src/modules/teaching/catalog.ts";
import {
  teachingMarkdown,
  escapeHtml,
} from "../../src/modules/teaching/markdown.ts";
import {
  supportedLocales,
  type Locale,
  type MessageKey,
} from "../../src/i18n/catalogs.ts";
import {
  localePrefix,
  documentText,
  documentSource,
  documentLanguages,
  laboratoryLink,
} from "./localized-docs.ts";
function page(
  locale: Locale,
  slug: string,
  title: string,
  body: string,
  download: string,
) {
  const text = (key: MessageKey) => documentText(locale, key);
  const links = teachingGuides
    .map(
      (g) =>
        '<li><a href="' +
        g.slug +
        '.html">' +
        escapeHtml(text(("documents.school." + g.slug) as MessageKey)) +
        "</a></li>",
    )
    .join("\n");
  return `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Viveiro</title><link rel="stylesheet" href="ensino.css"></head>
<body><a class="skip" href="#conteudo">${escapeHtml(text("documents.school.skip"))}</a>
<header><a href="${laboratoryLink(locale)}">${escapeHtml(text("documents.back"))}</a><a href="index.html">${escapeHtml(text("documents.school.index"))}</a></header>
${documentLanguages("ensino/" + slug + ".html", locale)}
<main id="conteudo">${body}</main>
<nav aria-label="${escapeHtml(text("documents.school.nav"))}"><h2>${escapeHtml(text("documents.school.others"))}</h2><ul>${links}</ul></nav>
<p><a href="${download}">${escapeHtml(text("documents.school.download"))}</a></p>
<footer>${escapeHtml(text("documents.school.footer"))}</footer></body></html>`;
}
export function teachingPages(root: string) {
  const pages = new Map<string, string>();
  const docs = [
    { slug: "index", file: "README.md" },
    ...teachingGuides.map((g) => ({ ...g, file: g.slug + ".md" })),
  ];
  const extra = ["microclima-local.md", "revisao-docente.md"];
  const localDocs = new Map([
    ...docs.map((d) => [d.file, d.slug + ".html"]),
    ...extra.map((file) => [file, file.replace(/\.md$/, ".txt")]),
  ] as [string, string][]);
  for (const locale of supportedLocales) {
    const prefix = localePrefix(locale) + "ensino/";
    for (const d of docs) {
      const source = documentSource(root, "docs/ensino/" + d.file, locale);
      const linked = source.replace(/\(([^)]+\.md)\)/g, (all, file: string) =>
        localDocs.has(file) ? "(" + localDocs.get(file) + ")" : all,
      );
      const title = documentText(
        locale,
        ("documents.school." + d.slug) as MessageKey,
      );
      pages.set(
        prefix + d.slug + ".html",
        page(
          locale,
          d.slug,
          title,
          teachingMarkdown(linked, locale),
          d.file.replace(/\.md$/, ".txt"),
        ),
      );
      pages.set(prefix + d.file.replace(/\.md$/, ".txt"), source);
    }
    for (const file of extra)
      pages.set(
        prefix + file.replace(/\.md$/, ".txt"),
        documentSource(root, "docs/ensino/" + file, locale),
      );
    pages.set(
      prefix + "ensino.css",
      readFileSync(join(root, "src/styles/teaching.css"), "utf8"),
    );
  }
  return pages;
}
