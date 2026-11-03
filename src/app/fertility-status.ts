import { locale, t, messageSource } from "../i18n/runtime.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
export function renderFertilityStatus(root: FamilyWorld): void {
  const panel = document.getElementById("fertility-status");
  if (!panel) return;
  const rows = colonyWorlds(root).filter((w) => w.colony.fertility);
  panel.hidden = rows.length === 0;
  const number = (n: number) =>
    n.toLocaleString(locale.locale, { maximumFractionDigits: 3 });
  messageSource(
    panel,
    rows
      .map((w) => {
        const s = w.colony.fertility!,
          sum = (key: "received" | "viable" | "used" | "lost") =>
            s.pools.reduce((n, p) => n + p[key], 0),
          valid =
            Math.abs(
              sum("received") - sum("viable") - sum("used") - sum("lost"),
            ) < 1e-7;
        return t("panels.fertility", {
          id: w.colonyId ?? 1,
          males: s.pools.length,
          viable: number(sum("viable")),
          used: number(sum("used")),
          lost: number(sum("lost")),
          fertilized: s.fertilized,
          failed: s.failed,
          balance: t(
            valid ? "panels.balance.closed" : "panels.balance.inconsistent",
          ),
        });
      })
      .join(" "),
  );
}
