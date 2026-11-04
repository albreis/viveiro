import { installPanelTabs } from "./panel-tabs.ts";

const groups = [
  [".environment", "#drawer-environment"],
  [".intervention-controls", "#drawer-intervention"],
  ["#time-panel", "#drawer-time"],
  ["#analysis", "#drawer-data"],
] as const;

export function installMobileControls(): void {
  const dialog = document.querySelector<HTMLDialogElement>("#mobile-controls")!;
  const open = document.querySelector<HTMLButtonElement>(
    "#mobile-controls-open",
  )!;
  const close = document.querySelector<HTMLButtonElement>(
    "#mobile-controls-close",
  )!;
  const viewport = document.querySelector<HTMLElement>("#viewport")!;
  const mobile = matchMedia("(max-width: 650px)");
  const moved: { element: Element; anchor: Comment }[] = [];
  let placeOnScene = false;
  installPanelTabs(dialog);

  open.addEventListener("click", () => {
    if (dialog.open || !mobile.matches) return;
    for (const [source, target] of groups) {
      const element = document.querySelector(source)!;
      const anchor = document.createComment("mobile-control");
      element.before(anchor);
      dialog.querySelector(target)!.append(element);
      moved.push({ element, anchor });
    }
    dialog.showModal();
    dialog
      .querySelector<HTMLElement>('[role=tab][aria-selected="true"]')
      ?.focus();
  });
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest('[data-tool][aria-pressed="true"]')
    ) {
      placeOnScene = true;
      dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    for (const { element, anchor } of moved) anchor.replaceWith(element);
    moved.length = 0;
    if (placeOnScene || !mobile.matches) {
      viewport.focus({ preventScroll: true });
      if (placeOnScene) viewport.scrollIntoView({ block: "nearest" });
    } else {
      open.focus({ preventScroll: true });
    }
    placeOnScene = false;
  });
  mobile.addEventListener("change", () => {
    if (dialog.open && !mobile.matches) dialog.close();
  });
}
