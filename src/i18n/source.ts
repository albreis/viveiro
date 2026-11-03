import { catalogs, type Locale, type MessageKey } from "./catalogs.ts";
import { translate } from "./core.ts";
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exact = new Map<string, MessageKey>();
const patterns: {
  key: MessageKey;
  names: string[];
  regex: RegExp;
  specificity: number;
}[] = [];
for (const catalog of Object.values(catalogs)) {
  for (const [id, source] of Object.entries(catalog)) {
    const key = id as MessageKey,
      names: string[] = [];
    const expression = source
      .split(/(\{[a-zA-Z][a-zA-Z0-9_]*\})/g)
      .map((piece) => {
        if (/^\{[a-zA-Z][a-zA-Z0-9_]*\}$/.test(piece)) {
          names.push(piece.slice(1, -1));
          return "(.+?)";
        }
        return escape(piece);
      })
      .join("");
    if (names.length)
      patterns.push({
        key,
        names,
        regex: new RegExp("^" + expression + "$"),
        specificity: source.replace(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g, "").length,
      });
    else if (!exact.has(source)) exact.set(source, key);
  }
}
// Specific event messages must win over generic prefixes such as colony summaries.
patterns.sort((a, b) => b.specificity - a.specificity);
const cache = new Map<string, string>();
/** Only explicit presentation boundaries call this. Canonical data and authored values stay unchanged. */
export function translateSource(value: string, locale: Locale): string {
  if (!value) return value;
  const direct = exact.get(value);
  if (direct) return translate(direct, {}, locale);
  const cacheKey = locale + "\0" + value;
  const prior = cache.get(cacheKey);
  if (prior !== undefined) return prior;
  let result = value;
  for (const pattern of patterns) {
    const match = pattern.regex.exec(value);
    if (!match) continue;
    const args: Record<string, string> = {};
    let valid = true;
    pattern.names.forEach((name, i) => {
      if (name in args && args[name] !== match[i + 1]) valid = false;
      args[name] = match[i + 1];
    });
    if (valid) {
      result = translate(pattern.key, args, locale);
      break;
    }
  }
  if (cache.size >= 256) cache.delete(cache.keys().next().value!);
  cache.set(cacheKey, result);
  return result;
}
