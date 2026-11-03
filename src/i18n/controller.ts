import {
  defaultLocale,
  isLocale,
  type Locale,
  type MessageKey,
} from "./catalogs.ts";
import { translate, type MessageArguments } from "./core.ts";
export interface LocalePreference {
  read(): unknown;
  write(locale: Locale): void;
}
export class LocaleController {
  private selected: Locale = defaultLocale;
  private listeners = new Set<(locale: Locale) => void>();
  private preference?: LocalePreference;
  private persisted = false;
  constructor(preference?: LocalePreference) {
    this.preference = preference;
    try {
      const saved = preference?.read();
      if (isLocale(saved)) {
        this.selected = saved;
        this.persisted = true;
      }
    } catch {
      /* Browser preference is optional; the model is never touched. */
    }
  }
  get locale(): Locale {
    return this.selected;
  }
  text(key: MessageKey, args: MessageArguments = {}): string {
    return translate(key, args, this.selected);
  }
  number(
    value: number | null | undefined,
    options: Intl.NumberFormatOptions = {},
  ): string {
    return typeof value === "number" && Number.isFinite(value)
      ? new Intl.NumberFormat(this.selected, options).format(value)
      : this.text("common.missing");
  }
  setLocale(locale: Locale): { changed: boolean; persisted: boolean } {
    if (!isLocale(locale)) throw Error("Unsupported locale: " + String(locale));
    if (locale === this.selected)
      return { changed: false, persisted: this.persisted };
    this.selected = locale;
    let persisted = false;
    try {
      if (this.preference) {
        this.preference.write(locale);
        persisted = true;
      }
    } catch {
      persisted = false;
    }
    this.persisted = persisted;
    for (const listener of [...this.listeners]) listener(locale);
    return { changed: true, persisted };
  }
  subscribe(listener: (locale: Locale) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
