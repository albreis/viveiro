import { locale, t } from "../i18n/runtime.ts";
import { translateSource } from "../i18n/source.ts";
import type { MessageKey } from "../i18n/catalogs.ts";
import { biologicalParameters } from "../modules/biology/catalog.ts";
import { biologicalSources } from "../modules/biology/sources.ts";
import type {
  BiologicalProfile,
  EvidenceKind,
  ParameterTopic,
} from "../modules/biology/types.ts";
const number = (n: number) =>
  n.toLocaleString(locale.locale, {
    maximumFractionDigits: Math.abs(n) > 0 && Math.abs(n) < 0.001 ? 6 : 3,
  });
export function renderBiologicalParameters(
  topic: ParameterTopic,
  profile: BiologicalProfile,
): void {
  const revision = profile.modelRevision ?? profile.version;
  const list = document.getElementById("biology-records")!;
  list.replaceChildren();
  for (const record of biologicalParameters.filter(
    (p) =>
      p.topic === topic &&
      (p.minModelRevision ?? 1) <= revision &&
      (!p.requiresSurvival || profile.survivalModel === "risk-demo") &&
      (!p.requiresFertility || profile.fertilityModel === "finite-demo") &&
      (!p.requiresSoilMaterial || profile.materialModel === "relative-demo") &&
      (!p.requiresRoomStores || profile.stockModel === "rooms-demo") &&
      (!p.requiresLocalChambers || profile.chamberModel === "local-demo") &&
      (!p.requiresCocoon || profile.cocoon === "present") &&
      (!p.requiresEntrancePlug || profile.entranceModel === "plug"),
  )) {
    const item = document.createElement("li"),
      name = document.createElement("strong"),
      value = document.createElement("span"),
      kind = document.createElement("em"),
      context = document.createElement("p"),
      origin = document.createElement("p");
    name.textContent = translateSource(record.label, locale.locale);
    value.textContent =
      (record.range
        ? record.range.map(number).join("–")
        : record.value !== null
          ? number(record.value)
          : t("biology.missing")) +
      " " +
      translateSource(record.unit, locale.locale);
    kind.textContent =
      t(("biology.evidence." + record.evidence) as MessageKey) +
      " · v" +
      record.version;
    kind.dataset.evidence = record.evidence;
    context.textContent =
      translateSource(record.context, locale.locale) +
      " " +
      (record.application === "simulation"
        ? t("biology.simulation")
        : record.application === "preset"
          ? t("biology.preset")
          : t("biology.none"));
    const source = biologicalSources.find((s) => s.id === record.source)!,
      link = source.url
        ? document.createElement("a")
        : document.createElement("span");
    link.textContent = translateSource(source.title, locale.locale);
    if (link instanceof HTMLAnchorElement) {
      link.href = source.url!;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    origin.append(
      link,
      document.createTextNode(
        " · " +
          (record.sample !== null
            ? "n=" + record.sample
            : record.evidence === "approximation"
              ? t("biology.unmeasured")
              : t("biology.noSample")) +
          ". " +
          translateSource(record.uncertainty, locale.locale).replace(
            /\.+$/,
            "",
          ) +
          ".",
      ),
    );
    item.append(name, value, kind, context, origin);
    list.append(item);
  }
}
