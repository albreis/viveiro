import { withdrawForaged } from "../semiclaustral/budget.ts";
import { withdrawMaternal, reserveTotal } from "../maternal/pools.ts";
import type { ColonyAgent, ColonyWorld } from "../colony/types.ts";
import type { Vec3 } from "../navigation/types.ts";
export type FoundingPhase =
  | "weather"
  | "flight"
  | "landing"
  | "dealate"
  | "surveying"
  | "digging"
  | "sealing"
  | "claustral"
  | "semiclaustral"
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
  survey?: import("../chambers/types.ts").SiteSurvey;
  foraging?: import("../semiclaustral/types.ts").FoundressForaging;
  seal?: import("../sealing/types.ts").SealTask;
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
  patches: import("../semiclaustral/types.ts").FoodPatch[];
  landscape: import("../landscape/types.ts").Landscape;
  params: {
    humidity: number;
    light: number;
    temperatureC?: number;
    reposeAngle?: number;
    soilWaterInitial?: number;
    photoperiodHours?: number;
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
  const external = withdrawForaged(f, use, requested);
  const remaining = requested - external;
  const amount =
    external +
    (f.maternal
      ? withdrawMaternal(f.maternal, use, remaining)
      : Math.min(f.reserves, remaining));
  if (f.maternal) f.reserves = reserveTotal(f.maternal.stores);
  else f.reserves -= amount - external;
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
