import { message, messageSource, t } from "../i18n/runtime.ts";
import {
  activeRegistration,
  prepareRegistration,
  workerStatus,
  removeOffline,
} from "../services/offline-client.ts";
export function installOfflineControls() {
  if (import.meta.env.MODE !== "public" || !import.meta.env.PROD) return;
  const panel = document.createElement("section");
  panel.id = "offline-panel";
  panel.className = "panel offline-panel";
  panel.innerHTML = `<h2 data-i18n="interface.offline.title"></h2>
    <p data-i18n="interface.offline.help"></p>
    <p id="offline-status" role="status" data-i18n="interface.offline.check"></p>
    <button id="offline-prepare" type="button" data-i18n="interface.offline.prepare"></button>
    <button id="offline-remove" type="button" hidden data-i18n="interface.offline.remove"></button>
    <p data-i18n="interface.offline.note"></p>`;
  document.getElementById("analysis")!.append(panel);
  const status = panel.querySelector<HTMLParagraphElement>("#offline-status")!;
  const prepare = panel.querySelector<HTMLButtonElement>("#offline-prepare")!;
  const remove = panel.querySelector<HTMLButtonElement>("#offline-remove")!;
  const base = import.meta.env.BASE_URL;
  let busy = false;
  const supported =
    "serviceWorker" in navigator &&
    "caches" in window &&
    window.isSecureContext;
  const render = async () => {
    if (!supported) {
      message(status, "data.offline.unsupported");
      prepare.disabled = true;
      return;
    }
    const registration = await activeRegistration(base);
    remove.hidden = !registration;
    if (registration?.waiting) {
      message(status, "data.offline.update");
      return;
    }
    const value = registration?.active
      ? await workerStatus(registration.active)
      : undefined;
    message(
      status,
      value?.ready ? "data.offline.ready" : "data.offline.notReady",
      { files: value?.files ?? 0 },
    );
    prepare.hidden = !!value?.ready;
  };
  const action = (fn: () => Promise<unknown>) => async () => {
    if (busy) return;
    busy = true;
    prepare.disabled = remove.disabled = true;
    message(status, "data.offline.preparing");
    try {
      await fn();
      await render();
    } catch (error) {
      messageSource(
        status,
        error instanceof Error ? error.message : t("data.offline.failed"),
      );
    } finally {
      busy = false;
      prepare.disabled = remove.disabled = false;
    }
  };
  prepare.onclick = action(() => prepareRegistration(base));
  remove.onclick = action(async () => {
    await removeOffline(base);
    prepare.hidden = false;
  });
  void render().catch(() => {
    message(status, "data.offline.checkFailed");
  });
}
