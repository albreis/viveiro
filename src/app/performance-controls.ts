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
    note.textContent =
      select.value === "light"
        ? "Até 80 operárias desenhadas, priorizando a câmera e a seleção. Sombras desligadas e malha visual reduzida. Todos os agentes continuam simulados. Previsão por contagem é uma aproximação."
        : "Desenho completo e sombras. O perfil altera a apresentação e o método inicial da previsão; a seed e a biologia do experimento são preservadas.";
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
    report.textContent = saved
      ? "Perfil aplicado. Inicie outra medição para comparar."
      : "Perfil aplicado nesta sessão; o navegador não permitiu guardar a preferência.";
  };
  button.onclick = () => {
    if (!scene() || document.hidden) return;
    meter.begin(performance.now());
    button.disabled = true;
    report.textContent = "Medindo durante 10 segundos. Mantenha a aba visível.";
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && button.disabled) {
      cancel();
      report.textContent = "Medição cancelada: a aba ficou oculta.";
    }
  });
  let lastCount = "";
  return {
    frame(now: number) {
      const host = scene();
      if (!host || document.hidden) return;
      const text =
        (host.visibleWorkers?.length ?? 0) +
        " de " +
        host.world.workers.length +
        " operárias desenhadas; todas simuladas.";
      if (text !== lastCount) {
        count.textContent = lastCount = text;
      }
      const result = meter.frame(now, host.renderer.info.render);
      if (!result) return;
      button.disabled = false;
      report.textContent =
        result.fps.toFixed(1) +
        " quadros/s · P95 " +
        result.p95FrameMs.toFixed(1) +
        " ms · " +
        Math.round(result.meanDrawCalls) +
        " chamadas · " +
        Math.round(result.meanTriangles) +
        " triângulos/quadro. Média em " +
        (result.elapsedMs / 1000).toFixed(1) +
        " s; não certifica hardware escolar.";
    },
  };
}
