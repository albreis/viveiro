import ptCommon from "./locales/pt-BR/common.json" with { type: "json" };
import enCommon from "./locales/en/common.json" with { type: "json" };
import ptExperiments from "./locales/pt-BR/experiments.json" with { type: "json" };
import enExperiments from "./locales/en/experiments.json" with { type: "json" };
import ptSweeps from "./locales/pt-BR/sweeps.json" with { type: "json" };
import enSweeps from "./locales/en/sweeps.json" with { type: "json" };
import ptProfiles from "./locales/pt-BR/profiles.json" with { type: "json" };
import enProfiles from "./locales/en/profiles.json" with { type: "json" };
import ptValidation from "./locales/pt-BR/validation.json" with { type: "json" };
import enValidation from "./locales/en/validation.json" with { type: "json" };
import ptBiology from "./locales/pt-BR/biological-profiles.json" with { type: "json" };
import enBiology from "./locales/en/biological-profiles.json" with { type: "json" };
import ptTerrarium from "./locales/pt-BR/terrarium.json" with { type: "json" };
import enTerrarium from "./locales/en/terrarium.json" with { type: "json" };
import ptStatus from "./locales/pt-BR/status.json" with { type: "json" };
import enStatus from "./locales/en/status.json" with { type: "json" };
import ptControls from "./locales/pt-BR/controls.json" with { type: "json" };
import enControls from "./locales/en/controls.json" with { type: "json" };
const ptBR = {
  ...ptCommon,
  ...ptControls,
  ...ptStatus,
  ...ptTerrarium,
  ...ptExperiments,
  ...ptSweeps,
  ...ptValidation,
  ...ptBiology,
  ...ptProfiles,
};
const en = {
  ...enCommon,
  ...enControls,
  ...enStatus,
  ...enTerrarium,
  ...enExperiments,
  ...enSweeps,
  ...enValidation,
  ...enBiology,
  ...enProfiles,
};
/** Add a locale here after copying/translating all of its domain catalogs. */
export const catalogs = { "pt-BR": ptBR, en } as const;
export type Locale = keyof typeof catalogs;
export type MessageKey = keyof typeof ptBR;
export const defaultLocale: Locale = "pt-BR";
export const supportedLocales = Object.keys(catalogs) as Locale[];
export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && Object.hasOwn(catalogs, value);
