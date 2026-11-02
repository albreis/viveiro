import type { MaterialParams } from "./types.ts";
export function validateSoilMaterial(
  value: unknown,
  required: boolean,
  shared?: unknown,
): void {
  if (!required) return;
  const params = ((value as { params?: MaterialParams }).params ?? shared) as
    MaterialParams | undefined;
  if (
    !params ||
    ![params.soilClayPercent, params.soilCompactionPercent].every(
      (n) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100,
    )
  )
    throw new Error("Parâmetros do material do solo inválidos.");
}
