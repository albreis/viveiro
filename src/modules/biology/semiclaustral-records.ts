import type { ParameterRecord } from "./types.ts";
import { FORAGING_PARAMETERS as p } from "../semiclaustral/types.ts";
const values = [
  ["capacity", "Carga máxima da rainha", p.capacity, "créditos"],
  ["sensorRadius", "Alcance local de alimento", p.sensorRadius, "u."],
  ["contactRadius", "Distância de coleta", p.contactRadius, "u."],
  ["pantryTarget", "Alvo de alimento na câmara", p.pantryTarget, "créditos"],
  ["searchLimit", "Limite de busca antes do retorno", p.searchLimit, "passos"],
  ["restTicks", "Intervalo entre viagens", p.restTicks, "passos"],
  ["travelCost", "Custo adicional de busca", p.travelCost, "créditos/passo"],
] as const;
export const semiclaustralRecords: readonly ParameterRecord[] = values.map(
  ([id, label, value, unit]) => ({
    id: "semiclaustral." + id,
    label,
    value,
    unit,
    topic: "semiclaustral",
    version: 1,
    minModelRevision: 6,
    evidence: "approximation",
    source: "viveiro-demo",
    sample: null,
    uncertainty: "Escolha demonstrativa, sem espécie ou dieta calibrada.",
    context:
      "Coleta pela rainha por sensores locais, carga limitada e alimento externo finito separado da reserva materna.",
    application: "simulation",
  }),
);
