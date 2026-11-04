import { writeStatusMetrics } from "./status-metrics.ts";
import { locale, t, message, messageSource } from "../i18n/runtime.ts";
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
  const colonies = world.colonyCount || 1;
  const reserve = locale.number(reserved, { maximumFractionDigits: 1 });
  writeStatusMetrics("family", {
    colonies,
    queens,
    alates,
    alateReserve: reserve + " u.",
  });
  message(el, "status.family", { colonies, queens, alates, reserved: reserve });
  const detail = document.getElementById("daughter-status");
  if (detail)
    messageSource(
      detail,
      (world.foundings || [])
        .filter((f) => f.colonyId !== 1)
        .map((f) =>
          t("status.family.daughter", {
            id: f.colonyId,
            description: foundingDescription(f.state) || "",
          }),
        )
        .join(" "),
    );
}
