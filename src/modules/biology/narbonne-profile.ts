import type { BiologicalProfile, WorkerReference } from "./types.ts";

export const NARBONNE_PROFILE_ID = "messor-narbonne";
export const NARBONNE_PROFILE_VERSION = 2;

const workers: WorkerReference = Object.freeze({
  bodyMm: 5,
  bodyRangeMm: [4, 8] as const,
  openWalkingMmPerSecond: 15.05,
  seedForaging: Object.freeze({
    searchFactor: [1.15, 0.85] as const,
    loadedWalkingFactor: [0.9, 1.1] as const,
  }),
  temperatures: [
    { celsius: 16, speedMmPerSecond: 8 },
    { celsius: 25, speedMmPerSecond: 11.4 },
    { celsius: 30, speedMmPerSecond: 15 },
  ] as const,
});

export function createNarbonneProfile(
  base: BiologicalProfile,
  version: number,
): BiologicalProfile {
  return Object.freeze({
    ...base,
    id: NARBONNE_PROFILE_ID,
    version,
    referenceSpecies: "Messor de Narbonne",
    workerReference: workers,
    ...(version === 2
      ? {
          workerReference: Object.freeze({
            ...workers,
            tunnelWalking: Object.freeze({
              wallFactor: 0.82,
              soilLoadFactor: 0.85,
            }),
          }),
          founderBodyMm: Object.freeze({ queen: 11, male: 8 }),
          seedMeals: true as const,
          reproductiveCalendar: Object.freeze({
            yearDays: 80,
            initialDay: 59,
            laying: [17, 53] as const,
            alates: [43, 53] as const,
            flight: [55, 70] as const,
            restFactor: 0.18,
          }),
        }
      : {}),
    forageModel: "seed-trails",
    cocoon: "absent",
    seasonality: version === 2 ? "seasonal" : "unmodelled",
    dormancyModel: undefined,
    label: "Messor de Narbonne · referência de Buhl",
    description:
      version === 2
        ? "Perfil exploratório de Narbonne, provável Messor bouvieri. Sementes preparadas, marcha em galerias, tamanho dos alados e calendário mediterrâneo demonstrativo."
        : "Espécie-base do Viveiro. Perfil exploratório da população que Buhl chamou Messor sancta, provavelmente Messor bouvieri. Porte das operárias, caminhada em superfície e forrageamento de sementes têm referências próprias.",
  });
}
