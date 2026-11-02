import { TICKS_PER_DAY } from "../simulation/constants.js";
export interface ClockState {
  version: 1;
  secondsPerDay: number;
  speed: number;
  pendingTicks: number;
}
export const PACES = [10, 60, 300, 3600] as const;
export const SPEEDS = [1, 3, 10] as const;
/** Missing clock means the historical ten-second day, with no inferred wall-time catch-up. */
export function normalizeClock(value: unknown): ClockState {
  if (value === undefined)
    return { version: 1, secondsPerDay: 10, speed: 1, pendingTicks: 0 };
  const c = value as Partial<ClockState> | null;
  if (
    !c ||
    c.version !== 1 ||
    !(PACES as readonly unknown[]).includes(c.secondsPerDay) ||
    !(SPEEDS as readonly unknown[]).includes(c.speed) ||
    typeof c.pendingTicks !== "number" ||
    !Number.isFinite(c.pendingTicks) ||
    c.pendingTicks < 0 ||
    c.pendingTicks > Number.MAX_SAFE_INTEGER
  )
    throw Error("Relógio do experimento inválido.");
  return {
    version: 1,
    secondsPerDay: c.secondsPerDay!,
    speed: c.speed!,
    pendingTicks: c.pendingTicks,
  };
}
/** Rendering only schedules the same indivisible biological steps; overdue steps are retained. */
export class SimulationClock {
  state: ClockState;
  constructor(
    state: ClockState = {
      version: 1,
      secondsPerDay: 60,
      speed: 1,
      pendingTicks: 0,
    },
  ) {
    this.state = normalizeClock(state);
  }
  credit(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0)
      throw Error("Intervalo de relógio inválido.");
    const next =
      this.state.pendingTicks +
      (seconds * TICKS_PER_DAY * this.state.speed) / this.state.secondsPerDay;
    if (next > Number.MAX_SAFE_INTEGER)
      throw Error("O relógio excedeu seu limite de passos pendentes.");
    this.state.pendingTicks = next;
  }
  drain(
    step: () => void,
    now: () => number = () => performance.now(),
    budgetMs = 6,
    maxSteps = 30,
  ) {
    const start = now();
    let count = 0;
    while (
      this.state.pendingTicks + 1e-9 >= 1 &&
      count < maxSteps &&
      (count === 0 || now() - start < budgetMs)
    ) {
      step();
      this.state.pendingTicks = Math.max(0, this.state.pendingTicks - 1);
      count++;
    }
    return count;
  }
  get alpha() {
    return Math.min(1, this.state.pendingTicks);
  }
}
