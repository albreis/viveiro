import type { FoundingState } from "../modules/founding/types.ts";
import type { MessageKey } from "../i18n/catalogs.ts";
import { locale, t, messageSource } from "../i18n/runtime.ts";
const number = (value: number) =>
  locale.number(value, { maximumFractionDigits: 2 });
export function foundingDescription(f?: FoundingState) {
  if (!f) return undefined;
  return (
    t("status.founding.summary", {
      phase: t(("status.founding." + f.phase) as MessageKey),
      reserve: number(f.reserves),
      initial: f.initialReserves,
      nanitics: f.nanitics,
      trips: f.trips,
    }) +
    (f.survey
      ? t("status.founding.survey", {
          samples: f.survey.samples,
          temperature: number(f.survey.last.temperature),
          water: number(f.survey.last.water * 100),
        })
      : "") +
    (f.foraging
      ? t("status.founding.foraging", {
          trips: f.foraging.trips,
          pantry: number(f.foraging.pantry),
          load: number(f.foraging.load),
          consumed: number(f.foraging.consumed),
        })
      : "") +
    (f.seal
      ? t("status.founding.seal", {
          phase: t(("status.seal." + f.seal.phase) as MessageKey),
          trips: f.seal.trips,
        })
      : "")
  );
}
export function renderFoundingStatus(f?: FoundingState) {
  const target = document.getElementById("founding-status");
  if (target)
    messageSource(
      target,
      foundingDescription(f) || t("status.founding.legacy"),
    );
}
