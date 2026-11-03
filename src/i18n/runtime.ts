import { LocaleController } from "./controller.ts";
import { browserLocaleController } from "./browser.ts";
import { createDomTranslations } from "./dom.ts";

/** Shared presentation state; simulation modules must never import this entry point. */
export const locale =
  typeof window === "undefined"
    ? new LocaleController()
    : browserLocaleController(window);
export const translations = createDomTranslations(locale);
export const message = translations.set;
export const t = locale.text.bind(locale);
export const messageSource = translations.source;
export const clearMessage = translations.clear;
export const messageAttribute = translations.attribute;
