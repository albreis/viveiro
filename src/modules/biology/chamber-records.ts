import { CHAMBER_PARAMETERS as p } from "../chambers/types.ts";
import type { ParameterRecord } from "./types.ts";
const values = [
  ["sensorRadius", "Raio horizontal de sondagem", p.sensorRadius, "u."],
  ["probeDepth", "Profundidade rasa de leitura", p.probeDepth, "u."],
  [
    "exploreTicks",
    "Exploração antes de escolher o abrigo",
    p.exploreTicks,
    "passos",
  ],
  [
    "returnLimit",
    "Prazo de retorno ao ponto visitado",
    p.returnLimit,
    "passos",
  ],
  ["roamRadius", "Raio preferido de exploração", p.roamRadius, "u."],
  ["extraCost", "Custo adicional de sondagem", p.extraCost, "créditos/passo"],
  [
    "queenWater",
    "Água preferida na sondagem da rainha",
    p.queenWater,
    "fração dos poros",
  ],
  [
    "broodWater",
    "Água preferida pelas cuidadoras",
    p.broodWater,
    "fração dos poros",
  ],
  ["temperature", "Temperatura preferida no modelo", p.temperature, "°C"],
  ["memoryTicks", "Validade de leitura das câmaras", p.memoryTicks, "passos"],
] as const;
export const chamberRecords: readonly ParameterRecord[] = values.map(
  ([id, label, value, unit]) => ({
    id: "chambers." + id,
    label,
    value,
    unit,
    topic: "chambers",
    version: 1,
    minModelRevision: 7,
    requiresLocalChambers: true,
    evidence: "approximation",
    source: "viveiro-demo",
    sample: null,
    uncertainty:
      "Preferência demonstrativa, sem espécie ou microclima de câmara calibrados.",
    context:
      "Sondagem local rasa e memória de câmaras visitadas. Água nos poros não é umidade relativa do ar. A geometria não garante condições futuras.",
    application: "simulation",
  }),
);
