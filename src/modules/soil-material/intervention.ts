import type { MaterialHost } from "./types.ts";
import { readSoilMaterial } from "./coefficients.ts";
export function materialIntervention(
  w: MaterialHost & { log(message: string): void },
  type: string,
  value: unknown,
): boolean | null {
  if (type !== "soilClayPercent" && type !== "soilCompactionPercent")
    return null;
  if (!readSoilMaterial(w) || !Number.isFinite(Number(value))) return false;
  const amount = Math.max(0, Math.min(100, Number(value)));
  w.params[type] = amount;
  w.log(
    type === "soilClayPercent"
      ? "Teor relativo de argila ajustado para " + amount + "% no modelo."
      : "Compactação relativa ajustada para " + amount + "/100 no modelo.",
  );
  return true;
}
