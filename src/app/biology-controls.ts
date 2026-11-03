import { locale, t, message, messageSource } from "../i18n/runtime.ts";
import { profileLabel, profileDescription } from "../i18n/biology.ts";
import type { MessageKey } from "../i18n/catalogs.ts";
import { renderStoreStatus } from "./store-status.ts";
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
  select.replaceChildren(
    ...biologicalProfiles.map(
      (p) =>
        new Option(
          profileLabel(p) + " · v" + p.version,
          biologicalProfileKey(p),
        ),
    ),
  );
  select.value = biologicalProfileKey(
    latestProfileReference(
      resolveBiologicalProfile(world.biologicalProfile).id,
    ),
  );
  const refresh = () =>
    renderBiologicalParameters(
      topic.value as ParameterTopic,
      resolveBiologicalProfile(selectedBiologicalProfile()),
    );
  const describeProfile = () => {
    const p = resolveBiologicalProfile(selectedBiologicalProfile());
    message(
      document.getElementById("biology-catalog-profile")!,
      "biology.preview",
      { label: profileLabel(p), version: p.version },
    );
    messageSource(
      document.getElementById("biology-preview")!,
      profileDescription(p) +
        t("biology.foundation", {
          foundation: t(("biology.foundation." + p.foundation) as MessageKey),
        }),
    );
  };
  const changeProfile = () => {
    const p = resolveBiologicalProfile(selectedBiologicalProfile());
    describeProfile();
    const maternal = topic.querySelector<HTMLOptionElement>(
      'option[value="maternal"]',
    );
    if (maternal) maternal.disabled = p.maternalModel !== "pools";
    const seasonal = topic.querySelector<HTMLOptionElement>(
      'option[value="seasonal"]',
    );
    if (seasonal) seasonal.disabled = !p.dormancyModel;
    const semi = topic.querySelector<HTMLOptionElement>(
      'option[value="semiclaustral"]',
    );
    if (semi) semi.disabled = p.foundation !== "semiclaustral";
    const chambers = topic.querySelector<HTMLOptionElement>(
      'option[value="chambers"]',
    );
    if (chambers) chambers.disabled = !p.chamberModel;
    const material = topic.querySelector<HTMLOptionElement>(
      'option[value="materials"]',
    );
    if (material) material.disabled = !p.materialModel;
    const fertility = topic.querySelector<HTMLOptionElement>(
      'option[value="fertility"]',
    );
    if (fertility) fertility.disabled = !p.fertilityModel;
    const survival = topic.querySelector<HTMLOptionElement>(
      'option[value="survival"]',
    );
    if (survival) survival.disabled = !p.survivalModel;
    topic.value = p.survivalModel
      ? "survival"
      : p.fertilityModel
        ? "fertility"
        : p.materialModel
          ? "materials"
          : p.chamberModel
            ? "chambers"
            : p.foundation === "semiclaustral"
              ? "semiclaustral"
              : p.dormancyModel
                ? "seasonal"
                : p.id === "lab-lniger-2024"
                  ? "study"
                  : p.maternalModel === "pools"
                    ? "maternal"
                    : "model";
    refresh();
  };
  select.onchange = changeProfile;
  topic.onchange = refresh;
  changeProfile();
  const stopLocale = locale.subscribe(() => {
    for (const option of select.options) {
      const p = resolveBiologicalProfile(
        biologicalReferenceFromKey(option.value),
      );
      option.textContent = profileLabel(p) + " · v" + p.version;
    }
    describeProfile();
    refresh();
  });
  window.addEventListener("pagehide", stopLocale, { once: true });
}
export function renderBiologyStatus(world: FamilyWorld): void {
  const output = document.getElementById("biology-active");
  if (!output) return;
  renderMaternalStatus(world);
  renderStoreStatus(world);
  const p = resolveBiologicalProfile(world.biologicalProfile);
  messageSource(
    output,
    t("biology.active", {
      label: profileLabel(p),
      version: p.version,
      temperature: locale.number(world.params.temperatureC ?? 24),
      humidity: locale.number(world.params.humidity),
    }) + t(world.biologicalProfile ? "biology.preserved" : "biology.legacy"),
  );
}
