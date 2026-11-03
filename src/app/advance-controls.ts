import { locale, t, message, messageSource } from "../i18n/runtime.ts";
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
        messageSource(status, error);
        return;
      }
      if (p) {
        bar.max = p.totalTicks;
        bar.value = p.doneTicks;
        message(status, "execution.advance.calculating", {
          done: (p.doneTicks / 100).toFixed(2),
          total: (p.totalTicks / 100).toFixed(2),
        });
      }
    },
    (outcome) => void finish(outcome),
  );
  const finish = async (outcome: AdvanceOutcome) => {
    const token = generation;
    try {
      cancel.disabled = true;
      message(status, "execution.advance.applying");
      context.apply(outcome.session);
      await context.save();
      if (token !== generation) return;
      bar.max = outcome.progress.totalTicks;
      bar.value = outcome.progress.doneTicks;
      messageSource(
        status,
        t(
          outcome.complete
            ? "execution.advance.complete"
            : "execution.advance.limit",
        ) +
          t("execution.advance.result", {
            days: (outcome.progress.doneTicks / 100).toFixed(2),
          }) +
          (outcome.complete ? "" : t("execution.advance.resumeHelp")),
      );
    } catch (error) {
      messageSource(
        status,
        error instanceof Error ? error.message : t("execution.advance.failed"),
      );
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
    message(
      start,
      plan ? "execution.advance.resume" : "interface.advance.run",
      {
        day: locale.number((plan?.targetTick ?? 0) / 100, {
          maximumFractionDigits: 1,
        }),
      },
    );
    days.disabled = !!plan;
  };
  const invalidate = (message?: string) => {
    generation++;
    client.cancel();
    if (busy)
      messageSource(status, message ?? t("execution.advance.cancelled"));
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
      message(status, "execution.advance.days");
      return;
    }
    context.pause();
    const token = ++generation;
    setBusy(true);
    bar.value = 0;
    message(status, "execution.advance.preserving");
    try {
      const source = context.capture();
      const saved = await checkpointStore.save(
        source,
        "Antes do avanço · D" + (source.world.tick / 100).toFixed(2),
        "manual",
      );
      if (token !== generation) return;
      if (!saved.ok || saved.backend !== "indexedDB")
        throw Error(t("execution.advance.checkpoint"));
      message(status, "execution.advance.running");
      client.start(source, { days: count, budgetMs: Number(budget.value) });
    } catch (error) {
      if (token === generation) {
        setBusy(false);
        messageSource(
          status,
          error instanceof Error
            ? error.message
            : t("execution.advance.unavailable"),
        );
      }
    }
  };
  if (import.meta.hot) import.meta.hot.dispose(() => invalidate());
  return { invalidate, refresh };
}
