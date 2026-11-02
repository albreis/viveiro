import type { Vec3 } from "../navigation/types.ts";
export interface AphidPatch {
  id: number;
  plant: number;
  count: number;
  honey: number;
  visits: number;
}
export interface MimicLarva extends Vec3 {
  normal?: Vec3;
  id: number;
  profile: number[];
  energy: number;
  age: number;
  carrier?: number;
  owner?: number;
  node?: number;
  destination?: number;
  placing?: boolean;
  until?: number;
  status: "searching" | "carried" | "adopted" | "dead";
}
export interface EcologyState {
  version: 1;
  aphids: AphidPatch[];
  mimics: MimicLarva[];
  sap: number;
  assimilated: number;
  honeyProduced: number;
  honeyCollected: number;
  honeyLost: number;
  protected: number;
  aphidsEaten: number;
  adoptions: number;
  rejections: number;
  parasiteFed: number;
  parasiteRespired: number;
  lastEvent: number;
}
export interface EcologyPredator {
  predatorMemory?: import("../predators/types.ts").PredatorMemory;
  x: number;
  z: number;
  energy: number;
  angle: number;
  cooldown: number;
  prey: number;
  repelledUntil?: number;
}
