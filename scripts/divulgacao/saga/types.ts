import type { Point } from "./charts.ts";
export interface Group {
  workers: number;
  reference: Point[];
  control: Point[];
  fatigue: Point[];
  morphology: Point[];
  access: Point[];
}
export interface Facts {
  groups: Group[];
  action100: { digOnly: number; actions: number; seeds: number; hours: number };
  locomotion100: { base: number; speed: number; load: number; both: number };
  accessGains: { workers: number; ratioOfMeans: number }[];
  world: {
    workers: number;
    removed: number;
    frontRemoved: number;
    deposited: number;
  }[];
  coverage: { within: number; total: number };
  tests: number;
  worldRuns: number;
}
export interface Card {
  slug: string;
  theme?: "dark";
  section: string;
  title: string;
  lead?: string;
  body: string;
  note: string;
  kind?: string;
}
