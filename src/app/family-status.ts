import { colonyWorlds } from "../modules/colonies/types.ts";
import type { FamilyPresentation } from "../modules/colonies/presentation.ts";
import { foundingDescription } from "./founding-status.ts";
export function renderFamilyStatus(world: FamilyPresentation) {
  const el = document.getElementById("family-status");
  if (!el) return;
  const queens = world.ants.filter((a) => a.kind === "queen").length,
    alates = world.ants.filter((a) => a.sexual).length;
  const reserved = colonyWorlds(world).reduce(
    (n, c) => n + (c.colony.reproductiveFood || 0),
    0,
  );
  el.textContent =
    (world.colonyCount || 1) +
    " colônia(s) · " +
    queens +
    " rainha(s) · " +
    alates +
    " alado(s) para o próximo voo. " +
    reserved.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) +
    " u. reservadas para alados.";
  const detail = document.getElementById("daughter-status");
  if (detail)
    detail.textContent = (world.foundings || [])
      .filter((f) => f.colonyId !== 1)
      .map((f) => "Colônia " + f.colonyId + ": " + foundingDescription(f.state))
      .join(" ");
}
