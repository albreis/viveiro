import { World, TICKS_PER_DAY } from "../simulation/world.js";
import { normalizeSession } from "../persistence/validation.ts";
import { stepSession } from "./session-step.ts";
import type { StepWorld } from "./session-step.ts";
import { validateAdvanceOptions } from "./advance-types.ts";
import type {
  AdvanceOptions,
  AdvanceProgress,
  AdvanceOutcome,
} from "./advance-types.ts";
import type { SessionState } from "../persistence/types.ts";
export class AdvanceCancelled extends Error {}
interface Hooks {
  cancelled(): boolean;
  progress(p: AdvanceProgress): void;
  now?(): number;
  pause?(): Promise<void>;
}
/** Bounded, cooperative execution of the actual model; no renderer, new RNG or skipped ticks. */
export async function runAdvance(
  value: SessionState,
  options: AdvanceOptions,
  hooks: Hooks,
): Promise<AdvanceOutcome> {
  validateAdvanceOptions(options);
  const now = hooks.now ?? (() => performance.now()),
    pause = hooks.pause ?? (() => new Promise<void>((r) => setTimeout(r, 16))),
    started = now();
  const session = normalizeSession(structuredClone(value));
  if (session.running) throw Error("Pause o terrário antes de avançar.");
  const world = World.restore(session.world) as StepWorld & {
    snapshot(): SessionState["world"];
  };
  const comparison = session.comparison
    ? (World.restore(session.comparison) as typeof world)
    : null;
  const plan = session.advance ?? {
    version: 1 as const,
    startTick: world.tick,
    targetTick: world.tick + options.days * TICKS_PER_DAY,
  };
  const totalTicks = plan.targetTick - world.tick;
  let doneTicks = 0,
    activeMs = now() - started,
    maxSliceMs = 0;
  const check = () => {
    if (hooks.cancelled()) throw new AdvanceCancelled();
  };
  const progress = (): AdvanceProgress => ({
    doneTicks,
    totalTicks,
    tick: world.tick,
    activeMs,
    elapsedMs: now() - started,
    maxSliceMs,
  });
  while (world.tick < plan.targetTick && activeMs < options.budgetMs) {
    check();
    const slice = now();
    do {
      check();
      stepSession(world, comparison, session);
      doneTicks++;
    } while (
      world.tick < plan.targetTick &&
      now() - slice < 8 &&
      activeMs + now() - slice < options.budgetMs
    );
    const duration = now() - slice;
    activeMs += duration;
    maxSliceMs = Math.max(maxSliceMs, duration);
    hooks.progress(progress());
    if (world.tick < plan.targetTick && activeMs < options.budgetMs) {
      await pause();
      check();
    }
  }
  check();
  session.world = world.snapshot();
  session.comparison = comparison?.snapshot() ?? null;
  const complete = world.tick >= plan.targetTick;
  if (complete) delete session.advance;
  else session.advance = plan;
  session.running = false;
  return { session: normalizeSession(session), complete, progress: progress() };
}
