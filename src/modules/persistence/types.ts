export interface WorldWire extends Record<string, unknown> {
  seed: string;
  tick: number;
  ants: Record<string, unknown>[];
  colonies?: WorldWire[];
}
export interface SessionState {
  version: 1;
  world: WorldWire;
  comparison?: WorldWire | null;
  scenario: "a" | "b";
  initial: { seed: string; params: Record<string, number>; startMode?: string };
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
