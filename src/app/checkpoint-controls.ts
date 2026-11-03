import { locale, t, message, messageSource } from "../i18n/runtime.ts";
import { checkpointStore } from "../services/session-store.ts";
import { parseExperiment } from "../modules/persistence/codec.ts";
import { normalizeSession } from "../modules/persistence/validation.ts";
import type { SessionState } from "../modules/persistence/types.ts";
interface CheckpointContext {
  capture(): unknown;
  apply(session: SessionState): void;
  pause(): void;
  save(): Promise<void>;
}
export function installCheckpointControls(context: CheckpointContext) {
  const create = document.getElementById(
      "create-checkpoint",
    ) as HTMLButtonElement | null,
    list = document.getElementById(
      "checkpoint-list",
    ) as HTMLSelectElement | null,
    restore = document.getElementById(
      "restore-checkpoint",
    ) as HTMLButtonElement | null,
    name = document.getElementById(
      "checkpoint-name",
    ) as HTMLInputElement | null,
    input = document.getElementById(
      "import-experiment",
    ) as HTMLInputElement | null,
    importButton = document.getElementById(
      "import-checkpoint",
    ) as HTMLButtonElement | null,
    status = document.getElementById("checkpoint-status");
  if (
    !create ||
    !list ||
    !restore ||
    !name ||
    !input ||
    !importButton ||
    !status
  )
    return;
  let busy = false;
  const setBusy = (value: boolean) => {
    busy = value;
    create.disabled = value;
    importButton.disabled = value;
    restore.disabled = value || !list.value;
  };
  const refresh = async () => {
    try {
      const items = await checkpointStore.list(),
        selected = list.value;
      list.replaceChildren(
        ...items.map((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent =
            (item.kind === "manual" ? "★ " : "") +
            (item.kind === "auto" ? t("checkpoints.auto") : item.label) +
            " · D" +
            (item.tick / 100).toFixed(1) +
            " · " +
            new Date(item.createdAt).toLocaleString(locale.locale, {
              timeZone: "America/Sao_Paulo",
              dateStyle: "short",
              timeStyle: "short",
            });
          return option;
        }),
      );
      if (items.some((i) => i.id === selected)) list.value = selected;
    } catch {
      list.replaceChildren();
    }
    restore.disabled = busy || !list.value;
  };
  list.onchange = () => {
    restore.disabled = busy || !list.value;
  };
  const beforeRestore = async () => {
    context.pause();
    if (checkpointStore.isProtected()) return;
    const prior = normalizeSession(context.capture()),
      saved = await checkpointStore.save(
        prior,
        "Antes de recuperar · D" + (prior.world.tick / 100).toFixed(1),
        "manual",
      );
    if (!saved.ok || saved.backend !== "indexedDB")
      throw new Error(t("checkpoints.beforeFailed"));
  };
  create.onclick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const session = normalizeSession(context.capture()),
        label =
          name.value.trim() || "Dia " + (session.world.tick / 100).toFixed(1),
        result = await checkpointStore.save(session, label, "manual");
      messageSource(
        status,
        result.message ||
          t(result.ok ? "checkpoints.created" : "checkpoints.createFailed"),
      );
      if (result.ok) name.value = "";
      await refresh();
    } catch (error) {
      messageSource(
        status,
        error instanceof Error ? error.message : t("checkpoints.unavailable"),
      );
    } finally {
      setBusy(false);
    }
  };
  restore.onclick = async () => {
    if (busy || !list.value) return;
    setBusy(true);
    try {
      const candidate = await checkpointStore.restore(list.value);
      await beforeRestore();
      context.apply(candidate);
      checkpointStore.allowWrites();
      await context.save();
      message(status, "checkpoints.restored");
      await refresh();
    } catch (error) {
      messageSource(
        status,
        error instanceof Error ? error.message : t("checkpoints.restoreFailed"),
      );
    } finally {
      setBusy(false);
    }
  };
  importButton.onclick = () => input.click();
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file || busy) return;
    setBusy(true);
    try {
      if (file.size > 20000000) throw new Error(t("checkpoints.fileLimit"));
      const candidate = parseExperiment(await file.text());
      await beforeRestore();
      context.apply(candidate);
      checkpointStore.allowWrites();
      await context.save();
      message(status, "checkpoints.imported");
      await refresh();
    } catch (error) {
      messageSource(
        status,
        error instanceof Error ? error.message : t("checkpoints.invalid"),
      );
    } finally {
      input.value = "";
      setBusy(false);
    }
  };
  document.addEventListener("viveiro:saved", () => {
    if (!busy && document.activeElement !== list) void refresh();
  });
  const stopLocale = locale.subscribe(() => {
    if (!busy) void refresh();
  });
  window.addEventListener("pagehide", stopLocale, { once: true });
  void refresh();
}
