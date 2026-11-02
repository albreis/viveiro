import { BOUNDS } from "../modules/simulation/constants.js";
export const placementTools = ["food", "plant", "predator", "scent"] as const;
export function placement(type: string, x: number, z: number) {
  if (
    !(placementTools as readonly string[]).includes(type) ||
    !Number.isFinite(x) ||
    !Number.isFinite(z) ||
    Math.abs(x) > BOUNDS.x ||
    Math.abs(z) > BOUNDS.z
  )
    throw Error(
      "Escolha um elemento e coordenadas dentro dos limites do terrário.",
    );
  return { type, x, z };
}
export function installAccessibleInterventions(
  apply: (type: string, x: number, z: number) => void,
) {
  const host = document.getElementById("keyboard-placement");
  if (!host) return;
  host.innerHTML = `<summary>Intervir por coordenadas · teclado</summary>
    <p>As mesmas intervenções do mouse. Coordenadas da superfície em unidades do modelo: X de −9,3 a 9,3 e Z de −5,8 a 5,8. A ação é registrada no experimento e usa as regras normais do terreno.</p>
    <form id="placement-form"><label for="placement-tool">Elemento</label>
    <select id="placement-tool"><option value="food">Alimento</option><option value="plant">Planta</option><option value="predator">Predador</option><option value="scent">Odor estranho</option></select>
    <label for="placement-x">Coordenada X</label><input id="placement-x" name="x" type="number" min="-${BOUNDS.x}" max="${BOUNDS.x}" step="any" value="0" required>
    <label for="placement-z">Coordenada Z</label><input id="placement-z" name="z" type="number" min="-${BOUNDS.z}" max="${BOUNDS.z}" step="any" value="0" required>
    <button type="submit">Aplicar intervenção nas coordenadas</button></form>
    <p role="status" id="placement-status"></p>`;
  const input = (id: string) => host.querySelector<HTMLInputElement>("#" + id)!;
  host.querySelector<HTMLFormElement>("form")!.onsubmit = (event) => {
    event.preventDefault();
    try {
      const p = placement(
        host.querySelector<HTMLSelectElement>("select")!.value,
        input("placement-x").valueAsNumber,
        input("placement-z").valueAsNumber,
      );
      apply(p.type, p.x, p.z);
      host.querySelector("#placement-status")!.textContent =
        "Solicitação enviada nas coordenadas X " +
        p.x +
        ", Z " +
        p.z +
        ". O diário informa o resultado do modelo.";
    } catch (error) {
      host.querySelector("#placement-status")!.textContent =
        error instanceof Error ? error.message : "Intervenção não aplicada.";
    }
  };
}
