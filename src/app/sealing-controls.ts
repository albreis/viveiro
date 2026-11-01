import type { NestState } from "../modules/navigation/types.ts";
interface Scene {
  focusSealing(): string;
  showInterior: boolean;
}
export function installSealingControls(
  scene: () => Scene | null,
  notice: (text: string) => void,
): void {
  const button = document.getElementById("focus-sealing") as HTMLButtonElement;
  button.onclick = () => {
    const current = scene();
    if (!current) return;
    notice(current.focusSealing());
    (document.getElementById("interior") as HTMLInputElement).checked =
      current.showInterior;
    document
      .getElementById("viewport")
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
}
export function renderSealingStatus(world: { nest: NestState }): void {
  const button = document.getElementById(
    "focus-sealing",
  ) as HTMLButtonElement | null;
  if (button) button.disabled = !world.nest.plugs?.length;
}
