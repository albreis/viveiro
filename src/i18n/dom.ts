import { translateSource } from "./source.ts";
import type { LocaleController } from "./controller.ts";
import type { MessageKey } from "./catalogs.ts";
import type { MessageArguments } from "./core.ts";

/** Explicit bindings only: never inspect or translate user input, JSON, code or logs. */
export function createDomTranslations(controller: LocaleController) {
  const argumentsByElement = new WeakMap<Element, MessageArguments>();
  const set = (
    element: Element,
    key: MessageKey,
    args: MessageArguments = {},
  ) => {
    element.setAttribute("data-i18n", key);
    argumentsByElement.set(element, args);
    render(element);
  };
  const clear = (element: Element) => {
    element.removeAttribute("data-i18n");
    element.removeAttribute("data-i18n-source");
    argumentsByElement.delete(element);
    element.textContent = "";
  };
  const source = (element: Element, value: string) => {
    clear(element);
    element.setAttribute("data-i18n-source", value);
    render(element);
  };
  function render(element: Element) {
    const source = element.getAttribute("data-i18n-source");
    if (source !== null) {
      const value = translateSource(source, controller.locale);
      if (element.textContent !== value) element.textContent = value;
    }
    const key = element.getAttribute("data-i18n") as MessageKey | null;
    if (key) {
      const value = controller.text(key, argumentsByElement.get(element));
      if (element.textContent !== value) element.textContent = value;
    }
    for (const attribute of ["aria-label", "title", "placeholder"]) {
      const key = element.getAttribute(
        "data-i18n-" + attribute,
      ) as MessageKey | null;
      if (key) {
        const value = controller.text(key);
        if (element.getAttribute(attribute) !== value)
          element.setAttribute(attribute, value);
      }
    }
  }
  const selector =
    "[data-i18n],[data-i18n-source],[data-i18n-aria-label],[data-i18n-title],[data-i18n-placeholder]";
  function apply(root: ParentNode) {
    if (root instanceof Element) render(root);
    root.querySelectorAll(selector).forEach(render);
  }
  const attribute = (
    element: Element,
    name: "aria-label" | "title" | "placeholder",
    key: MessageKey,
  ) => {
    element.setAttribute("data-i18n-" + name, key);
    render(element);
  };
  return { set, source, clear, apply, attribute };
}
