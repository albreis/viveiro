import type { SoilWorld } from "../modules/soil/types.ts";
import { soilBalance } from "../modules/soil/ledger.ts";

export function renderSoilStatus(world: SoilWorld) {
  const target = document.getElementById("soil-status");
  if (!target || !world.soil) return;
  const active = world.soil.projects.filter((p) => !p.completed).length;
  const digging = world.ants.filter((a) => a.soilTask?.phase === "dig").length;
  const hauling = world.ants.filter((a) => (a.carryingSoil || 0) > 0).length;
  const balance = soilBalance(world);
  const format = (v: number) =>
    new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(v);
  target.textContent =
    active +
    " frente(s) · " +
    digging +
    " escavando · " +
    hauling +
    " transportando. " +
    "Terra depositada: " +
    format(balance.deposited) +
    " u³ · solta: " +
    format(balance.loose) +
    " u³.";
}
