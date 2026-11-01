import type { SocialChemistry } from "../modules/social-chemistry/types.ts";
import { colonyColor } from "../libs/colony-colors.ts";
export function renderChemicalStatus(state?: SocialChemistry) {
  const target = document.getElementById("chemical-status");
  if (!target) return;
  target.textContent = state
    ? state.intimidations +
      " intimidação(ões) · " +
      state.retreats +
      " recuo(s) · " +
      state.attacks +
      " ataque(s). Alimento deslocado por infiltração: " +
      state.stolen.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) +
      " u."
    : "Os próximos encontros revelam os odores da colônia.";
  const legend = document.getElementById("odor-legend");
  if (!legend) return;
  legend.replaceChildren();
  for (const id of Object.keys(state?.profiles || {})) {
    const span = document.createElement("span"),
      dot = document.createElement("i");
    dot.style.backgroundColor = colonyColor(Number(id));
    span.append(dot, document.createTextNode("Colônia " + id));
    legend.append(span);
  }
}
