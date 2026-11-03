import { World } from "../modules/simulation/world.js";
import type { RenderWorld } from "../modules/renderer/render-types.ts";
import type { StepWorld } from "../modules/time/session-step.ts";
import type { WorldWire } from "../modules/persistence/types.ts";
export interface LiveWorld extends RenderWorld, StepWorld {
  params: RenderWorld["params"] & Record<string, number>;
  snapshot(): WorldWire;
  intervene(type: unknown, x?: unknown, z?: unknown, value?: unknown): unknown;
}
/** Owned legacy initializer supplies the biological fields dynamically.
 * Guard the runtime boundary; external snapshots are normalized by session-models first. */
function isLiveWorld(value: unknown): value is LiveWorld {
  return (
    value instanceof World &&
    "seed" in value &&
    typeof value.seed === "string" &&
    "tick" in value &&
    typeof value.tick === "number" &&
    Number.isFinite(value.tick) &&
    "ants" in value &&
    Array.isArray(value.ants) &&
    "nest" in value &&
    !!value.nest &&
    "params" in value &&
    !!value.params &&
    typeof value.step === "function" &&
    typeof value.intervene === "function" &&
    typeof value.snapshot === "function"
  );
}
export function liveWorld(value: unknown): LiveWorld {
  if (!isLiveWorld(value)) throw Error("Invalid initialized Viveiro world");
  return value;
}
export function createLiveWorld(
  seed: string,
  params: Record<string, number>,
  options: Record<string, unknown> = {},
): LiveWorld {
  return liveWorld(new World(seed, params, options));
}
export function restoreLiveWorld(value: unknown): LiveWorld {
  return liveWorld(World.restore(value));
}
