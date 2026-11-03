import { defaultLocale, type Locale } from "./catalogs.ts";
/** Only explicitly marked navigation links are localized; downloads and external URLs stay canonical. */
export function localizedLink(href: string, locale: Locale): string {
  if (/^(?:\.\/)?(?:modelo\/|ensino\/|licencas\.html)/.test(href))
    return locale !== defaultLocale
      ? href.replace(/^(\.\/)?/, "$1" + locale + "/")
      : href;
  if (/^(?:\.\/)?(?:index|experimentos)\.html(?:[?#]|$)/.test(href)) {
    const hashAt = href.indexOf("#"),
      hash = hashAt >= 0 ? href.slice(hashAt) : "";
    const base = hashAt >= 0 ? href.slice(0, hashAt) : href;
    const [path, query] = base.split("?");
    const parameters = new URLSearchParams(query);
    parameters.set("lang", locale);
    return path + "?" + parameters + hash;
  }
  return href;
}
