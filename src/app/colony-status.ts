import type { ColonyWorld } from "../modules/colony/types.ts";
export function renderColonyStatus(world: ColonyWorld) {
  const target = document.getElementById("colony-status");
  if (!target || !world.colony) return;
  const workers = world.ants.filter((a) => a.kind === "worker");
  const nurses = workers.filter((a) => a.role === "nurse").length;
  const majors = workers.filter((a) => a.caste === "major").length;
  const carried = world.brood.filter((b) => b.carrier !== undefined).length;
  target.textContent =
    nurses +
    " cuidadora(s) · " +
    majors +
    " soldado(s) · " +
    carried +
    " cria(s) em transporte. " +
    world.colony.exchanges +
    " trocas de alimento.";
}
