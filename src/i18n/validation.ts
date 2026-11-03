import { messageArguments } from "./core.ts";
export interface CatalogIssue {
  locale: string;
  key: string;
  reason: string;
}
/** Reject incomplete translations and changed interpolation contracts before bundling. */
export function validateCatalogs(
  catalogs: Readonly<Record<string, Readonly<Record<string, string>>>>,
  referenceLocale: string,
): CatalogIssue[] {
  const reference = catalogs[referenceLocale];
  if (!reference)
    throw Error("Reference locale not registered: " + referenceLocale);
  const issues: CatalogIssue[] = [];
  for (const [locale, messages] of Object.entries(catalogs)) {
    for (const key of Object.keys(reference)) {
      const value = messages[key];
      if (typeof value !== "string" || !value.trim()) {
        issues.push({ locale, key, reason: "missing or empty message" });
        continue;
      }
      if (
        JSON.stringify(messageArguments(value)) !==
        JSON.stringify(messageArguments(reference[key]))
      )
        issues.push({ locale, key, reason: "interpolation variables differ" });
    }
    for (const key of Object.keys(messages))
      if (!Object.hasOwn(reference, key))
        issues.push({ locale, key, reason: "unknown reference key" });
  }
  return issues;
}
