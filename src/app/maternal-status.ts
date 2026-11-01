import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import { maternalBalance } from "../modules/maternal/pools.ts";
const number = (value: number) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
function display(message?: string): void {
  for (const id of ["maternal-status", "maternal-catalog-status"]) {
    const target = document.getElementById(id);
    if (target) {
      target.hidden = !message;
      target.textContent = message ?? "";
    }
  }
}
export function renderMaternalStatus(world: FamilyWorld): void {
  const candidates = colonyWorlds(world).filter((c) => c.founding?.maternal),
    current =
      candidates.find(
        (c) => !["established", "failed"].includes(c.founding!.phase),
      ) ?? candidates[0];
  if (!current) {
    display();
    return;
  }
  const archived = ["established", "failed"].includes(current.founding!.phase),
    state = current.founding!.maternal!,
    s = state.stores,
    balance = maternalBalance(state);
  display(
    "Atual · colônia " +
      (current.colonyId ?? 1) +
      ", perfil v" +
      (current.biologicalProfile?.version ?? 1) +
      (archived
        ? " · registro da fundação: lipídio "
        : " · créditos da fundação: lipídio ") +
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
        : "Balanço inconsistente."),
  );
}
