import type { SoilWorld } from "../modules/soil/types.ts";
export function installGranularControls(
  intervene: (type: string, x: number, z: number, value: number) => void,
) {
  const input = document.getElementById("repose-angle") as HTMLInputElement;
  if (!input) return;
  input.oninput = () => {
    document.getElementById("repose-angle-value")!.textContent =
      input.value + "°";
  };
  input.onchange = () => intervene("reposeAngle", 0, 0, Number(input.value));
}
export function renderGranularControls(w: SoilWorld) {
  const input = document.getElementById(
    "repose-angle",
  ) as HTMLInputElement | null;
  if (input && document.activeElement !== input) {
    input.value = String(w.params.reposeAngle ?? 36);
    document.getElementById("repose-angle-value")!.textContent =
      input.value + "°";
  }
  const state = w.soil.granular,
    target = document.getElementById("granular-status");
  if (target)
    target.textContent = state
      ? (w.nest.rubble || []).filter((p) => p.mobile && p.mass > 0).length +
        " agregado(s) de terra solta · " +
        state.moving +
        " em movimento. Atrito e gravidade exploratórios."
      : "A terra solta poderá cair e se acomodar no relevo.";
}
