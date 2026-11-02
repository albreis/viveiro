import { checkpointStore } from "../services/session-store.ts";
import { AdvanceClient } from "../services/advance-client.ts";
import type { SessionState } from "../modules/persistence/types.ts";
import type { AdvanceOutcome } from "../modules/time/advance-types.ts";
export interface AdvanceContext {
  capture(): SessionState;
  plan(): SessionState["advance"];
  apply(s: SessionState): void;
  pause(): void;
  save(): Promise<void>;
}
const get = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
export function installAdvanceControls(context: AdvanceContext) {
  const start = get<HTMLButtonElement>("advance-start"),
    cancel = get<HTMLButtonElement>("advance-cancel"),
    days = get<HTMLInputElement>("advance-days"),
    budget = get<HTMLSelectElement>("advance-budget"),
    status = get("advance-status"),
    bar = get<HTMLProgressElement>("advance-progress");
  let busy = false,
    generation = 0;
  const setBusy = (value: boolean) => {
    busy = value;
    start.disabled = days.disabled = budget.disabled = value;
    cancel.disabled = !value;
  };
  const client = new AdvanceClient(
    () =>
      new Worker(new URL("../workers/advance.worker.ts", import.meta.url), {
        type: "module",
      }),
    (p, error) => {
      if (error) {
        setBusy(false);
        status.textContent = error;
        return;
      }
      if (p) {
        bar.max = p.totalTicks;
        bar.value = p.doneTicks;
        status.textContent =
          "Calculando: " +
          (p.doneTicks / 100).toFixed(2) +
          " de " +
          (p.totalTicks / 100).toFixed(2) +
          " dias; nenhum resultado aplicado ainda.";
      }
    },
    (outcome) => void finish(outcome),
  );
  const finish = async (outcome: AdvanceOutcome) => {
    const token = generation;
    try {
      cancel.disabled = true;
      status.textContent = "Aplicando os passos concluídos e salvando…";
      context.apply(outcome.session);
      await context.save();
      if (token !== generation) return;
      bar.max = outcome.progress.totalTicks;
      bar.value = outcome.progress.doneTicks;
      status.textContent =
        (outcome.complete
          ? "Avanço concluído. "
          : "Limite de processamento atingido. ") +
        (outcome.progress.doneTicks / 100).toFixed(2) +
        " dias aplicados; terrário em pausa. " +
        (outcome.complete ? "" : "Retome para concluir o destino salvo.");
    } catch (error) {
      status.textContent =
        error instanceof Error
          ? error.message
          : "O avanço não pôde ser aplicado.";
    } finally {
      if (token === generation) {
        setBusy(false);
        refresh();
      }
    }
  };
  const refresh = () => {
    if (busy) return;
    const plan = context.plan();
    start.textContent = plan
      ? "Retomar até o dia " +
        (plan.targetTick / 100).toLocaleString("pt-BR", {
          maximumFractionDigits: 1,
        })
      : "Avançar dias";
    days.disabled = !!plan;
  };
  const invalidate = (message?: string) => {
    generation++;
    client.cancel();
    if (busy)
      status.textContent =
        message ?? "Avanço cancelado. O cálculo não aplicado foi descartado.";
    setBusy(false);
  };
  cancel.onclick = () => {
    invalidate();
    refresh();
  };
  start.onclick = async () => {
    if (busy) return;
    const count = Number(days.value);
    if (!Number.isInteger(count) || count < 1 || count > 365) {
      status.textContent = "Escolha um número inteiro de 1 a 365 dias.";
      return;
    }
    context.pause();
    const token = ++generation;
    setBusy(true);
    bar.value = 0;
    status.textContent = "Preservando o estado anterior…";
    try {
      const source = context.capture();
      const saved = await checkpointStore.save(
        source,
        "Antes do avanço · D" + (source.world.tick / 100).toFixed(2),
        "manual",
      );
      if (token !== generation) return;
      if (!saved.ok || saved.backend !== "indexedDB")
        throw Error(
          "O checkpoint anterior não pôde ser preservado no banco. O avanço não foi iniciado.",
        );
      status.textContent = "Calculando os próximos dias…";
      client.start(source, { days: count, budgetMs: Number(budget.value) });
    } catch (error) {
      if (token === generation) {
        setBusy(false);
        status.textContent =
          error instanceof Error ? error.message : "Avanço indisponível.";
      }
    }
  };
  if (import.meta.hot) import.meta.hot.dispose(() => invalidate());
  return { invalidate, refresh };
}
