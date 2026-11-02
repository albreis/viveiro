import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import { sampleClimate } from "../modules/microclimate/grid.ts";
const number = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
export function renderStoreStatus(w: FamilyWorld): void {
  const output = document.getElementById("store-status");
  if (!output) return;
  const colonies = colonyWorlds(w).filter((c) => c.colony.stores);
  output.hidden = !colonies.length;
  output.textContent = colonies
    .map((c) => {
      const s = c.colony.stores!,
        sum = s.bins.reduce((n, b) => n + b.amount, 0),
        closed = Math.abs(s.initial + s.incoming - s.outgoing - sum) < 1e-7;
      const rooms = s.bins
        .slice(0, 5)
        .map((b) => {
          const r = sampleClimate(c.microclimate, b.point);
          return (
            (c.nest.nodes[b.node]?.name ?? "Câmara #" + b.node) +
            ": " +
            number(b.amount) +
            " u." +
            (r ? " / " + number(r.water * 100) + "% dos poros" : "")
          );
        })
        .join("; ");
      return (
        "Colônia " +
        (c.colonyId ?? 1) +
        ": " +
        number(sum) +
        " crédito(s) em " +
        s.bins.length +
        " câmara(s)." +
        (rooms ? " " + rooms + "." : "") +
        " Entradas " +
        number(s.incoming) +
        "; retiradas " +
        number(s.outgoing) +
        ". Balanço " +
        (closed ? "fechado." : "inconsistente.")
      );
    })
    .join(" ");
}
