import { bindSpreadsheetCsv } from "./spreadsheet-csv.ts";
import { initializeGalleryPlan } from "./gallery-plan.ts";
import { message, clearMessage, messageSource, t } from "../i18n/runtime.ts";
import { installLocalePicker } from "../i18n/picker.ts";
installLocalePicker();
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
const setCsv = bindSpreadsheetCsv(
  byId<HTMLAnchorElement>("experiment-csv"),
  "dados",
  byId("experiment-csv-canonical-option"),
);
let worker: Worker | null = null,
  urls: string[] = [];
planField.value = JSON.stringify(exampleExperiment(), null, 2);
initializeGalleryPlan(planField);
installParameterEditor(planField);
message(byId("experiment-version"), "experiments.version", {
  version: metadata.version,
});
function clearResult() {
  setCsv(null);
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
function fail(reason: string) {
  finish();
  messageSource(error, reason);
  error.focus();
  message(status, "experiments.incomplete");
}
run.onclick = () => {
  clearResult();
  clearMessage(error);
  try {
    const plan = normalizeExperiment(JSON.parse(planField.value));
    planField.value = JSON.stringify(plan, null, 2);
    run.disabled = true;
    cancel.disabled = false;
    planField.disabled = true;
    progress.max = Math.max(1, plan.days * 100);
    progress.value = 0;
    message(status, "experiments.running");
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
        message(status, "experiments.runningProgress", {
          ticks: value.tick,
          total: value.total,
        });
      } else if (value.type === "error") fail(value.message);
      else {
        finish();
        progress.value = progress.max;
        setCsv(value.result.csv);
        link(
          "experiment-csv-canonical",
          value.result.csv,
          "text/csv;charset=utf-8",
        );
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
        message(status, "experiments.completed", { days: plan.days });
        results.focus();
      }
    };
    activeWorker.onerror = () => {
      if (worker !== activeWorker) return;
      fail(t("experiments.failed"));
    };
    worker.postMessage(plan);
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
  }
};
cancel.onclick = () => {
  finish();
  clearResult();
  message(status, "experiments.cancelled");
  run.focus();
};
window.addEventListener("pagehide", () => {
  finish();
  clearResult();
});
