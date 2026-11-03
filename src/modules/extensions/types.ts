export interface ExtensionReference {
  schema: 1;
  id: string;
  version: number;
  sourceSha256: string;
}
export interface LocalExit {
  readonly id: number;
  readonly signal: number;
  readonly comfort: number;
  readonly visited: boolean;
  readonly visits: number;
  readonly backtrack: boolean;
  readonly goalVisible: boolean;
}
export interface LocalInput {
  readonly agent: Readonly<{ energy: number; hasLoad: boolean }>;
  readonly exits: readonly Readonly<LocalExit>[];
}
export type Signals = Readonly<Record<string, number>>;
export interface DecisionFrame {
  readonly input: LocalInput;
  readonly signals: Signals;
}
export interface SensorSystem {
  readonly id: string;
  sample(input: LocalInput): Readonly<Record<string, number>>;
}
/** A pure local signal submodel; it cannot return positions, food or world mutations. */
export interface DecisionSubmodel {
  readonly id: string;
  compute(frame: DecisionFrame): Readonly<Record<string, number>>;
}
export interface DecisionPolicy {
  readonly id: string;
  weights(frame: DecisionFrame): readonly number[];
}
export interface DecisionExtension {
  readonly id: string;
  readonly version: number;
  readonly sensors?: readonly SensorSystem[];
  readonly submodels?: readonly DecisionSubmodel[];
  readonly policy: DecisionPolicy;
}
