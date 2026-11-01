import { biologyMarkup } from "./biology-markup.ts";
import {
  biologicalProfiles,
  resolveBiologicalProfile,
} from "../modules/biology/catalog.ts";
import { renderBiologicalParameters } from "./biology-parameters.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import type { ParameterTopic } from "../modules/biology/types.ts";
export function selectedBiologicalProfile(): string {
  return (
    (document.getElementById("biology-profile") as HTMLSelectElement | null)
      ?.value || "generic-demo"
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
    ...biologicalProfiles.map((p) => new Option(p.label, p.id)),
  );
  select.value = resolveBiologicalProfile(world.biologicalProfile).id;
  const preview = () => {
    const p = biologicalProfiles.find((p) => p.id === select.value)!;
    document.getElementById("biology-preview")!.textContent =
      p.description +
      " Fundação genérica " +
      p.foundation +
      ". Casulos e sazonalidade sem calibração por espécie.";
  };
  select.onchange = () => {
    preview();
    topic.value = select.value === "lab-lniger-2024" ? "study" : "model";
    renderBiologicalParameters(topic.value as ParameterTopic);
  };
  topic.onchange = () =>
    renderBiologicalParameters(topic.value as ParameterTopic);
  preview();
  renderBiologicalParameters(topic.value as ParameterTopic);
}
export function renderBiologyStatus(world: FamilyWorld): void {
  const output = document.getElementById("biology-active");
  if (!output) return;
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
