import { translate } from "../i18n/core.ts";
import { message, messageSource, t } from "../i18n/runtime.ts";
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
    throw Error(translate("data.placement.invalid"));
  return { type, x, z };
}
export function installAccessibleInterventions(
  apply: (type: string, x: number, z: number) => void,
) {
  const host = document.getElementById("keyboard-placement");
  if (!host) return;
  host.innerHTML = `<summary data-i18n="interface.placement.title"></summary>
    <p data-i18n="interface.placement.help"></p>
    <form id="placement-form"><label for="placement-tool" data-i18n="interface.placement.element"></label>
    <select id="placement-tool"><option value="food" data-i18n="terrarium.food"></option><option value="plant" data-i18n="terrarium.plant"></option><option value="predator" data-i18n="terrarium.predator"></option><option value="scent" data-i18n="terrarium.foreignOdor"></option></select>
    <label for="placement-x" data-i18n="interface.placement.x"></label><input id="placement-x" name="x" type="number" min="-${BOUNDS.x}" max="${BOUNDS.x}" step="any" value="0" required>
    <label for="placement-z" data-i18n="interface.placement.z"></label><input id="placement-z" name="z" type="number" min="-${BOUNDS.z}" max="${BOUNDS.z}" step="any" value="0" required>
    <button type="submit" data-i18n="interface.placement.apply"></button></form>
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
      message(host.querySelector("#placement-status")!, "data.placement.sent", {
        x: p.x,
        z: p.z,
      });
    } catch (error) {
      messageSource(
        host.querySelector("#placement-status")!,
        error instanceof Error ? error.message : t("data.placement.failed"),
      );
    }
  };
}
