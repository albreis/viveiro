import { locale, t, message } from "../i18n/runtime.ts";
import { performanceMarkup } from "./performance-markup.ts";
import { FrameMeasurement } from "../modules/renderer/frame-measurement.ts";
import {
  renderProfile,
  type PerformanceMode,
} from "../modules/renderer/performance-profile.ts";
import {
  readPerformanceMode,
  writePerformanceMode,
} from "../services/performance-preference.ts";
import type { ForecastClient } from "../services/forecast-client.ts";

interface Scene {
  setPerformanceMode(mode: PerformanceMode): void;
  renderer: { info: { render: { calls: number; triangles: number } } };
  visibleWorkers?: unknown[];
  world: { workers: unknown[] };
}
export function installPerformanceControls(
  scene: () => Scene | undefined,
  forecast: ForecastClient,
) {
  const panel = document.createElement("section");
  panel.className = "panel performance-panel";
  panel.id = "performance-panel";
  panel.innerHTML = performanceMarkup;
  document.querySelector(".scene-card")!.after(panel);
  const select = panel.querySelector<HTMLSelectElement>("#render-profile")!;
  const button = panel.querySelector<HTMLButtonElement>("#measure-frames")!;
  const note = panel.querySelector("#render-profile-note")!;
  const count = panel.querySelector("#render-count")!;
  const report = panel.querySelector("#frame-report")!;
  const meter = new FrameMeasurement();
  const describe = () => {
    message(
      note,
      select.value === "light"
        ? "execution.performance.light"
        : "execution.performance.full",
    );
  };
  select.value = readPerformanceMode();
  describe();
  const cancel = () => {
    meter.cancel();
    button.disabled = false;
  };
  select.onchange = () => {
    cancel();
    const profile = renderProfile(select.value);
    scene()?.setPerformanceMode(profile.mode);
    const saved = writePerformanceMode(profile.mode);
    forecast.options.observation = profile.forecast;
    document.querySelector<HTMLSelectElement>("#forecast-observation")!.value =
      profile.forecast;
    forecast.invalidate();
    describe();
    message(
      report,
      saved ? "execution.performance.applied" : "execution.performance.unsaved",
    );
  };
  button.onclick = () => {
    if (!scene() || document.hidden) return;
    meter.begin(performance.now());
    button.disabled = true;
    message(report, "execution.performance.measuring");
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && button.disabled) {
      cancel();
      message(report, "execution.performance.cancelled");
    }
  });
  let lastCount = "";
  return {
    frame(now: number) {
      const host = scene();
      if (!host || document.hidden) return;
      const text = t("execution.performance.count", {
        visible: host.visibleWorkers?.length ?? 0,
        total: host.world.workers.length,
      });
      if (text !== lastCount) {
        count.textContent = lastCount = text;
      }
      const result = meter.frame(now, host.renderer.info.render);
      if (!result) return;
      button.disabled = false;
      message(report, "execution.performance.report", {
        fps: locale.number(result.fps, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }),
        p95: locale.number(result.p95FrameMs, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }),
        calls: Math.round(result.meanDrawCalls),
        triangles: Math.round(result.meanTriangles),
        seconds: locale.number(result.elapsedMs / 1000, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }),
      });
    },
  };
}
