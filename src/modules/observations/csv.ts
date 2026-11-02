import metadata from "../../../package.json" with { type: "json" };
const { version } = metadata;
import { measureDaily } from "./measure.ts";
import {
  DAILY_TICKS,
  type DailyPoint,
  type ObservationWorld,
} from "./types.ts";
export interface ObservationScenario {
  id: "a" | "b";
  world: ObservationWorld;
}
export const dailyColumns = [
  "schema",
  "versao_exportacao",
  "versao_medicao",
  "semente",
  "cenario",
  "aula",
  "tipo_amostra",
  "inicio_coleta_tick",
  "dias_descartados",
  "tick",
  "dia_modelo",
  "populacao_adulta_ind",
  "prole_ind",
  "ovos_ind",
  "larvas_ind",
  "pupas_ind",
  "colonias",
  "reserva_alimento_u",
  "temperatura_ar_referencia_C",
  "temperatura_media_grade_solo_C",
  "O2_medio_galerias_pct_volume",
  "CO2_medio_galerias_pct_volume",
] as const;
/** Quoting alone does not stop spreadsheet formulas. Prefix untrusted text with an apostrophe. */
export function csvCell(value: string | number | null) {
  if (value === null) return "";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw Error("Leitura não finita no CSV.");
    return String(value);
  }
  const safe = /^[\s\u0000-\u001f]*[=+@-]/u.test(value) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}
export function scenarioSamples(world: ObservationWorld, limit?: number) {
  const points = (world.dailyObservations?.points ?? []).slice(
    limit ? -limit : 0,
  );
  const current = measureDaily(world);
  const samples: { point: DailyPoint; kind: string }[] = points.map(
    (point) => ({
      point,
      kind: point.tick === 0 ? "estado_inicial" : "fechamento_diario",
    }),
  );
  if (JSON.stringify(points.at(-1)) !== JSON.stringify(current))
    samples.push({ point: current, kind: "instantaneo_atual" });
  return samples;
}
export function dailyCsv(scenarios: ObservationScenario[], lesson = "") {
  const rows: (string | number | null)[][] = [[...dailyColumns]];
  for (const { id, world } of scenarios) {
    const s = world.dailyObservations;
    for (const { point: p, kind } of scenarioSamples(world))
      rows.push([
        "viveiro-diario-v1",
        version,
        p.modelVersion,
        world.seed,
        id.toUpperCase(),
        lesson,
        kind,
        s?.startedTick ?? world.tick,
        s?.discarded ?? 0,
        p.tick,
        p.tick / DAILY_TICKS,
        p.population,
        p.brood,
        p.eggs,
        p.larvae,
        p.pupae,
        p.colonies,
        p.food,
        p.airTemperatureC,
        p.soilTemperatureC,
        p.oxygenPercent,
        p.carbonDioxidePercent,
      ]);
  }
  return (
    "\ufeff" +
    rows.map((row) => row.map(csvCell).join(",")).join("\r\n") +
    "\r\n"
  );
}
