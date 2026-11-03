import { locale, t, messageSource } from "../i18n/runtime.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import { maternalBalance } from "../modules/maternal/pools.ts";
const number = (value: number) =>
  value.toLocaleString(locale.locale, { maximumFractionDigits: 3 });
function display(message?: string): void {
  for (const id of ["maternal-status", "maternal-catalog-status"]) {
    const target = document.getElementById(id);
    if (target) {
      target.hidden = !message;
      messageSource(target, message ?? "");
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
    t("panels.maternal", {
      id: current.colonyId ?? 1,
      version: current.biologicalProfile?.version ?? 1,
      record: t(
        archived ? "panels.maternal.archived" : "panels.maternal.current",
      ),
      lipid: number(s.lipid),
      protein: number(s.protein),
      muscle: number(s.muscle),
      consumed: number(balance.consumed),
      converted: number(state.converted),
      balance: t(
        Math.abs(balance.error) < 1e-7
          ? "panels.maternal.closed"
          : "panels.maternal.inconsistent",
      ),
    }),
  );
}
