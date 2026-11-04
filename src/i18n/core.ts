import {
  catalogs,
  defaultLocale,
  type Locale,
  type MessageKey,
} from "./catalogs.ts";
export type MessageArguments = Readonly<Record<string, string | number>>;
/** Presentation only. This module never reads the world, seed, RNG or browser storage. */
export function translate(
  key: MessageKey,
  args: MessageArguments = {},
  locale: Locale = defaultLocale,
): string {
  const message = catalogs[locale][key] ?? catalogs[defaultLocale][key];
  if (typeof message !== "string")
    throw Error("Unknown translation key: " + key);
  return message.replace(
    /\{([a-zA-Z][a-zA-Z0-9_]*)\}/g,
    (_all, name: string) => {
      if (!Object.hasOwn(args, name))
        throw Error("Missing translation argument: " + name);
      return String(args[name]);
    },
  );
}
type CountKey = "gallery.count" | "status.queens" | "status.workers";
const pluralRules = new Map<Locale, Intl.PluralRules>();
export function countMessageKey(
  key: CountKey,
  count: number,
  locale: Locale,
): MessageKey {
  let rules = pluralRules.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    pluralRules.set(locale, rules);
  }
  const form = count !== 0 && rules.select(count) === "one" ? "one" : "other";
  return `${key}.${form}`;
}
export function messageArguments(message: string): string[] {
  return [
    ...new Set(
      [...message.matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]),
    ),
  ].sort();
}
