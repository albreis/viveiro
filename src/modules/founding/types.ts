import { withdrawMaternal, reserveTotal } from "../maternal/pools.ts";
import type { ColonyAgent, ColonyWorld } from "../colony/types.ts";
import type { Vec3 } from "../navigation/types.ts";
export type FoundingPhase =
  | "weather"
  | "flight"
  | "landing"
  | "dealate"
  | "digging"
  | "claustral"
  | "established"
  | "failed";
export type ReserveUse = "maintenance" | "eggs" | "larvae" | "excavation";
export interface FoundingState {
  version: 1;
  phase: FoundingPhase;
  since: number;
  lastRain: number;
  site: Vec3;
  chamber: Vec3;
  matedTick?: number;
  entry?: number;
  front?: number;
  maternal?: import("../maternal/types.ts").MaternalState;
  initialReserves: number;
  reserves: number;
  spent: Record<ReserveUse, number>;
  firstClutch: boolean;
  nanitics: number;
  discardedWings: Vec3[];
  digMode: "bite" | "haul" | "return";
  trips: number;
}
export interface FoundingWorld extends ColonyWorld {
  founding?: FoundingState;
  landscape: import("../landscape/types.ts").Landscape;
  params: {
    humidity: number;
    light: number;
    temperatureC?: number;
    reposeAngle?: number;
    soilWaterInitial?: number;
  };
}
export const isClaustral = (world: { founding?: FoundingState }) =>
  !!world.founding && !["established", "failed"].includes(world.founding.phase);
export function spendReserve(
  world: { founding?: FoundingState },
  use: ReserveUse,
  requested: number,
) {
  const f = world.founding;
  if (!f || !(requested > 0)) return 0;
  const amount = f.maternal
    ? withdrawMaternal(f.maternal, use, requested)
    : Math.min(f.reserves, requested);
  if (f.maternal) f.reserves = reserveTotal(f.maternal.stores);
  else f.reserves -= amount;
  f.spent[use] += amount;
  return amount;
}
export function changePhase(
  world: FoundingWorld,
  phase: FoundingPhase,
  message: string,
) {
  const f = world.founding!;
  f.phase = phase;
  f.since = world.tick;
  world.log(message, phase === "failed" ? "danger" : "birth");
}
export function founder(world: FoundingWorld): ColonyAgent | undefined {
  return world.ants.find((a) => a.kind === "queen");
}
