import type { ColonyAgent } from "../colony/types.ts";
export interface OdorMask {
  profile: number[];
  strength: number;
  until: number;
}
export interface IntrusionTask {
  owner: number;
  entry: number;
  phase: "mask" | "search" | "exit";
  until: number;
  goal?: "royal" | "storage";
  home?: { node: number; x: number; z: number };
}
export interface EncounterMotion {
  until: number;
  direction: { x: number; y: number; z: number };
  state: string;
}
export interface SocialChemistry {
  version: 1;
  profiles: Record<string, number[]>;
  territory: Record<string, number[]>;
  deposited: number;
  evaporated: number;
  lastEvent: number;
  contacts: number;
  intimidations: number;
  attacks: number;
  retreats: number;
  camouflages: number;
  stolen: number;
}
export const createSocialChemistry = (): SocialChemistry => ({
  version: 1,
  profiles: {},
  territory: {},
  deposited: 0,
  evaporated: 0,
  lastEvent: -1000,
  contacts: 0,
  intimidations: 0,
  attacks: 0,
  retreats: 0,
  camouflages: 0,
  stolen: 0,
});
export const activeMask = (a: ColonyAgent) =>
  a.odorMask && a.odorMask.strength > 0;
