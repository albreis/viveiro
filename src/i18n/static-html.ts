import { translate } from "./core.ts";
import { defaultLocale, type Locale, type MessageKey } from "./catalogs.ts";
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  );
/** Populate catalog slots for readable HTML before JavaScript loads. */
export function staticTranslations(
  html: string,
  locale: Locale = defaultLocale,
): string {
  const content = html.replace(
    /<([a-z][\w-]*)([^>]*\bdata-i18n="([^"]+)"[^>]*)>\s*<\/\1>/g,
    (_all, tag: string, attrs: string, key: MessageKey) =>
      `<${tag}${attrs}>${escape(translate(key, {}, locale))}</${tag}>`,
  );
  return content.replace(
    /<[^>]+\bdata-i18n-(aria-label|title|placeholder)="[^"]+"[^>]*>/g,
    (tag) =>
      tag.replace(
        /\bdata-i18n-(aria-label|title|placeholder)="([^"]+)"/g,
        (_all: string, attribute: string, key: MessageKey) =>
          `data-i18n-${attribute}="${key}" ${attribute}="${escape(translate(key, {}, locale))}"`,
      ),
  );
}
