import { EFFORT_PROFILE, MAX_DEBT, type EffortState } from "./effort-model.ts";

export function validateEffort(world: {
  tick: number;
  biologicalProfile?: unknown;
  ants: unknown[];
}) {
  for (const item of world.ants) {
    const ant = item as { kind?: unknown; effort?: unknown } | null;
    if (ant?.effort === undefined) continue;
    const profile = world.biologicalProfile as
      { id?: string; version?: number } | undefined;
    const state = ant.effort as Partial<EffortState> | null;
    if (
      profile?.id !== EFFORT_PROFILE ||
      profile.version !== 1 ||
      ant.kind !== "worker" ||
      !state ||
      !Number.isFinite(state.debt) ||
      state.debt! < 0 ||
      state.debt! > MAX_DEBT ||
      !Number.isSafeInteger(state.tick) ||
      state.tick! < 0 ||
      state.tick! > world.tick
    )
      throw Error("Estado de esforço inválido.");
  }
}
