import type { BiologicalProfile } from "./types.ts";
export function createMicroclimateProfiles(
  generic: BiologicalProfile,
): readonly BiologicalProfile[] {
  return [
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
    Object.freeze({
      ...generic,
      id: "generic-microclimate-demo",
      version: 3,
      modelRevision: 9,
      maternalModel: "pools" as const,
      entranceModel: "plug" as const,
      developmentModel: "thermal-demo" as const,
      dormancyModel: "obligate-demo" as const,
      seasonality: "seasonal" as const,
      cocoon: "present" as const,
      chamberModel: "local-demo" as const,
      stockModel: "rooms-demo" as const,
      materialModel: "relative-demo" as const,
      label: "Solo · composição e suporte",
      description:
        "Índices relativos de argila e compactação ajustam transporte de água/calor e suporte do teto. Capacidade de poros fixa; sem densidade ou engenharia calibradas.",
    }),
  ];
}
