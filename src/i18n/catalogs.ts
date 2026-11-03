import ptBR from "./locales/pt-BR/common.json" with { type: "json" };
import en from "./locales/en/common.json" with { type: "json" };
/** Add a locale here after copying/translating all of its domain catalogs. */
export const catalogs = { "pt-BR": ptBR, en } as const;
export type Locale = keyof typeof catalogs;
export type MessageKey = keyof typeof ptBR;
export const defaultLocale: Locale = "pt-BR";
export const supportedLocales = Object.keys(catalogs) as Locale[];
export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && Object.hasOwn(catalogs, value);
