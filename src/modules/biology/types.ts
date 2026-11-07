export type EvidenceKind =
  "approximation" | "hypothesis" | "protocol" | "measurement";
export type ParameterTopic =
  | "model"
  | "founding"
  | "development"
  | "study"
  | "maternal"
  | "seasonal"
  | "semiclaustral"
  | "chambers"
  | "materials"
  | "fertility"
  | "survival";
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
  readonly minModelRevision?: number;
  readonly requiresCocoon?: boolean;
  readonly requiresLocalChambers?: boolean;
  readonly requiresRoomStores?: boolean;
  readonly requiresSoilMaterial?: boolean;
  readonly requiresFertility?: boolean;
  readonly requiresSurvival?: boolean;
  readonly requiresEntrancePlug?: boolean;
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
export interface WorkerReference {
  readonly bodyMm: number;
  readonly bodyRangeMm: readonly [number, number];
  readonly openWalkingMmPerSecond: number;
  readonly seedForaging?: {
    readonly searchFactor: readonly [number, number];
    readonly loadedWalkingFactor: readonly [number, number];
  };
  readonly temperatures: readonly [
    { readonly celsius: number; readonly speedMmPerSecond: number },
    ...{ readonly celsius: number; readonly speedMmPerSecond: number }[],
  ];
}
export interface BiologicalProfile {
  readonly id: string;
  readonly version: number;
  readonly label: string;
  readonly modelSpecies: null;
  readonly referenceSpecies: string | null;
  readonly workerReference?: WorkerReference;
  readonly forageModel?: "seed-trails";
  readonly foundation: "claustral" | "semiclaustral" | "unknown";
  readonly cocoon: "present" | "absent" | "unspecified";
  readonly seasonality: "unmodelled" | "seasonal" | "nonseasonal";
  readonly modelRevision?: number;
  readonly materialModel?: "relative-demo";
  readonly fertilityModel?: "finite-demo";
  readonly survivalModel?: "risk-demo";
  readonly stockModel?: "rooms-demo";
  readonly chamberModel?: "local-demo";
  readonly dormancyModel?: "obligate-demo";
  readonly developmentModel?: "linear" | "thermal-demo";
  readonly entranceModel?: "open" | "plug";
  readonly maternalModel?: "scalar" | "pools";
  readonly climate: Readonly<Record<string, number>>;
  readonly description: string;
}
