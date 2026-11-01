import type { SoilWorld } from "../modules/soil/types.ts";
import { soilBalance } from "../modules/soil/ledger.ts";

export function renderSoilStatus(world: SoilWorld) {
  const target = document.getElementById("soil-status");
  if (!target || !world.soil) return;
  const founding =
    (world as SoilWorld & { founding?: { phase: string } }).founding?.phase ===
    "digging";
  const active =
    world.soil.projects.filter((p) => !p.completed).length + (founding ? 1 : 0);
  const digging = world.ants.filter(
    (a) =>
      a.soilTask?.phase === "dig" || a.state === "Escavando o primeiro abrigo",
  ).length;
  const hauling = world.ants.filter((a) => (a.carryingSoil || 0) > 0).length;
  const balance = soilBalance(world);
  const format = (v: number) =>
    new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(
      Math.abs(v) < 1e-9 ? 0 : v,
    );
  target.textContent =
    active +
    " frente(s) · " +
    digging +
    " escavando · " +
    hauling +
    " transportando. " +
    "Terra depositada: " +
    format(balance.surfaceStock ?? balance.deposited) +
    " u³ · solta: " +
    format(balance.loose) +
    " u³." +
    (balance.sealed !== undefined
      ? " Tampão: " +
        format(balance.sealed) +
        " u³ · erro de balanço: " +
        format(balance.error) +
        "."
      : "");
}
