import { readCsv } from "../../libs/csv-reader.ts";
export const morrisMetrics = {
  population: "populacao_adulta_ind",
  brood: "prole_ind",
  food: "reserva_alimento_u",
  oxygen: "O2_medio_galerias_pct_volume",
  carbonDioxide: "CO2_medio_galerias_pct_volume",
} as const;
export type MorrisMetric = keyof typeof morrisMetrics;
export function finalMetrics(csv: string): Record<MorrisMetric, number | null> {
  const rows = readCsv(csv),
    header = rows[0],
    row = rows.at(-1);
  if (!header || !row || rows.length < 2)
    throw Error("Observações finais ausentes.");
  const result = {} as Record<MorrisMetric, number | null>;
  for (const [metric, column] of Object.entries(morrisMetrics)) {
    const index = header.indexOf(column);
    if (index < 0) throw Error("Coluna ausente: " + column);
    const raw = row[index];
    const value = raw === "" ? null : Number(raw);
    if (value !== null && !Number.isFinite(value))
      throw Error("Observação não finita.");
    result[metric as MorrisMetric] = value;
  }
  return result;
}
