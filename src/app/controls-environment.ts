import { element as $ } from "./dom-elements.ts";
import { t } from "../i18n/runtime.ts";

import { installSurvivalControls } from "./survival-view.ts";
import { installMaterialControls } from "./material-controls.ts";
import { installBroodInspection } from "./development-status.ts";
import { installSeasonControls } from "./season-controls.ts";
import { installSealingControls } from "./sealing-controls.ts";
import { installBiologyControls } from "./biology-controls.ts";
import { installLearningControls } from "./learning-controls.ts";
import { installGasControls } from "./gas-status.ts";
import { installClimateControls } from "./climate-status.ts";
import { installGranularControls } from "./granular-controls.ts";
import { installCheckpointControls } from "./checkpoint-controls.ts";

import { installTimeControls } from "./time-controls.ts";
import { installAdvanceControls } from "./advance-controls.ts";
import type { ViewController } from "./view-controller.ts";
export function installEnvironmentControls(this: ViewController) {
  for (const key of ["humidity", "light", "randomness"] as const) {
    $(key).addEventListener("input", () => {
      $(key + "-value").textContent = $(key).value + "%";
      $(key).style.setProperty("--range", $(key).value + "%");
    });
    $(key).addEventListener("change", () =>
      this.intervention(key, 0, 0, Number($(key).value)),
    );
  }
  $("rain").onclick = () => {
    this.intervention("rain");
    this.toast(t("controls.rain"));
  };
  $("focus-ecology").onclick = () => {
    if (!this.scene) return;
    this.toast(this.scene.focusEcology());
    $("interior").checked = !!this.scene.showInterior;
    this.updateUi();
    $("viewport").scrollIntoView({ block: "center", behavior: "smooth" });
  };
  installBiologyControls(this.active());
  installGranularControls(this.intervention);
  installCheckpointControls({
    capture: this.getSession,
    apply: (value) => this.applySavedSession(value, true),
    pause: () => {
      this.running = false;
      this.advanceControls?.invalidate();
      this.syncControls();
    },
    save: this.save,
  });
  this.timeControls = installTimeControls(this.clock, () => {
    this.advanceControls?.invalidate();
    this.advancePlan = undefined;
    void this.save();
  });
  this.advanceControls = installAdvanceControls({
    capture: this.getSession,
    plan: () => this.advancePlan,
    apply: (value) => this.applySavedSession(value, true, true),
    pause: () => {
      this.running = false;
      this.forecaster?.cancel();
      this.syncControls();
    },
    save: this.save,
  });
  installLearningControls(this.intervention, this.active);
  installGasControls(this.intervention);
  installClimateControls(this.intervention);
  installSeasonControls(this.intervention);
  installMaterialControls(this.intervention);
  installSurvivalControls(this.intervention);
  installBroodInspection(() => this.scene ?? null, this.toast);
  installSealingControls(() => this.scene ?? null, this.toast);
  const focusStructureButton = $("focus-structure");
  if (focusStructureButton)
    focusStructureButton.onclick = () => {
      if (!this.scene) return;
      this.toast(this.scene.focusStructure());
      $("interior").checked = !!this.scene.showInterior;
      this.updateUi();
      $("viewport").scrollIntoView({ block: "center", behavior: "smooth" });
    };
  $("disturb").onclick = () => {
    this.intervention("collapse");
    this.toast(t("controls.disturb"));
  };
}
