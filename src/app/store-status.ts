import { locale, t, messageSource } from "../i18n/runtime.ts";
import { translateSource } from "../i18n/source.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import { sampleClimate } from "../modules/microclimate/grid.ts";
const number = (n: number) =>
  n.toLocaleString(locale.locale, { maximumFractionDigits: 3 });
export function renderStoreStatus(w: FamilyWorld): void {
  const output = document.getElementById("store-status");
  if (!output) return;
  const colonies = colonyWorlds(w).filter((c) => c.colony.stores);
  output.hidden = !colonies.length;
  messageSource(
    output,
    colonies
      .map((c) => {
        const s = c.colony.stores!,
          sum = s.bins.reduce((n, b) => n + b.amount, 0),
          closed = Math.abs(s.initial + s.incoming - s.outgoing - sum) < 1e-7;
        const rooms = s.bins
          .slice(0, 5)
          .map((b) => {
            const r = sampleClimate(c.microclimate, b.point);
            return (
              (c.nest.nodes[b.node]?.name
                ? translateSource(c.nest.nodes[b.node].name!, locale.locale)
                : t("panels.store.room", { id: b.node })) +
              ": " +
              number(b.amount) +
              " u." +
              (r
                ? t("panels.store.pores", { water: number(r.water * 100) })
                : "")
            );
          })
          .join("; ");
        return (
          t("panels.store", {
            id: c.colonyId ?? 1,
            sum: number(sum),
            rooms: s.bins.length,
          }) +
          (rooms ? " " + rooms + "." : "") +
          t("panels.store.balance", {
            incoming: number(s.incoming),
            outgoing: number(s.outgoing),
            balance: t(
              closed ? "panels.balance.closed" : "panels.balance.inconsistent",
            ),
          })
        );
      })
      .join(" "),
  );
}
