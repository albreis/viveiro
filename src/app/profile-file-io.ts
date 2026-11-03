import {
  profileJson,
  type ParameterProfile,
} from "../modules/parameter-profiles/profile.ts";
import { saveParameterProfile } from "../services/parameter-profile-store.ts";
interface ProfileFiles {
  exportButton: HTMLElement;
  importer: HTMLInputElement;
  read(): ParameterProfile;
  loaded(profile: ParameterProfile): void;
  status: HTMLElement;
  error: HTMLElement;
}
export function installProfileFiles(ui: ProfileFiles) {
  let url: string | null = null,
    revision = 0;
  const fail = (e: unknown) => {
    ui.error.textContent = e instanceof Error ? e.message : String(e);
    ui.error.focus();
  };
  ui.exportButton.onclick = () => {
    try {
      ui.error.textContent = "";
      const p = ui.read();
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(
        new Blob([profileJson(p)], { type: "application/json;charset=utf-8" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = p.id + "-v" + p.version + ".json";
      a.click();
      ui.status.textContent =
        "Perfil exportado. Guarde também a seed e a versão do Viveiro para reproduzir.";
    } catch (e) {
      fail(e);
    }
  };
  ui.importer.onchange = async () => {
    const current = ++revision;
    try {
      ui.error.textContent = "";
      const file = ui.importer.files?.[0];
      if (!file) return;
      if (file.size > 65536) throw Error("Perfil excede 64KiB.");
      const text = await file.text();
      if (current !== revision) return;
      const p = saveParameterProfile(JSON.parse(text.replace(/^\uFEFF/, "")));
      ui.loaded(p);
      ui.status.textContent =
        "Perfil importado e guardado. Aplique para executar com esses valores.";
    } catch (e) {
      if (current === revision) fail(e);
    } finally {
      if (current === revision) ui.importer.value = "";
    }
  };
  window.addEventListener(
    "pagehide",
    () => {
      revision++;
      if (url) URL.revokeObjectURL(url);
    },
    { once: true },
  );
}
