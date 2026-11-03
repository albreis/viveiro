import { LocaleController } from "./controller.ts";
import { isLocale } from "./catalogs.ts";
export const localePreferenceKey = "viveiro.locale.v1";
/** Explicit browser adapter. No auto-install, reload, save migration or simulation access. */
export function browserLocaleController(
  browser: Pick<Window, "location" | "localStorage" | "history">,
): LocaleController {
  return new LocaleController({
    read() {
      const requested = new URL(browser.location.href).searchParams.get("lang");
      if (isLocale(requested)) return requested;
      return browser.localStorage.getItem(localePreferenceKey);
    },
    write(locale) {
      browser.localStorage.setItem(localePreferenceKey, locale);
      const url = new URL(browser.location.href);
      url.searchParams.set("lang", locale);
      browser.history.replaceState(browser.history.state, "", url.href);
    },
  });
}
