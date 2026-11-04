export const roadmapViews = [
  "overview",
  "technical",
  "personal",
  "external",
  "ux",
  "buhl",
  "optional",
  "done",
] as const;
export type RoadmapView = (typeof roadmapViews)[number];
export interface RoadmapLink {
  label: string;
  url: string;
}
export interface RoadmapItem {
  id: string;
  title: string;
  detail: string;
  done: boolean;
  optional: boolean;
  links: RoadmapLink[];
}
export interface RoadmapGroup {
  id: string;
  title: string;
  view: RoadmapView;
  source: string;
  started?: boolean;
  items: RoadmapItem[];
}
export interface RoadmapData {
  updated: string;
  version: string;
  groups: RoadmapGroup[];
}
export interface RoadmapFilter {
  view: RoadmapView;
  query: string;
  status: "all" | "pending" | "done";
}
