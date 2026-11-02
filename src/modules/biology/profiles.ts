import type { BiologicalProfile } from "./types.ts";
import { REFERENCE_AIR } from "./study-records.ts";
const generic: BiologicalProfile = Object.freeze({
  id: "generic-demo",
  version: 1,
  label: "Genérico · demonstração",
  modelSpecies: null,
  referenceSpecies: null,
  foundation: "claustral",
  cocoon: "unspecified",
  seasonality: "unmodelled",
  maternalModel: "scalar",
  climate: Object.freeze({}),
  description:
    "Modelo genérico acelerado; castas/ecologia combinadas, sem espécie calibrada.",
});
const lab: BiologicalProfile = Object.freeze({
  ...generic,
  id: "lab-lniger-2024",
  label: "Ar de referência · L. niger (2024)",
  referenceSpecies: "Lasius niger",
  climate: REFERENCE_AIR,
  description:
    "Só inicia o ar em 21 °C e 80% conforme condição de laboratório. Biologia e solo continuam genéricos; não reproduz o experimento.",
});
export const biologicalProfiles: readonly BiologicalProfile[] = Object.freeze([
  generic,
  lab,
  Object.freeze({
    ...generic,
    version: 2,
    label: "Genérico · reservas maternas",
    maternalModel: "pools",
    description:
      "Reservas de lipídio, proteína e músculo em unidades abstratas. Modelo genérico exploratório, sem espécie calibrada.",
  }),
  Object.freeze({
    ...lab,
    version: 2,
    maternalModel: "pools",
    description:
      lab.description + " Reservas maternas separadas nesta revisão.",
  }),
  ...[generic, lab].map((p) =>
    Object.freeze({
      ...p,
      version: 3,
      maternalModel: "pools" as const,
      entranceModel: "plug" as const,
      label: p.id === "generic-demo" ? "Genérico · fundação selada" : p.label,
      description:
        p.description +
        " Reservas maternas e tampão físico nesta revisão; parâmetros exploratórios.",
    }),
  ),
  ...[generic, lab].map((p) =>
    Object.freeze({
      ...p,
      version: 4,
      maternalModel: "pools" as const,
      entranceModel: "plug" as const,
      developmentModel: "thermal-demo" as const,
      label: p.id === "generic-demo" ? "Genérico · maturação térmica" : p.label,
      description:
        p.description +
        " Maturação térmica demonstrativa e tampão físico. Durações não calibradas por espécie.",
    }),
  ),
  ...[generic, lab].map((p) =>
    Object.freeze({
      ...p,
      version: 5,
      maternalModel: "pools" as const,
      entranceModel: "plug" as const,
      developmentModel: "thermal-demo" as const,
      dormancyModel: "obligate-demo" as const,
      seasonality: "seasonal" as const,
      cocoon: "present" as const,
      label:
        p.id === "generic-demo" ? "Genérico · sazonal com casulos" : p.label,
      description:
        p.description +
        " Diapausa reprodutiva demonstrativa com memória e casulos pagos. Não calibrado para uma espécie.",
    }),
  ),
  Object.freeze({
    ...generic,
    id: "generic-naked-demo",
    version: 1,
    modelRevision: 5,
    maternalModel: "pools" as const,
    entranceModel: "plug" as const,
    developmentModel: "thermal-demo" as const,
    dormancyModel: "obligate-demo" as const,
    seasonality: "seasonal" as const,
    cocoon: "absent" as const,
    label: "Sazonal · pupa nua (demonstração)",
    description:
      "Variante genérica sem casulo, com diapausa reprodutiva, reservas e tampão. Não corresponde a uma espécie calibrada.",
  }),
  Object.freeze({
    ...generic,
    id: "generic-semiclaustral-demo",
    version: 1,
    modelRevision: 6,
    foundation: "semiclaustral" as const,
    maternalModel: "pools" as const,
    entranceModel: "open" as const,
    developmentModel: "thermal-demo" as const,
    cocoon: "absent" as const,
    label: "Semiclaustral · coleta da rainha",
    description:
      "Variante demonstrativa com entrada aberta e coleta externa local pela rainha. Alimento finito separado das reservas iniciais; sem espécie calibrada.",
  }),
  Object.freeze({
    ...generic,
    id: "generic-microclimate-demo",
    version: 1,
    modelRevision: 7,
    maternalModel: "pools" as const,
    entranceModel: "plug" as const,
    developmentModel: "thermal-demo" as const,
    dormancyModel: "obligate-demo" as const,
    seasonality: "seasonal" as const,
    cocoon: "present" as const,
    chamberModel: "local-demo" as const,
    label: "Microclima · escolha local",
    description:
      "Rainha visita o solo antes de escavar e cuidadoras comparam apenas câmaras visitadas. Água nos poros como proxy; sem clima de câmara ou espécie calibrados.",
  }),
  Object.freeze({
    ...generic,
    id: "generic-microclimate-demo",
    version: 2,
    modelRevision: 8,
    maternalModel: "pools" as const,
    entranceModel: "plug" as const,
    developmentModel: "thermal-demo" as const,
    dormancyModel: "obligate-demo" as const,
    seasonality: "seasonal" as const,
    cocoon: "present" as const,
    chamberModel: "local-demo" as const,
    stockModel: "rooms-demo" as const,
    label: "Microclima · estoques por câmara",
    description:
      "Sondagem local e estoque alimentar por câmara. Entregas procuram locais secos conhecidos; deterioração usa o clima da pilha. Nutrição da prole ainda usa orçamento coletivo. Sem espécie calibrada.",
  }),
]);
export function latestBiologicalProfiles(): BiologicalProfile[] {
  const latest = new Map<string, BiologicalProfile>();
  for (const p of biologicalProfiles)
    if (p.version > (latest.get(p.id)?.version ?? 0)) latest.set(p.id, p);
  return [...latest.values()];
}
