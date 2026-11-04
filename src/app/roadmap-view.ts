import { t } from "../i18n/runtime.ts";
import type { RoadmapGroup, RoadmapItem } from "../modules/roadmap/types.ts";
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  text = "",
) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}
function taskView(item: RoadmapItem): HTMLElement {
  const card = el("details", "roadmap-task" + (item.done ? " is-done" : ""));
  const summary = el("summary");
  summary.append(el("span", "task-icon", item.done ? "✓" : "○"));
  const truncated = item.title.length > 180;
  summary.append(
    el(
      "span",
      "task-title",
      truncated ? item.title.slice(0, 177) + "…" : item.title,
    ),
  );
  const badge = el(
    "span",
    "task-badge",
    t(
      item.done
        ? "roadmap.done"
        : item.optional
          ? "roadmap.optional"
          : "roadmap.pending",
    ),
  );
  summary.append(badge);
  card.append(summary);
  const body = el("div", "task-detail");
  if (truncated || item.detail)
    body.append(el("p", "", (truncated ? item.title + " " : "") + item.detail));
  for (const link of item.links) {
    const anchor = el("a", "document-link", link.label + " ↗");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    body.append(anchor);
  }
  if (!body.childNodes.length) body.append(el("p", "", item.title));
  card.append(body);
  return card;
}
export function roadmapGroupView(
  group: RoadmapGroup,
  open: boolean,
): HTMLDetailsElement {
  const section = el("details", "roadmap-group");
  section.open = open;
  const summary = el("summary", "group-summary");
  const title = el("h3", "", group.title);
  summary.append(title, el("span", "group-count", String(group.items.length)));
  if (group.started)
    summary.append(el("span", "started-badge", t("roadmap.started")));
  section.append(summary);
  const tasks = el("div", "group-tasks");
  tasks.append(...group.items.map(taskView));
  const source = el(
    "a",
    "document-link group-source",
    t("roadmap.source") + " ↗",
  );
  source.href = group.source;
  source.target = "_blank";
  source.rel = "noopener noreferrer";
  tasks.append(source);
  section.append(tasks);
  return section;
}
