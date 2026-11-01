import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import { maternalBalance } from "../modules/maternal/pools.ts";
const number = (value: number) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
export function renderMaternalStatus(world: FamilyWorld): void {
  const target = document.getElementById("maternal-status");
  if (!target) return;
  const candidates = colonyWorlds(world).filter((c) => c.founding?.maternal),
    current =
      candidates.find(
        (c) => !["established", "failed"].includes(c.founding!.phase),
      ) ?? candidates[0];
  target.hidden = !current;
  if (!current) {
    target.textContent = "";
    return;
  }
  const state = current.founding!.maternal!,
    s = state.stores,
    balance = maternalBalance(state);
  target.textContent =
    "Colônia " +
    (current.colonyId ?? 1) +
    " · créditos de reserva: lipídio " +
    number(s.lipid) +
    ", proteína " +
    number(s.protein) +
    ", músculo " +
    number(s.muscle) +
    " u. Consumidos " +
    number(balance.consumed) +
    "; convertidos " +
    number(state.converted) +
    ". " +
    (Math.abs(balance.error) < 1e-7
      ? "Balanço fechado."
      : "Balanço inconsistente.");
}
