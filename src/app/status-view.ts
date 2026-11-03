import type { RenderWorld } from "../modules/renderer/render-types.ts";
type Presented = RenderWorld &
  import("../modules/colonies/presentation.ts").FamilyPresentation;
interface StatusContext {
  world: Presented;
  comparison: Presented | null;
  scenario: string;
  current: Presented;
}
import { locale, t, message, messageSource } from "../i18n/runtime.ts";
import { renderSurvivalStatus } from "./survival-view.ts";
import { renderFertilityStatus } from "./fertility-status.ts";
import { renderMaterialStatus } from "./material-controls.ts";
import { renderSeasonStatus } from "./season-controls.ts";
import { renderDevelopmentStatus } from "./development-status.ts";
import { renderSealingStatus } from "./sealing-controls.ts";
import { renderBiologyStatus } from "./biology-controls.ts";
import { renderLearningStatus } from "./learning-controls.ts";
import { renderStructureStatus } from "./structure-status.ts";
import { renderGasStatus } from "./gas-status.ts";
import { renderClimateStatus } from "./climate-status.ts";
import { renderGranularControls } from "./granular-controls.ts";
import { renderEcologyStatus } from "./ecology-status.ts";
import { renderChemicalStatus } from "./chemical-status.ts";
import { renderFamilyStatus } from "./family-status.ts";
import {
  renderFoundingStatus,
  foundingDescription,
} from "./founding-status.ts";
import { isClaustral } from "../modules/founding/types.ts";
import { renderColonyStatus } from "./colony-status.ts";
import { renderSoilStatus } from "./soil-status.ts";
import { drawChart as renderChart } from "./chart-view.ts";
import { element as $ } from "./dom-elements.ts";
const format = (n: number) =>
  new Intl.NumberFormat(locale.locale, { maximumFractionDigits: 1 }).format(n);
export function renderStatus(
  context: StatusContext,
  updateAntCamera: (world: RenderWorld) => void,
) {
  const { world, comparison, scenario, current } = context;
  renderSealingStatus(current);
  renderDevelopmentStatus(current);
  renderSeasonStatus(current);
  renderMaterialStatus(current);
  renderFertilityStatus(current);
  renderSurvivalStatus(current);
  const w = current,
    workers = w.workers.length,
    queen = w.ants.some((a) => a.kind === "queen"),
    male = w.ants.some((a) => a.kind === "male");
  for (const key of ["humidity", "light", "randomness"] as const)
    if (document.activeElement !== $(key)) {
      $(key).value = String(world.params[key]);
      $(key + "-value").textContent = world.params[key] + "%";
      $(key).style.setProperty("--range", world.params[key] + "%");
    }
  $("population").textContent = String(w.population);
  messageSource(
    $("population-detail"),
    (queen
      ? t("status.queens", {
          count: w.ants.filter((a) => a.kind === "queen").length,
        })
      : t("status.noQueen")) +
      (workers
        ? t("status.workers", { count: workers })
        : male
          ? t("status.male")
          : ""),
  );
  $("brood").textContent = String(w.brood.length);
  $("food").replaceChildren(
    document.createTextNode(format(w.food)),
    Object.assign(document.createElement("span"), { textContent: " u." }),
  );
  $("vegetation").replaceChildren(
    document.createTextNode(String(w.plants.length)),
    Object.assign(document.createElement("span"), {
      textContent: " " + t("terrarium.plants"),
    }),
  );
  $("predators").textContent = String(w.predators.length);
  message($("day"), "status.day", { day: format(w.day) });
  message(
    $("time-of-day"),
    w.day < 1
      ? "terrarium.founding"
      : w.workers.length === 0
        ? "status.beginning"
        : scenario === "b"
          ? "status.scenarioB"
          : "status.rhythm",
  );
  message($("chart-days"), "status.days", { day: format(w.day) });
  const list = $("events");
  list.replaceChildren();
  for (const event of w.events.slice(0, 7)) {
    const li = document.createElement("li"),
      time = document.createElement("time"),
      dot = document.createElement("span"),
      text = document.createElement("span");
    time.textContent = "D " + format(event.day);
    dot.className = "event-dot " + event.type;
    messageSource(text, event.text);
    li.append(time, dot, text);
    list.append(li);
  }
  let observation;
  if (!queen) observation = t("status.observation.noQueen");
  else if (isClaustral(w)) observation = foundingDescription(w.founding);
  else if (w.food < 2) observation = t("status.observation.lowFood");
  else if (w.workers.length === 0 && w.brood.length)
    observation = t("status.observation.brood", {
      eggs: w.brood.filter((b) => b.age < 0.35).length,
      larvae: w.brood.filter((b) => b.age >= 0.35 && b.age < 0.9).length,
      pupae: w.brood.filter((b) => b.age >= 0.9).length,
    });
  else if (w.workers.some((a) => a.carrying))
    observation = t("status.observation.food");
  else if (w.workers.length) observation = t("status.observation.explore");
  else observation = t("terrarium.observation.initial");
  messageSource($("observation"), observation || "");
  if (comparison)
    message($("comparison-text"), "status.comparison", {
      a: world.population,
      b: comparison.population,
    });
  renderBiologyStatus(w);
  renderFoundingStatus(w.founding);
  renderFamilyStatus(w);
  renderChemicalStatus(w.socialChemistry);
  renderEcologyStatus(w.ecology);
  renderSoilStatus(w);
  renderStructureStatus(w);
  renderLearningStatus(w);
  renderGranularControls(w);
  renderClimateStatus(w);
  renderGasStatus(w);
  renderColonyStatus(w);
  updateAntCamera(w);
  renderChart(world, comparison);
}
