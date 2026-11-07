import type { BiologicalProfile, WorkerReference } from "./types.ts";

export const NARBONNE_PROFILE_ID = "messor-narbonne";
export const NARBONNE_PROFILE_VERSION = 1;

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
): BiologicalProfile {
  return Object.freeze({
    ...base,
    id: NARBONNE_PROFILE_ID,
    version: NARBONNE_PROFILE_VERSION,
    referenceSpecies: "Messor de Narbonne",
    workerReference: workers,
    forageModel: "seed-trails",
    cocoon: "absent",
    seasonality: "unmodelled",
    dormancyModel: undefined,
    label: "Messor de Narbonne · referência de Buhl",
    description:
      "Espécie-base do Viveiro. Perfil exploratório da população que Buhl chamou Messor sancta, provavelmente Messor bouvieri. Porte das operárias, caminhada em superfície e forrageamento de sementes têm referências próprias.",
  });
}
