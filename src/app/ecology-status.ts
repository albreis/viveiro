import { writeStatusMetrics } from "./status-metrics.ts";
import { locale, message } from "../i18n/runtime.ts";
import type { EcologyState } from "../modules/ecology/types.ts";
export function renderEcologyStatus(e?: EcologyState) {
  const target = document.getElementById("ecology-status");
  if (!target) return;
  const f = (n: number) =>
    n.toLocaleString(locale.locale, { maximumFractionDigits: 2 });
  if (e) {
    const aphids = Math.floor(e.aphids.reduce((n, a) => n + a.count, 0));
    const plants = e.aphids.filter((a) => a.count >= 1).length;
    const honey = f(e.aphids.reduce((n, a) => n + a.honey, 0));
    writeStatusMetrics("ecology", {
      aphids,
      aphidPlants: plants,
      honeydew: honey + " u.",
    });
    message(target, "panels.ecology", {
      aphids,
      plants,
      honey,
      collected: f(e.honeyCollected),
      adoptions: e.adoptions,
      rejections: e.rejections,
      fed: f(e.parasiteFed),
    });
  } else {
    writeStatusMetrics("ecology");
    message(target, "terrarium.ecology.initial");
  }
  const button = document.getElementById(
    "focus-ecology",
  ) as HTMLButtonElement | null;
  if (button)
    button.disabled =
      !e ||
      !(
        e.aphids.some((a) => a.count >= 1) ||
        e.mimics.some((m) => m.status !== "dead")
      );
}
