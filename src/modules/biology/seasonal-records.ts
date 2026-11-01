import type { ParameterRecord } from "./types.ts";
import { SEASON_PARAMETERS as p } from "../seasons/types.ts";
import { COCOON_COST } from "../development/types.ts";
const record = (
  id: string,
  label: string,
  value: number,
  unit: string,
): ParameterRecord => ({
  id: "seasonal." + id,
  label,
  value,
  unit,
  topic: "seasonal",
  version: 1,
  minModelRevision: 5,
  ...(id === "cocoon" ? { requiresCocoon: true } : {}),
  evidence: "approximation",
  source: "viveiro-demo",
  sample: null,
  uncertainty: "Coeficiente demonstrativo; não é ajuste a uma espécie.",
  context:
    "Memória reprodutiva sazonal. Dias do modelo acelerado, sem reproduzir o protocolo de laboratório.",
  application: "simulation",
});
export const seasonalRecords: readonly ParameterRecord[] = [
  record(
    "activeDays",
    "Período ativo após fundação",
    p.activeDays,
    "dias do modelo",
  ),
  record(
    "preparation",
    "Preparação para repouso",
    p.preparationDays,
    "dias do modelo",
  ),
  record(
    "coldCue",
    "Persistência do sinal frio",
    p.coldCueDays,
    "dias do modelo",
  ),
  record("chill", "Frio acumulado necessário", p.chillDays, "dias do modelo"),
  record(
    "minimumDormant",
    "Duração mínima do repouso",
    p.minimumDormantDays,
    "dias do modelo",
  ),
  record(
    "warmCue",
    "Persistência do sinal quente",
    p.warmCueDays,
    "dias do modelo",
  ),
  record("resume", "Retomada gradual", p.resumeDays, "dias do modelo"),
  record(
    "coldMinimum",
    "Limite inferior do frio acumulado",
    p.coldMinimum,
    "°C do modelo",
  ),
  record(
    "coldMaximum",
    "Limite superior do frio acumulado",
    p.coldMaximum,
    "°C do modelo",
  ),
  record("warmMinimum", "Sinal de retomada", p.warmMinimum, "°C do modelo"),
  record(
    "shortDay",
    "Sinal de dias curtos",
    p.shortDayHours,
    "h/dia do modelo",
  ),
  record(
    "activity",
    "Atividade e demanda em repouso",
    p.dormantActivity,
    "fração da referência",
  ),
  record(
    "maintenance",
    "Manutenção larval em repouso",
    p.larvalMaintenance,
    "fração da referência",
  ),
  record(
    "cocoon",
    "Custo adicional de um casulo",
    COCOON_COST,
    "crédito por cria",
  ),
  ...[
    {
      id: "coldProtocol",
      label: "Ar frio do protocolo publicado",
      value: 8,
      unit: "°C",
    },
    {
      id: "coldMonths",
      label: "Duração fria do protocolo publicado",
      value: 4,
      unit: "meses",
    },
    {
      id: "warmProtocol",
      label: "Ar de desenvolvimento do protocolo publicado",
      value: 26,
      unit: "°C",
    },
  ].map((x) => ({
    ...x,
    id: "seasonal." + x.id,
    topic: "seasonal" as const,
    version: 1,
    minModelRevision: 5,
    evidence: "protocol" as const,
    source: "willot-2026",
    sample: null,
    uncertainty:
      "Condição experimental, não ótimo universal; amostras individuais não extraídas.",
    context:
      "Willot et al. estudaram cinco espécies temperadas. Estas condições são apenas consulta; a demonstração não reproduz o experimento.",
    application: "none" as const,
  })),
];
