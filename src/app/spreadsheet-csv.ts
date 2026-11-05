import type { Locale } from "../i18n/catalogs.ts";
import { locale } from "../i18n/runtime.ts";

export function spreadsheetCsv(csv: string, language: Locale): string {
  const decimal =
    new Intl.NumberFormat(language, { numberingSystem: "latn" })
      .formatToParts(1.5)
      .find((part) => part.type === "decimal")?.value ?? ".";
  if (decimal === ".") return csv;
  const delimiter = decimal === "," ? ";" : ",";
  // The model's CSV quotes all text. Outside quotes, dots occur only in
  // numbers. Escaped quotes flip the state twice without changing the field.
  let quoted = false;
  let localized = "";
  for (const character of csv) {
    if (character === '"') quoted = !quoted;
    if (!quoted && character === ",") localized += delimiter;
    else if (!quoted && character === ".") localized += decimal;
    else localized += character;
  }
  return localized;
}

export function bindSpreadsheetCsv(
  anchor: HTMLAnchorElement,
  basename: string,
  canonicalOption?: HTMLElement,
) {
  let source: string | null = null;
  let url: string | undefined;
  const render = () => {
    if (url) URL.revokeObjectURL(url);
    url = undefined;
    if (source === null) {
      anchor.removeAttribute("href");
      if (canonicalOption) canonicalOption.hidden = true;
      return;
    }
    const text = spreadsheetCsv(source, locale.locale);
    const localized = text !== source;
    if (canonicalOption) canonicalOption.hidden = !localized;
    url = URL.createObjectURL(
      new Blob([text], { type: "text/csv;charset=utf-8" }),
    );
    anchor.href = url;
    anchor.download =
      basename + (localized ? "-" + locale.locale : "") + ".csv";
  };
  locale.subscribe(render);
  return (csv: string | null) => {
    source = csv;
    render();
  };
}
