import { element as $ } from "./dom-elements.ts";

import { ownsSpaceKey } from "./keyboard.ts";

import type { ViewController } from "./view-controller.ts";
export function installHelpControls(this: ViewController) {
  const dialog = $("help-dialog");
  $("help").onclick = () => dialog.showModal();
  $("close-help").onclick = $("start-observing").onclick = () => dialog.close();
  dialog.onclick = (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  };
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || document.querySelector("dialog[open]")) return;
    if (e.key === "Escape" && this.scene?.tool)
      document.querySelector<HTMLButtonElement>("[data-tool].active")?.click();
    if (e.key === "Escape" && this.scene?.followId) {
      this.scene.stopFollowing();
      this.updateAntCamera();
    }
    if (
      e.code === "Space" &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !ownsSpaceKey(e.target instanceof Element ? e.target : null) &&
      !dialog.open
    ) {
      e.preventDefault();
      $("play").click();
    }
  });
}
