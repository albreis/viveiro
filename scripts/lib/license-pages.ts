import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defaultLocale, supportedLocales } from "../../src/i18n/catalogs.ts";
import { escapeHtml } from "../../src/modules/teaching/markdown.ts";
import { documentLanguages } from "./localized-docs.ts";
export function licensePages(root: string) {
  const pages = new Map<string, string>();
  const { version } = JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
  );
  for (const locale of supportedLocales) {
    if (locale === defaultLocale) continue;
    const source = readFileSync(
      join(root, "src/i18n/locales", locale, "docs/licenses.html"),
      "utf8",
    );
    pages.set(
      locale + "/licencas.html",
      source
        .replaceAll("{{version}}", escapeHtml(version))
        .replaceAll(
          "{{languages}}",
          documentLanguages("licencas.html", locale),
        ),
    );
  }
  return pages;
}
