import { element as $ } from "./dom-elements.ts";
import { t } from "../i18n/runtime.ts";

import type { ViewController } from "./view-controller.ts";
export function installExportControls(this: ViewController) {
  $("export").onclick = () => {
    const data = {
      ...this.getSession(),
      exportedAt: new Date().toISOString(),
      initial: this.initial,
      interventions: this.interventions,
      world: this.world.snapshot(),
      comparison: this.comparison?.snapshot(),
      forecast: this.forecaster?.state,
      description:
        "Modelo ecológico simplificado. Tempos de vida acelerados. 100 passos = 1 dia simulado.",
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "viveiro-" +
      this.world.seed.replace(/[^a-z0-9_-]/gi, "_") +
      "-dia-" +
      Math.floor(this.world.day) +
      ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    this.toast(t("controls.exported"));
  };
}
