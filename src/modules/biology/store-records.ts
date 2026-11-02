import type { ParameterRecord } from "./types.ts";
import { STORE_PARAMETERS as p } from "../stores/types.ts";
const values = [
  [
    "preferredWater",
    "Água preferida para guardar alimento",
    p.preferredWater,
    "fração dos poros",
  ],
  [
    "spoilWater",
    "Início demonstrativo da deterioração",
    p.spoilWater,
    "fração dos poros",
  ],
  [
    "spoilRate",
    "Taxa de deterioração da pilha",
    p.spoilRate,
    "fração por 100 passos e excesso hídrico",
  ],
] as const;
export const storeRecords: readonly ParameterRecord[] = values.map(
  ([id, label, value, unit]) => ({
    id: "stores." + id,
    label,
    value,
    unit,
    topic: "chambers",
    version: 1,
    minModelRevision: 8,
    requiresRoomStores: true,
    evidence: "approximation",
    source: "viveiro-demo",
    sample: null,
    uncertainty:
      "Créditos e umidade preferida demonstrativos; sem dieta ou fungo calibrados.",
    context:
      "Alimento por câmara, preferência baseada em visitas e deterioração no ponto da pilha. Água nos poros não é umidade relativa do ar da câmara.",
    application: "simulation",
  }),
);
