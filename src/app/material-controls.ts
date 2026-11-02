import type { FamilyWorld } from "../modules/colonies/types.ts";
import {
  readSoilMaterial,
  transportFactors,
} from "../modules/soil-material/coefficients.ts";
const fields = [
  {
    id: "soil-clay",
    key: "soilClayPercent",
    label: "Argila relativa",
    unit: "%",
  },
  {
    id: "soil-compaction",
    key: "soilCompactionPercent",
    label: "Compactação relativa",
    unit: "/100",
  },
] as const;
export function installMaterialControls(
  intervene: (type: string, x: number, z: number, value: number) => void,
): void {
  const panel = document.getElementById("soil-material-panel");
  if (!panel) return;
  panel.innerHTML =
    fields
      .map(
        (f) =>
          '<label for="' +
          f.id +
          '">' +
          f.label +
          ' <strong id="' +
          f.id +
          '-value"></strong></label><input id="' +
          f.id +
          '" type="range" min="0" max="100" step="1" aria-label="' +
          f.label +
          '">',
      )
      .join("") +
    '<p id="soil-material-status" class="field-note"></p><p class="field-note">Índices do modelo para transporte e suporte. O volume de poros permanece fixo.</p>';
  for (const f of fields) {
    const input = document.getElementById(f.id) as HTMLInputElement;
    input.oninput = () => {
      document.getElementById(f.id + "-value")!.textContent =
        input.value + f.unit;
    };
    input.onchange = () => intervene(f.key, 0, 0, Number(input.value));
  }
}
export function renderMaterialStatus(w: FamilyWorld): void {
  const panel = document.getElementById("soil-material-panel")!,
    mix = readSoilMaterial(w);
  panel.hidden = !mix;
  if (!mix) return;
  for (const f of fields) {
    const input = document.getElementById(f.id) as HTMLInputElement | null;
    if (!input) return;
    if (document.activeElement !== input) input.value = String(w.params[f.key]);
    document.getElementById(f.id + "-value")!.textContent =
      input.value + f.unit;
  }
  const factors = transportFactors(mix),
    number = (n: number) =>
      n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  document.getElementById("soil-material-status")!.textContent =
    "Redistribuição capilar " +
    number(factors.capillary) +
    "× · drenagem " +
    number(factors.drainage) +
    "× · condução térmica " +
    number(factors.heat) +
    "×. Referência relativa, sem ajuste experimental.";
}
