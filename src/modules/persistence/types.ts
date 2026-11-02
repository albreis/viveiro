export interface WorldWire extends Record<string, unknown> {
  seed: string;
  tick: number;
  ants: Record<string, unknown>[];
  colonies?: WorldWire[];
}
export interface SessionState {
  lesson?: import("../lessons/reference.ts").LessonReference;
  clock?: import("../time/clock.ts").ClockState;
  advance?: import("../time/advance-types.ts").AdvancePlan;
  version: 1 | 2;
  world: WorldWire;
  comparison?: WorldWire | null;
  scenario: "a" | "b";
  initial: {
    seed: string;
    params: Record<string, number>;
    startMode?: string;
    biologicalProfile?: import("../biology/types.ts").BiologicalReference;
  };
  interventions: Record<string, unknown>[];
  replaying: boolean;
  replayIndex: number;
  running: boolean;
}
export interface Checkpoint {
  format: "viveiro-checkpoint";
  version: 2;
  id: string;
  createdAt: number;
  sequence: number;
  kind: "auto" | "manual";
  label: string;
  checksum: string;
  payload: SessionState;
}
export type CheckpointMeta = Pick<
  Checkpoint,
  "id" | "createdAt" | "sequence" | "kind" | "label"
> & { seed: string; tick: number };
export interface CheckpointDriver {
  write(record: Checkpoint): Promise<boolean>;
  read(id: string): Promise<Checkpoint | null>;
  list(): Promise<CheckpointMeta[]>;
  current(): Promise<Checkpoint | null>;
}
