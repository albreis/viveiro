import { supportedLocales, isLocale, type MessageKey } from "./catalogs.ts";
import { locale, translations } from "./runtime.ts";
import "./styles.css";

let installed = false;
export function installLocalePicker() {
  if (installed) return;
  installed = true;
  const label = document.createElement("label");
  label.className = "locale-picker";
  const caption = document.createElement("span");
  caption.setAttribute("data-i18n", "common.language");
  const picker = document.createElement("select");
  picker.id = "language-picker";
  for (const value of supportedLocales) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = locale.text(("common.locale." + value) as MessageKey);
    picker.append(option);
  }
  label.append(caption, picker);
  (document.querySelector("header") ?? document.body).append(label);
  const refresh = () => {
    document.documentElement.lang = locale.locale;
    picker.value = locale.locale;
    translations.apply(document);
  };
  picker.addEventListener("change", () => {
    if (isLocale(picker.value)) locale.setLocale(picker.value);
  });
  const stop = locale.subscribe(refresh);
  // New templates are translated without rebuilding forms or touching their values.
  const observer = new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes)
        if (node instanceof Element) translations.apply(node);
  });
  refresh();
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener(
    "pagehide",
    () => {
      stop();
      observer.disconnect();
    },
    { once: true },
  );
}
