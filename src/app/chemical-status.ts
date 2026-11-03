import { locale, t, message } from "../i18n/runtime.ts";
import type { SocialChemistry } from "../modules/social-chemistry/types.ts";
import { colonyColor } from "../libs/colony-colors.ts";
export function renderChemicalStatus(state?: SocialChemistry) {
  const target = document.getElementById("chemical-status");
  if (!target) return;
  if (state)
    message(target, "panels.chemical", {
      intimidations: state.intimidations,
      retreats: state.retreats,
      attacks: state.attacks,
      stolen: locale.number(state.stolen, { maximumFractionDigits: 2 }),
    });
  else message(target, "panels.chemical.wait");
  const legend = document.getElementById("odor-legend");
  if (!legend) return;
  legend.replaceChildren();
  for (const id of Object.keys(state?.profiles || {})) {
    const span = document.createElement("span"),
      dot = document.createElement("i");
    dot.style.backgroundColor = colonyColor(Number(id));
    span.append(dot, document.createTextNode(t("panels.colony", { id })));
    legend.append(span);
  }
}
