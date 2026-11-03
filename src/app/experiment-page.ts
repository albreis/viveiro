import { installParameterEditor } from "./parameter-profile-editor.ts";
import "./policy-picker.ts";
import "./sweep-page.ts";
import {
  exampleExperiment,
  normalizeExperiment,
} from "../modules/experiments/plan.ts";
import type { ExperimentResponse } from "../modules/experiments/messages.ts";
import metadata from "../../package.json" with { type: "json" };
const byId = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const planField = byId<HTMLTextAreaElement>("experiment-plan"),
  run = byId<HTMLButtonElement>("experiment-run"),
  cancel = byId<HTMLButtonElement>("experiment-cancel"),
  status = byId("experiment-status"),
  error = byId("experiment-error"),
  progress = byId<HTMLProgressElement>("experiment-progress"),
  results = byId("experiment-results");
let worker: Worker | null = null,
  urls: string[] = [];
planField.value = JSON.stringify(exampleExperiment(), null, 2);
installParameterEditor(planField);
byId("experiment-version").textContent =
  "Viveiro " + metadata.version + " · Modelo exploratório";
function clearResult() {
  for (const url of urls) URL.revokeObjectURL(url);
  urls = [];
  results.hidden = true;
}
function link(id: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  urls.push(url);
  byId<HTMLAnchorElement>(id).href = url;
}
function finish() {
  worker?.terminate();
  worker = null;
  run.disabled = false;
  cancel.disabled = true;
  planField.disabled = false;
}
function fail(message: string) {
  finish();
  error.textContent = message;
  error.focus();
  status.textContent =
    "Execução não concluída; nenhum resultado parcial foi exportado.";
}
run.onclick = () => {
  clearResult();
  error.textContent = "";
  try {
    const plan = normalizeExperiment(JSON.parse(planField.value));
    planField.value = JSON.stringify(plan, null, 2);
    run.disabled = true;
    cancel.disabled = false;
    planField.disabled = true;
    progress.max = Math.max(1, plan.days * 100);
    progress.value = 0;
    status.textContent = "Executando o experimento…";
    const activeWorker = new Worker(
      new URL("../workers/experiment.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker = activeWorker;
    activeWorker.onmessage = (event: MessageEvent<ExperimentResponse>) => {
      if (worker !== activeWorker) return;
      const value = event.data;
      if (value.type === "progress") {
        progress.value = value.tick;
        status.textContent = `${value.tick} de ${value.total} ticks concluídos.`;
      } else if (value.type === "error") fail(value.message);
      else {
        finish();
        progress.value = progress.max;
        link("experiment-csv", value.result.csv, "text/csv;charset=utf-8");
        link(
          "experiment-manifest",
          value.result.manifest,
          "application/json;charset=utf-8",
        );
        link(
          "experiment-config",
          JSON.stringify(plan, null, 2) + "\n",
          "application/json;charset=utf-8",
        );
        results.hidden = false;
        status.textContent = `Concluído: ${plan.days} dias do modelo, sem alterar seu terrário salvo.`;
        results.focus();
      }
    };
    activeWorker.onerror = () => {
      if (worker !== activeWorker) return;
      fail(
        "Não foi possível executar o modelo. Confira a configuração e tente novamente.",
      );
    };
    worker.postMessage(plan);
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
  }
};
cancel.onclick = () => {
  finish();
  clearResult();
  status.textContent =
    "Experimento cancelado. Seu terrário salvo não foi alterado.";
  run.focus();
};
window.addEventListener("pagehide", () => {
  finish();
  clearResult();
});
