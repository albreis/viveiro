import type { SoilWorld } from "../modules/soil/types.ts";
export function renderStructureStatus(w: SoilWorld) {
  const target = document.getElementById("structure-status"),
    button = document.getElementById(
      "focus-structure",
    ) as HTMLButtonElement | null;
  if (!target) return;
  const s = w.soil.structure;
  if (button) button.disabled = !s?.patches.length;
  if (!s?.patches.length) {
    target.textContent =
      "O suporte do teto será acompanhado nas galerias abertas.";
    return;
  }
  const unstable = s.patches.filter((p) => p.safety < 1).length,
    min = Math.min(...s.patches.map((p) => p.safety));
  target.textContent =
    s.patches.length +
    " amostra(s) do teto · " +
    unstable +
    " sob sobrecarga no modelo. Menor margem: " +
    min.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) +
    "× · " +
    s.failures +
    " desprendimento(s). Fissuras indicam dano acumulado. Modelo estrutural exploratório.";
}
