import type { Brood } from "../colony/types.ts";
export function validateBroodDevelopment(
  value: unknown,
  required: boolean,
): void {
  if (!Array.isArray(value)) {
    if (required) throw new Error("Registro de maturação ausente.");
    return;
  }
  for (const b of value as Brood[]) {
    if (!b || typeof b !== "object")
      throw new Error("Registro de maturação inconsistente.");
    const s = b.development;
    if (!s) {
      if (required) throw new Error("Registro de maturação ausente.");
      continue;
    }
    if (
      !required ||
      s.version !== 1 ||
      ![
        s.growthFactor,
        s.stress,
        s.lastTemperature,
        s.lastSoilWater,
        s.lastRate,
      ].every(Number.isFinite) ||
      s.growthFactor < 0.8 ||
      s.growthFactor > 1.2 ||
      s.stress < 0 ||
      s.stress > 1 ||
      s.lastSoilWater < 0 ||
      s.lastSoilWater > 1.01 ||
      s.lastRate < 0 ||
      s.lastRate > 1.2 ||
      !Number.isFinite(b.age) ||
      b.age < 0 ||
      b.age > 1.3 + 1e-9
    )
      throw new Error("Registro de maturação inconsistente.");
  }
}
