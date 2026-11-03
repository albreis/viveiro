import { restoreLiveWorld } from "./runtime-world.ts";
import type { MessageKey } from "../i18n/catalogs.ts";
import { element as $ } from "./dom-elements.ts";
import { t, message as setMessage } from "../i18n/runtime.ts";

import type { ViewController } from "./view-controller.ts";
const toolMessages: Record<string, MessageKey> = {
  food: "controls.tool.food",
  plant: "controls.tool.plant",
  predator: "controls.tool.predator",
  scent: "controls.tool.scent",
};
export function installExperimentsControls(this: ViewController) {
  $("play").onclick = () => {
    this.advanceControls?.invalidate();
    this.advancePlan = undefined;
    this.running = !this.running;
    this.previous = performance.now();
    this.syncControls();
    this.save();
  };
  $("resume-overlay").onclick = () => {
    if (!this.running) $("play").click();
  };
  document.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach(
    (button) =>
      (button.onclick = () => {
        if (!this.scene) return;
        const tool =
          this.scene.tool === button.dataset.tool
            ? null
            : (button.dataset.tool ?? null);
        this.scene.setTool(tool);
        document
          .querySelectorAll<HTMLButtonElement>("[data-tool]")
          .forEach((b) => {
            const selected = b.dataset.tool === tool;
            b.classList.toggle("active", selected);
            b.setAttribute("aria-pressed", String(selected));
          });
        setMessage(
          $("tool-hint"),
          tool
            ? (toolMessages[tool] ?? "terrarium.tools.help")
            : "terrarium.tools.help",
        );
        setMessage(
          $("scene-guide"),
          tool ? "controls.camera.place" : "terrarium.camera.guide",
        );
      }),
  );
  $("trails").onchange = () => {
    if (this.scene) this.scene.showTrails = $("trails").checked;
  };
  $("new-world").onclick = () => {
    const seed = "SEMENTE-" + Math.floor(Date.now() % 100000);
    this.reset(seed, { ...this.world.params });
    this.toast(t("controls.new"));
  };
  $("apply-seed").onclick = () => {
    const seed = $("seed").value.trim();
    if (seed) this.reset(seed, { ...this.world.params });
  };
  $("seed").onkeydown = (e) => {
    if (e.key === "Enter") $("apply-seed").click();
  };
  $("replay").onclick = () => {
    this.reset(this.initial.seed, this.initial.params, true);
    this.toast(t("controls.replay"));
  };
  $("compare").onclick = () => {
    this.advanceControls?.invalidate();
    this.advancePlan = undefined;
    if (this.comparison) {
      this.comparison = null;
      this.scenario = "a";
      this.toast(t("controls.comparison.stopped"));
    } else {
      this.comparison = restoreLiveWorld(this.world.snapshot());
      this.comparison.params.humidity = Math.min(
        100,
        this.comparison.params.humidity + 1,
      );
      this.comparison.log("Cenário B: umidade aumentada em 1 ponto.");
      this.toast(t("controls.comparison.started"));
    }
    this.forecaster?.invalidate();
    this.syncControls();
    this.updateUi();
    this.save();
  };
  document.querySelectorAll<HTMLButtonElement>("[data-scenario]").forEach(
    (button) =>
      (button.onclick = () => {
        this.advanceControls?.invalidate();
        const scenario = button.dataset.scenario;
        if (scenario !== "a" && scenario !== "b") return;
        this.scenario = scenario;
        this.forecaster?.invalidate();
        this.syncControls();
        this.updateUi();
      }),
  );
}
