import type { PredatorMemory } from "./types.ts";
export function validatePredatorMemory(values: unknown): void {
  if (!Array.isArray(values)) return;
  for (const p of values) {
    const m = p?.predatorMemory as PredatorMemory | undefined;
    if (m === undefined) continue;
    const integer = (n: unknown) =>
        typeof n === "number" && Number.isSafeInteger(n) && n >= 0,
      finite = (n: unknown) => typeof n === "number" && Number.isFinite(n);
    if (
      !m ||
      m.version !== 1 ||
      !m.anchor ||
      ![m.anchor.x, m.anchor.z].every(finite) ||
      !integer(m.anchor.tick) ||
      (m.visit && (!integer(m.visit.plant) || !integer(m.visit.since))) ||
      (m.avoid && (!integer(m.avoid.plant) || !integer(m.avoid.until))) ||
      (m.escape && (!finite(m.escape.angle) || !integer(m.escape.until)))
    )
      throw new Error("Memória de navegação do predador inválida.");
  }
}
