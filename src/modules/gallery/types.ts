import type { ExperimentPlan } from "../experiments/plan.ts";
export type GalleryTopic =
  "signals" | "soil" | "development" | "founding" | "resources";
export type GalleryCredit =
  | { origin: "team"; name: string }
  | { origin: "external"; name: string; reviewPullRequest: number };
export interface GalleryEntry {
  readonly id: string;
  readonly version: number;
  readonly topic: GalleryTopic;
  readonly credit: GalleryCredit;
  readonly plan: ExperimentPlan;
}
