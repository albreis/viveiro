import type { FoundingState } from "../founding/types.ts";
import type { MaternalState } from "./types.ts";
import { maternalBalance, reserveTotal } from "./pools.ts";
export function validateMaternalState(state: MaternalState): void {
  const finite = (x: unknown) =>
    typeof x === "number" && Number.isFinite(x) && x >= 0;
  if (
    !state ||
    state.version !== 1 ||
    !state.initial ||
    !state.stores ||
    !state.consumed ||
    !state.unmet ||
    !finite(state.converted)
  )
    throw new Error("Reservas maternas inválidas.");
  for (const key of ["lipid", "protein", "muscle"] as const)
    if (!finite(state.initial[key]) || !finite(state.stores[key]))
      throw new Error("Nutrientes maternos inválidos.");
  if (
    !finite(state.consumed.lipid) ||
    !finite(state.consumed.protein) ||
    Object.values(state.unmet).length !== 4 ||
    !["maintenance", "eggs", "larvae", "excavation"].every((k) =>
      finite(state.unmet[k as keyof typeof state.unmet]),
    )
  )
    throw new Error("Custos maternos inválidos.");
  const errors = [
    maternalBalance(state).error,
    state.initial.lipid - state.consumed.lipid - state.stores.lipid,
    state.initial.protein +
      state.converted -
      state.consumed.protein -
      state.stores.protein,
    state.initial.muscle - state.converted - state.stores.muscle,
  ];
  if (errors.some((e) => Math.abs(e) > 1e-7))
    throw new Error("Balanço materno inconsistente.");
}
export function validateMaternalFounding(
  value: unknown,
  required: boolean,
): void {
  if (value === undefined) return;
  const f = value as FoundingState;
  if (!f.maternal) {
    if (required) throw new Error("Reservas da revisão biológica ausentes.");
    return;
  }
  if (!required)
    throw new Error("Reservas incompatíveis com a revisão biológica escalar.");
  validateMaternalState(f.maternal);
  const used = Object.values(f.spent).reduce((a, b) => a + b, 0),
    balance = maternalBalance(f.maternal);
  if (
    Math.abs(reserveTotal(f.maternal.stores) - f.reserves) > 1e-7 ||
    Math.abs(balance.initial - f.initialReserves) > 1e-7 ||
    Math.abs(balance.consumed + (f.foraging?.consumed ?? 0) - used) > 1e-7
  )
    throw new Error("Resumo das reservas maternas inconsistente.");
}
