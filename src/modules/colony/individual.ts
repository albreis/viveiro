import { taskThresholds } from "./response.ts";
import { hashSeed } from "../simulation/seed.ts";
import type { ColonyAgent, ColonyState } from "./types.ts";

export function individualTraits(seed: string, id: number, kind: string) {
  const value = (key: string) =>
    hashSeed(seed + ":" + id + ":" + key) / 4294967296;
  const major = kind === "worker" && value("caste") < 0.12;
  return {
    crop: kind === "queen" ? 0.6 : 0,
    thresholds: taskThresholds(seed, id),
    caste: major ? ("major" as const) : ("minor" as const),
    traits: {
      activity: 0.15 + value("activity") * 0.85,
      courage: value("courage"),
      exploration: value("exploration"),
    },
    bodyScale:
      kind !== "worker" ? 1 : major ? 1.22 : 0.88 + value("size") * 0.16,
    headScale: major ? 1.6 : 1,
    role: major ? ("defender" as const) : ("forager" as const),
  };
}
export function createColonyState(): ColonyState {
  return {
    version: 1,
    shared: 0,
    exchanges: 0,
    waste: [],
    cemeteryMass: 0,
    spoiled: 0,
  };
}
export function ensureIndividual(seed: string, ant: ColonyAgent) {
  if (!ant.traits)
    Object.assign(ant, individualTraits(seed, ant.id, ant.kind || "worker"));
  ant.crop ??= 0;
  ant.thresholds ??= taskThresholds(seed, ant.id);
}
