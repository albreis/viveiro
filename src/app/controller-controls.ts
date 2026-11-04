import type { ViewController } from "./view-controller.ts";
import { installEnvironmentControls } from "./controls-environment.ts";
import { installExperimentsControls } from "./controls-experiments.ts";
import { installHelpControls } from "./controls-help.ts";
import { installWorkbenchDocking } from "./workbench-docking.ts";
import { installPanelTabs } from "./panel-tabs.ts";
import { installExportControls } from "./controls-export.ts";
function installActionReasons(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    "[data-disabled-reason]",
  );
  const update = (button: HTMLButtonElement) => {
    const note = document.getElementById(button.dataset.disabledReason ?? "");
    if (!note) return;
    note.hidden = !button.disabled;
    if (button.disabled) button.setAttribute("aria-describedby", note.id);
    else button.removeAttribute("aria-describedby");
  };
  const observer = new MutationObserver((records) => {
    for (const record of records) update(record.target as HTMLButtonElement);
  });
  for (const button of buttons) {
    update(button);
    observer.observe(button, {
      attributes: true,
      attributeFilter: ["disabled"],
    });
  }
  window.addEventListener("pagehide", () => observer.disconnect(), {
    once: true,
  });
}
export function installControllerControls(this: ViewController) {
  installPanelTabs();
  installWorkbenchDocking();
  installActionReasons();
  installEnvironmentControls.call(this);
  installExperimentsControls.call(this);
  installHelpControls.call(this);
  installExportControls.call(this);
}
