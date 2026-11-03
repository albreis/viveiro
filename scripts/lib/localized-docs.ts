import { readFileSync } from "node:fs";
import { join, posix } from "node:path";
import {
  defaultLocale,
  supportedLocales,
  type Locale,
  type MessageKey,
} from "../../src/i18n/catalogs.ts";
import { translate } from "../../src/i18n/core.ts";
import { escapeHtml } from "../../src/modules/teaching/markdown.ts";
export const localePrefix = (locale: Locale) =>
  locale === defaultLocale ? "" : locale + "/";
export const documentText = (locale: Locale, key: MessageKey) =>
  translate(key, {}, locale);
export function documentSource(root: string, source: string, locale: Locale) {
  return readFileSync(
    join(
      root,
      locale === defaultLocale
        ? source
        : "src/i18n/locales/" + locale + "/" + source,
    ),
    "utf8",
  );
}
export function documentLanguages(path: string, locale: Locale): string {
  const current = localePrefix(locale) + path,
    directory = posix.dirname(current);
  return (
    '<nav class="document-languages" aria-label="' +
    escapeHtml(documentText(locale, "common.language")) +
    '">' +
    supportedLocales
      .map((destination) => {
        const href = posix.relative(
          directory,
          localePrefix(destination) + path,
        );
        return (
          '<a href="' +
          href +
          '" lang="' +
          destination +
          '" hreflang="' +
          destination +
          '"' +
          (destination === locale ? ' aria-current="page"' : "") +
          ">" +
          escapeHtml(
            documentText(
              locale,
              ("common.locale." + destination) as MessageKey,
            ),
          ) +
          "</a>"
        );
      })
      .join(" · ") +
    "</nav>"
  );
}
export function laboratoryLink(locale: Locale): string {
  return (
    (locale === defaultLocale ? "../" : "../../") + "index.html?lang=" + locale
  );
}
/** Raw experiment files have one canonical location, never a translated copy. */
export function documentAssets(html: string, locale: Locale): string {
  return locale === defaultLocale
    ? html
    : html.replaceAll('href="../experimentos/', 'href="../../experimentos/');
}
