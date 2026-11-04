import data from "virtual:viveiro-roadmap";
import { installLocalePicker } from "../i18n/picker.ts";
import { locale, t, message } from "../i18n/runtime.ts";
import { roadmapViews } from "../modules/roadmap/types.ts";
import type { RoadmapView } from "../modules/roadmap/types.ts";
import {
  filterRoadmap,
  readRoadmapFilter,
  roadmapFilterParams,
} from "../modules/roadmap/filter.ts";
import { roadmapGroupView } from "./roadmap-view.ts";
installLocalePicker();
const find = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const search = find<HTMLInputElement>("roadmap-search");
const status = find<HTMLSelectElement>("roadmap-status");
const groups = find<HTMLDivElement>("roadmap-groups");
const expand = find<HTMLButtonElement>("roadmap-expand");
let filter = readRoadmapFilter(new URLSearchParams(location.search));
search.value = filter.query;
status.value = filter.status;
const notes = {
  overview: "roadmap.overviewNote",
  technical: "roadmap.technicalNote",
  personal: "roadmap.personalNote",
  external: "roadmap.externalNote",
  ux: "roadmap.uxNote",
  buhl: "roadmap.buhlNote",
  optional: "roadmap.optionalNote",
  done: "roadmap.doneNote",
} as const;
function saveUrl() {
  const params = roadmapFilterParams(filter);
  params.set("lang", locale.locale);
  const query = params.toString();
  history.replaceState(
    null,
    "",
    location.pathname + (query ? "?" + query : ""),
  );
}
function setView(view: RoadmapView) {
  filter = { view, query: "", status: "all" };
  search.value = "";
  status.value = "all";
  render();
}
function renderNavigation() {
  const nav = find<HTMLElement>("roadmap-nav");
  nav.replaceChildren(
    ...roadmapViews.map((view) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.view = view;
      button.setAttribute("aria-current", String(view === filter.view));
      const label = document.createElement("span");
      label.textContent = t(`roadmap.view.${view}`);
      const count = document.createElement("span");
      count.className = "nav-count";
      count.textContent = String(
        data.groups
          .filter((g) => g.view === view)
          .reduce((sum, g) => sum + g.items.length, 0),
      );
      button.append(label, count);
      button.addEventListener("click", () => setView(view));
      return button;
    }),
  );
}
function render() {
  renderNavigation();
  const next = data.groups.find(
    (group) =>
      group.view === "technical" && group.items.some((item) => !item.done),
  );
  const nextTitle = find("roadmap-next-title");
  nextTitle.lang = next ? "pt-BR" : locale.locale;
  nextTitle.textContent = next?.title ?? t("roadmap.nextDone");
  find("roadmap-next").hidden = !next;
  message(find("roadmap-updated"), "roadmap.updated", { date: data.updated });
  find("roadmap-version").textContent = data.version;
  find("ux-count").textContent = String(
    data.groups
      .filter((g) => g.view === "ux")
      .reduce((n, g) => n + g.items.length, 0),
  );
  find("optional-count").textContent = String(
    data.groups.find((g) => g.view === "optional")?.items.length ?? 0,
  );
  message(find("roadmap-view-title"), `roadmap.view.${filter.view}`);
  message(find("roadmap-note"), notes[filter.view]);
  const selected = filterRoadmap(data, filter);
  const count = selected.reduce((sum, g) => sum + g.items.length, 0);
  message(find("roadmap-results"), "roadmap.result", { count });
  groups.replaceChildren(...selected.map((g) => roadmapGroupView(g, true)));
  find("roadmap-empty").hidden = count > 0;
  expand.hidden = count === 0;
  expand.setAttribute("aria-expanded", "true");
  message(expand, "roadmap.collapse");
  saveUrl();
}
search.addEventListener("input", () => {
  filter.query = search.value;
  render();
});
status.addEventListener("change", () => {
  filter.status =
    status.value === "done" || status.value === "pending"
      ? status.value
      : "all";
  render();
});
document
  .querySelector(".roadmap-filters")!
  .addEventListener("submit", (e) => e.preventDefault());
find("roadmap-next").addEventListener("click", () => setView("technical"));
find("roadmap-clear").addEventListener("click", () => {
  setView(filter.view);
  search.focus();
});
expand.addEventListener("click", () => {
  const open = expand.getAttribute("aria-expanded") !== "true";
  groups.querySelectorAll<HTMLDetailsElement>("details").forEach((d) => {
    d.open = open;
  });
  expand.setAttribute("aria-expanded", String(open));
  message(expand, open ? "roadmap.collapse" : "roadmap.expand");
});
find("roadmap-print").addEventListener("click", () => window.print());
const printState = new Map<HTMLDetailsElement, boolean>();
window.addEventListener("beforeprint", () =>
  groups.querySelectorAll<HTMLDetailsElement>("details").forEach((d) => {
    printState.set(d, d.open);
    d.open = true;
  }),
);
window.addEventListener("afterprint", () => {
  for (const [d, open] of printState) d.open = open;
  printState.clear();
});
window.addEventListener("popstate", () => {
  filter = readRoadmapFilter(new URLSearchParams(location.search));
  search.value = filter.query;
  status.value = filter.status;
  render();
});
const stop = locale.subscribe(render);
window.addEventListener("pagehide", stop, { once: true });
render();
