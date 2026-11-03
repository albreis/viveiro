import { installProfileFiles } from "./profile-file-io.ts";
import { normalizeExperiment } from "../modules/experiments/plan.ts";
import { normalizeSweep } from "../modules/sweeps/plan.ts";
import {
  normalizeParameterProfile,
  parameterProfileKey,
  type ParameterProfile,
} from "../modules/parameter-profiles/profile.ts";
import {
  checkParameterProfileVersion,
  readParameterProfiles,
  saveParameterProfile,
} from "../services/parameter-profile-store.ts";
import {
  biologicalProfiles,
  biologicalReferenceFromKey,
} from "../modules/biology/catalog.ts";
import { parameterFields } from "./parameter-fields.ts";
import { profileEditorTemplate } from "./profile-editor-template.ts";
export function installParameterEditor(planField: HTMLTextAreaElement) {
  const host = document.createElement("div");
  host.innerHTML = profileEditorTemplate;
  const panel = host.firstElementChild as HTMLElement;
  (
    document.querySelector('label[for="experiment-policy"]') ?? planField
  ).before(panel);
  const byId = <T extends HTMLElement>(id: string) =>
    panel.querySelector("#" + id) as T;
  const form = byId<HTMLFormElement>("parameter-profile-form"),
    fields = parameterFields(byId("parameter-fields"));
  const id = byId<HTMLInputElement>("profile-id"),
    version = byId<HTMLInputElement>("profile-version"),
    label = byId<HTMLInputElement>("profile-label");
  const biology = byId<HTMLSelectElement>("profile-biology"),
    library = byId<HTMLSelectElement>("profile-library"),
    status = byId("profile-status"),
    error = byId("profile-error");
  for (const p of biologicalProfiles) {
    const o = document.createElement("option");
    o.value = p.id + "@" + p.version;
    o.textContent = p.label + " · " + o.value;
    biology.append(o);
  }
  const safe = (action: () => void) => {
    try {
      error.textContent = "";
      action();
    } catch (e) {
      error.textContent = e instanceof Error ? e.message : String(e);
      error.focus();
    }
  };
  const current = () => {
    if (!form.reportValidity())
      throw Error("Confira os campos do perfil antes de continuar.");
    return checkParameterProfileVersion({
      schema: "viveiro-parameter-profile-v1",
      catalogVersion: 1,
      id: id.value,
      version: Number(version.value),
      label: label.value,
      biologicalProfile: biologicalReferenceFromKey(biology.value),
      parameters: fields.read(),
    });
  };
  const load = (p: ParameterProfile) => {
    id.value = p.id;
    version.value = String(p.version);
    label.value = p.label;
    biology.value = p.biologicalProfile.id + "@" + p.biologicalProfile.version;
    fields.write(p.parameters);
  };
  const fromPlan = () => {
    const plan = normalizeExperiment(JSON.parse(planField.value));
    load(
      normalizeParameterProfile({
        schema: "viveiro-parameter-profile-v1",
        catalogVersion: 1,
        id: id.value,
        version: Number(version.value),
        label: label.value,
        ...plan.parameterProfile,
        biologicalProfile: plan.biologicalProfile,
        parameters: plan.parameters,
      }),
    );
  };
  const refresh = () => {
    library.replaceChildren();
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Escolha uma versão";
    library.append(empty);
    for (const p of readParameterProfiles()) {
      const o = document.createElement("option");
      o.value = parameterProfileKey(p);
      o.textContent = p.label + " · " + o.value;
      library.append(o);
    }
  };
  const apply = () => {
    if (planField.disabled)
      throw Error("Aguarde ou cancele o experimento antes de alterar o plano.");
    const p = current(),
      plan = normalizeExperiment({
        ...normalizeExperiment(JSON.parse(planField.value)),
        parameters: p.parameters,
        biologicalProfile: p.biologicalProfile,
        parameterProfile: p,
      });
    planField.value = JSON.stringify(plan, null, 2);
    planField.dispatchEvent(new Event("input", { bubbles: true }));
    status.textContent =
      "Perfil " +
      parameterProfileKey(p) +
      " aplicado. A seed e a duração do experimento foram preservadas.";
  };
  byId("profile-apply").onclick = () => safe(apply);
  form.onsubmit = (e) => {
    e.preventDefault();
    safe(apply);
  };
  byId("profile-from-plan").onclick = () =>
    safe(() => {
      fromPlan();
      status.textContent = "Valores atuais do plano lidos no editor.";
    });
  byId("profile-save").onclick = () =>
    safe(() => {
      const p = saveParameterProfile(current());
      refresh();
      library.value = parameterProfileKey(p);
      status.textContent =
        "Versão " + parameterProfileKey(p) + " guardada neste navegador.";
    });
  byId("profile-sweep").onclick = () =>
    safe(() => {
      const field = document.getElementById(
        "sweep-plan",
      ) as HTMLTextAreaElement;
      if (field.disabled)
        throw Error("Interrompa a varredura antes de mudar sua base.");
      const p = current(),
        sweep = normalizeSweep(JSON.parse(field.value));
      field.value = JSON.stringify(
        normalizeSweep({
          ...sweep,
          base: {
            ...sweep.base,
            parameters: p.parameters,
            biologicalProfile: p.biologicalProfile,
            parameterProfile: p,
          },
        }),
        null,
        2,
      );
      field.dispatchEvent(new Event("input", { bubbles: true }));
      status.textContent =
        "Perfil aplicado à base da varredura. Seed, duração e valores de comparação foram preservados.";
    });
  library.onchange = () =>
    safe(() => {
      const p = readParameterProfiles().find(
        (p) => parameterProfileKey(p) === library.value,
      );
      if (p) {
        load(p);
        status.textContent =
          "Versão carregada no editor. Aplique para usar no experimento.";
      }
    });
  installProfileFiles({
    exportButton: byId("profile-export"),
    importer: byId<HTMLInputElement>("profile-import"),
    read: current,
    status,
    error,
    loaded: (p) => {
      load(p);
      refresh();
      library.value = parameterProfileKey(p);
    },
  });
  safe(() => {
    fromPlan();
    refresh();
  });
}
