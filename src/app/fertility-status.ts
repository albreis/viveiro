import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
export function renderFertilityStatus(root: FamilyWorld): void {
  const panel = document.getElementById("fertility-status");
  if (!panel) return;
  const rows = colonyWorlds(root).filter((w) => w.colony.fertility);
  panel.hidden = rows.length === 0;
  const number = (n: number) =>
    n.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
  panel.textContent = rows
    .map((w) => {
      const s = w.colony.fertility!,
        sum = (key: "received" | "viable" | "used" | "lost") =>
          s.pools.reduce((n, p) => n + p[key], 0),
        valid =
          Math.abs(
            sum("received") - sum("viable") - sum("used") - sum("lost"),
          ) < 1e-7;
      return (
        "Colônia " +
        (w.colonyId ?? 1) +
        ": espermateca com " +
        s.pools.length +
        " macho(s) registrado(s); " +
        number(sum("viable")) +
        " créditos viáveis, " +
        number(sum("used")) +
        " usados e " +
        number(sum("lost")) +
        " perdidos. " +
        s.fertilized +
        " ovo(s) fecundados; " +
        s.failed +
        " tentativa(s) sem fecundação. Balanço " +
        (valid ? "fechado" : "inconsistente") +
        ". Créditos abstratos, sem equivalência em células. Esgotamento não é morte da rainha."
      );
    })
    .join(" ");
}
