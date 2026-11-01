export type EvidenceKind =
  "approximation" | "hypothesis" | "protocol" | "measurement";
export type ParameterTopic = "model" | "founding" | "development" | "study";
export interface BiologicalReference {
  schema: 1;
  id: string;
  version: number;
}
export interface ParameterRecord {
  readonly id: string;
  readonly label: string;
  readonly topic: ParameterTopic;
  readonly version: number;
  readonly value: number | null;
  readonly range?: readonly [number, number];
  readonly unit: string;
  readonly evidence: EvidenceKind;
  readonly source: string;
  readonly sample: number | null;
  readonly uncertainty: string;
  readonly context: string;
  readonly application: "simulation" | "preset" | "none";
}
export interface BiologicalSource {
  readonly id: string;
  readonly title: string;
  readonly url?: string;
  readonly license: string;
  readonly accessedAt: string;
}
export interface BiologicalProfile {
  readonly id: string;
  readonly version: number;
  readonly label: string;
  readonly modelSpecies: null;
  readonly referenceSpecies: string | null;
  readonly foundation: "claustral" | "semiclaustral" | "unknown";
  readonly cocoon: "present" | "absent" | "unspecified";
  readonly seasonality: "unmodelled" | "seasonal" | "nonseasonal";
  readonly climate: Readonly<Record<string, number>>;
  readonly description: string;
}
