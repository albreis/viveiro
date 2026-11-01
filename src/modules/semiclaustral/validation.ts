import type { FoundingState } from "../founding/types.ts";
import { foragingBalance } from "./budget.ts";
import { FORAGING_PARAMETERS as p } from "./types.ts";
export function validateFoundressForaging(
  value: unknown,
  required: boolean,
): void {
  if (value === undefined) return;
  const f = value as FoundingState,
    s = f.foraging;
  if (!s) {
    if (required) throw new Error("Coleta semiclaustral ausente.");
    return;
  }
  if (
    !required ||
    s.version !== 1 ||
    !["nursing", "outbound", "searching", "returning"].includes(s.phase)
  )
    throw new Error("Coleta incompatível com o perfil.");
  for (const key of [
    "searchTicks",
    "nextDeparture",
    "pantry",
    "load",
    "collected",
    "delivered",
    "consumed",
    "exported",
    "lost",
    "trips",
  ] as const)
    if (!Number.isFinite(s[key]) || s[key] < 0)
      throw new Error("Orçamento de coleta inválido.");
  if (
    !Number.isFinite(s.heading) ||
    ![s.searchTicks, s.nextDeparture, s.trips].every(Number.isSafeInteger) ||
    s.load > p.capacity + 1e-7 ||
    (s.phase === "nursing" && s.load > 1e-7)
  )
    throw new Error("Estado de coleta inválido.");
  if (
    f.phase === "established" &&
    (s.phase !== "nursing" || s.pantry > 1e-7 || s.load > 1e-7)
  )
    throw new Error("Transferência da fundação incompleta.");
  const b = foragingBalance(s);
  if (Math.abs(b.collection) > 1e-7 || Math.abs(b.pantry) > 1e-7)
    throw new Error("Balanço de coleta inconsistente.");
  if (f.seal || ["claustral", "sealing"].includes(f.phase))
    throw new Error("Fundação semiclaustral incompatível com selamento.");
}
