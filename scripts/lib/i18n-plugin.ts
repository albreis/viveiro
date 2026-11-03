import type { Plugin } from "vite";
import { staticTranslations } from "../../src/i18n/static-html.ts";
export function i18nPlugin(): Plugin {
  return {
    name: "viveiro-i18n",
    transformIndexHtml(html) {
      return staticTranslations(html);
    },
  };
}
