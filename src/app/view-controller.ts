import { element as $ } from "./dom-elements.ts";
import { message as setMessage, messageAttribute } from "../i18n/runtime.ts";
import { renderChartSummary } from "./chart-summary.ts";
import { observeCounts } from "../modules/forecast/observations.ts";
import { renderForecast } from "./forecast-panel.ts";
import { presentFamily } from "../modules/colonies/presentation.ts";
import { renderStatus } from "./status-view.ts";
import { SessionController } from "./session-controller.ts";
export class ViewController extends SessionController {
  syncControls = () => {
    for (const key of ["humidity", "light", "randomness"] as const) {
      $(key).value = String(this.world.params[key]);
      $(key + "-value").textContent = this.world.params[key] + "%";
      $(key).style.setProperty("--range", this.world.params[key] + "%");
    }
    $("seed").value = this.initial.seed;
    $("play").textContent = this.running ? "Ⅱ" : "▶";
    messageAttribute(
      $("play"),
      "aria-label",
      this.running ? "terrarium.pause" : "controls.resume",
    );
    setMessage(
      $("status-text"),
      this.running ? "terrarium.status.live" : "controls.paused",
    );
    $("resume-overlay").hidden = this.running;
    $("comparison-panel").hidden = !this.comparison;
    $("chart-b-legend").hidden = !this.comparison;
    $("chart-comparison-legend").hidden = !this.comparison;
    setMessage(
      $("compare").querySelector("[data-i18n]")!,
      this.comparison ? "controls.comparison.end" : "terrarium.comparison.run",
    );
    document
      .querySelectorAll<HTMLButtonElement>("[data-scenario]")
      .forEach((b) => {
        b.classList.toggle("active", b.dataset.scenario === this.scenario);
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.scenario === this.scenario),
        );
      });
  };
  updateUi = () => {
    renderChartSummary(this.world, this.comparison);
    this.dailyControls?.render();
    this.timeControls?.render();
    this.advanceControls?.refresh();
    renderStatus(
      {
        world: presentFamily(this.world),
        comparison: this.comparison ? presentFamily(this.comparison) : null,
        scenario: this.scenario,
        current: presentFamily(this.active()),
      },
      this.updateAntCamera,
    );
    if (this.forecaster)
      renderForecast(
        this.forecaster.state,
        this.scenario,
        this.forecaster.options,
      );
    this.lessonControls?.render(this.lesson, this.interventions.length);
  };
  configureAntCamera = () => {
    this.antCamera.configureScene();
  };
  updateAntCamera = () => {
    this.antCamera.render();
  };
  forecastSource = () => {
    return this.forecaster?.options.observation === "counts"
      ? observeCounts(this.active())
      : this.active().snapshot();
  };
  handleError = (error: unknown) => {
    console.error(error);
    const loading = $("loading");
    loading.hidden = false;
    loading.replaceChildren();
    const title = document.createElement("strong"),
      message = document.createElement("span");
    setMessage(title, "controls.webgl.title");
    setMessage(message, "controls.webgl.help");
    loading.append(title, message);
  };
}
