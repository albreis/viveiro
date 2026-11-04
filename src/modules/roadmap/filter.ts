import { roadmapViews } from "./types.ts";
import type { RoadmapData, RoadmapFilter, RoadmapGroup } from "./types.ts";
export const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
export function readRoadmapFilter(params: URLSearchParams): RoadmapFilter {
  const view = params.get("view");
  const status = params.get("status");
  return {
    view: roadmapViews.find((candidate) => candidate === view) ?? "overview",
    query: (params.get("q") ?? "").slice(0, 200),
    status: status === "pending" || status === "done" ? status : "all",
  };
}
export function filterRoadmap(
  data: RoadmapData,
  filter: RoadmapFilter,
): RoadmapGroup[] {
  const query = normalizeSearch(filter.query.trim());
  return data.groups
    .filter((group) => query || group.view === filter.view)
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          (filter.status === "all" ||
            item.done === (filter.status === "done")) &&
          (!query ||
            normalizeSearch(
              [group.title, item.id, item.title, item.detail].join(" "),
            ).includes(query)),
      ),
    }))
    .filter((group) => group.items.length > 0);
}
export function roadmapFilterParams(filter: RoadmapFilter): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.view !== "overview") params.set("view", filter.view);
  if (filter.query) params.set("q", filter.query);
  if (filter.status !== "all") params.set("status", filter.status);
  return params;
}
