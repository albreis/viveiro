import { exampleSweep, normalizeSweep } from "../modules/sweeps/plan.ts";
import { sweepJobs } from "../modules/sweeps/jobs.ts";
import {
  validateCheckpoint,
  type SweepCheckpoint,
} from "../modules/sweeps/checkpoint.ts";
import { runSweep } from "../modules/sweeps/run.ts";
import { browserExperiment } from "../services/experiment-worker.ts";
import { SweepDownloads } from "./sweep-downloads.ts";
const byId = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const field = byId<HTMLTextAreaElement>("sweep-plan"),
  run = byId<HTMLButtonElement>("sweep-run"),
  cancel = byId<HTMLButtonElement>("sweep-cancel"),
  reset = byId<HTMLButtonElement>("sweep-reset"),
  file = byId<HTMLInputElement>("sweep-import"),
  parallel = byId<HTMLSelectElement>("sweep-jobs"),
  progress = byId<HTMLProgressElement>("sweep-progress"),
  status = byId("sweep-status"),
  error = byId("sweep-error"),
  downloads = new SweepDownloads();
let current: SweepCheckpoint | undefined,
  controller: AbortController | null = null,
  importing = false;
field.value = JSON.stringify(exampleSweep(), null, 2);
function busy(active: boolean) {
  field.disabled =
    run.disabled =
    reset.disabled =
    file.disabled =
    parallel.disabled =
      active;
  cancel.disabled = !active;
}
function fail(e: unknown) {
  error.textContent = e instanceof Error ? e.message : String(e);
  error.focus();
}
function show(c: SweepCheckpoint) {
  current = c;
  progress.max = c.plan.values.length * c.plan.replicates;
  progress.value = c.results.length;
  status.textContent = `${c.results.length} de ${progress.max} execuções concluídas. Baixe a retomada para guardar os resultados.`;
  void downloads.update(c).catch(fail);
}
run.onclick = async () => {
  if (controller || importing) return;
  error.textContent = "";
  try {
    const plan = normalizeSweep(JSON.parse(field.value));
    const count = plan.values.length * plan.replicates;
    if (count > 200 || count * (plan.base.days + 1) > 10000)
      throw Error(
        "No navegador: até 200 execuções e 10.000 observações diárias previstas. Use a CLI para planos maiores.",
      );
    field.value = JSON.stringify(plan, null, 2);
    const active = new AbortController();
    controller = active;
    busy(true);
    try {
      await runSweep(plan, {
        concurrency: Number(parallel.value),
        signal: active.signal,
        checkpoint: current,
        execute: (job, signal) => browserExperiment(job.plan, signal),
        progress: (c) => {
          if (controller === active) show(c);
        },
      });
      if (controller === active)
        status.textContent = `Varredura concluída: ${count} execuções, sem alterar seu terrário salvo.`;
    } catch (e) {
      if (active.signal.aborted)
        status.textContent = `Interrompida com ${current?.results.length ?? 0} execuções completas preservadas. Continue aqui ou baixe a retomada.`;
      else fail(e);
    } finally {
      if (controller === active) {
        controller = null;
        busy(false);
      }
    }
  } catch (e) {
    fail(e);
  }
};
cancel.onclick = () => controller?.abort();
reset.onclick = () => {
  current = undefined;
  downloads.clear();
  progress.value = 0;
  status.textContent =
    "Resultados removidos desta página. Configuração e arquivos já baixados preservados.";
  error.textContent = "";
};
file.onchange = async () => {
  const selected = file.files?.[0];
  if (!selected || controller) return;
  importing = true;
  busy(true);
  error.textContent = "";
  try {
    if (selected.size > 20 * 1024 * 1024)
      throw Error("Arquivo de retomada excede 20 MiB.");
    const raw = JSON.parse((await selected.text()).replace(/^\uFEFF/, "")),
      plan = normalizeSweep(raw.plan);
    const c = await validateCheckpoint(raw, plan, await sweepJobs(plan));
    field.value = JSON.stringify(plan, null, 2);
    show(c);
  } catch (e) {
    fail(e);
  } finally {
    importing = false;
    busy(false);
    file.value = "";
  }
};
window.addEventListener("pagehide", () => {
  controller?.abort();
  downloads.clear();
});
