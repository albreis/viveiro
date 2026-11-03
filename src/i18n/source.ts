import {
  catalogs,
  defaultLocale,
  type Locale,
  type MessageKey,
} from "./catalogs.ts";
import { translate } from "./core.ts";

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const patterns = Object.values(catalogs).flatMap((catalog) =>
  Object.entries(catalog).map(([key, source]) => {
    const names: string[] = [];
    const pieces = source.split(/(\{[a-zA-Z][a-zA-Z0-9_]*\})/g);
    const expression = pieces
      .map((piece) => {
        if (/^\{[a-zA-Z][a-zA-Z0-9_]*\}$/.test(piece)) {
          names.push(piece.slice(1, -1));
          return "(.+?)";
        }
        return escape(piece);
      })
      .join("");
    return {
      key: key as MessageKey,
      source,
      names,
      regex: new RegExp("^" + expression + "$"),
    };
  }),
);
/** Translate canonical model messages only at explicitly marked presentation boundaries. */
export function translateSource(value: string, locale: Locale): string {
  if (!value) return value;
  for (const pattern of patterns) {
    const match = pattern.regex.exec(value);
    if (!match) continue;
    const args: Record<string, string> = {};
    let valid = true;
    pattern.names.forEach((name, i) => {
      if (name in args && args[name] !== match[i + 1]) valid = false;
      args[name] = match[i + 1];
    });
    if (valid) return translate(pattern.key, args, locale);
  }
  return value;
}
