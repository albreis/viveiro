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
  panel.innerHTML = `<h2>Leve o laboratório com você.</h2>
    <p>Prepare esta versão para abrir sem rede. Experimentos continuam neste navegador; exporte seu JSON para guardar outra cópia.</p>
    <p id="offline-status" role="status">Conferindo esta versão…</p>
    <button id="offline-prepare" type="button">Preparar para usar sem rede</button>
    <button id="offline-remove" type="button" hidden>Remover cópia offline</button>
    <p>Depois de preparar, abra este mesmo endereço. A instalação como aplicativo depende do menu do navegador. O Site privado continua online.</p>`;
  document.querySelector(".scene-card")!.after(panel);
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
      status.textContent =
        "Este navegador não oferece o modo offline aqui. O laboratório continua disponível online.";
      prepare.disabled = true;
      return;
    }
    const registration = await activeRegistration(base);
    remove.hidden = !registration;
    if (registration?.waiting) {
      status.textContent =
        "Atualização pronta. Feche as abas desta versão para ativar, depois reabra o endereço.";
      return;
    }
    const value = registration?.active
      ? await workerStatus(registration.active)
      : undefined;
    status.textContent = value?.ready
      ? "Pronto para abrir sem rede · " +
        value.files +
        " arquivos desta versão. Checkpoints ficam no navegador."
      : "Esta versão ainda precisa ser preparada enquanto houver conexão.";
    prepare.hidden = !!value?.ready;
  };
  const action = (fn: () => Promise<unknown>) => async () => {
    if (busy) return;
    busy = true;
    prepare.disabled = remove.disabled = true;
    status.textContent =
      "Preparando os arquivos desta versão. Mantenha esta aba aberta…";
    try {
      await fn();
      await render();
    } catch (error) {
      status.textContent =
        error instanceof Error
          ? error.message
          : "Não foi possível preparar a cópia offline.";
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
    status.textContent =
      "Não foi possível conferir a cópia offline. Você pode tentar preparar novamente.";
  });
}
