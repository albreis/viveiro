import { renderMaternalStatus } from "./maternal-status.ts";
import { biologyMarkup } from "./biology-markup.ts";
import {
  biologicalProfiles,
  biologicalProfileKey,
  biologicalReferenceFromKey,
  latestProfileReference,
  resolveBiologicalProfile,
} from "../modules/biology/catalog.ts";
import { renderBiologicalParameters } from "./biology-parameters.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import type {
  ParameterTopic,
  BiologicalReference,
} from "../modules/biology/types.ts";
export function selectedBiologicalProfile(): BiologicalReference {
  return biologicalReferenceFromKey(
    (document.getElementById("biology-profile") as HTMLSelectElement | null)
      ?.value || biologicalProfileKey(latestProfileReference()),
  );
}
export function installBiologyControls(world: FamilyWorld): void {
  document.getElementById("biology-panel")!.innerHTML = biologyMarkup;
  const catalog = document.getElementById(
    "biology-catalog",
  ) as HTMLDialogElement;
  document.getElementById("biology-open")!.onclick = () => catalog.showModal();
  document.getElementById("biology-close")!.onclick = () => catalog.close();
  catalog.addEventListener("keydown", (event) => event.stopPropagation());
  const select = document.getElementById(
      "biology-profile",
    ) as HTMLSelectElement,
    topic = document.getElementById("biology-topic") as HTMLSelectElement;
  if (!select || !topic) return;
  select.replaceChildren(
    ...biologicalProfiles.map(
      (p) => new Option(p.label + " · v" + p.version, biologicalProfileKey(p)),
    ),
  );
  select.value = biologicalProfileKey(
    latestProfileReference(
      resolveBiologicalProfile(world.biologicalProfile).id,
    ),
  );
  const preview = () => {
    const p = resolveBiologicalProfile(selectedBiologicalProfile());
    document.getElementById("biology-catalog-profile")!.textContent =
      "Consulta do próximo perfil: " + p.label + " · v" + p.version;
    document.getElementById("biology-preview")!.textContent =
      p.description +
      " Fundação genérica " +
      p.foundation +
      ". Casulos e sazonalidade sem calibração por espécie.";
  };
  select.onchange = () => {
    preview();
    topic.value =
      selectedBiologicalProfile().id === "lab-lniger-2024" ? "study" : "model";
    renderBiologicalParameters(
      topic.value as ParameterTopic,
      selectedBiologicalProfile().version,
    );
  };
  topic.onchange = () =>
    renderBiologicalParameters(topic.value as ParameterTopic);
  preview();
  renderBiologicalParameters(topic.value as ParameterTopic);
}
export function renderBiologyStatus(world: FamilyWorld): void {
  const output = document.getElementById("biology-active");
  if (!output) return;
  renderMaternalStatus(world);
  const p = resolveBiologicalProfile(world.biologicalProfile);
  output.textContent =
    "Atual: " +
    p.label +
    " · v" +
    p.version +
    ". Sem espécie calibrada. Ar atual " +
    (world.params.temperatureC ?? 24).toLocaleString("pt-BR") +
    "°C/" +
    world.params.humidity.toLocaleString("pt-BR") +
    "%. " +
    (world.biologicalProfile
      ? "Perfil preservado no experimento."
      : "Save legado reconhecido como genérico, sem reescrever seus parâmetros.");
}
