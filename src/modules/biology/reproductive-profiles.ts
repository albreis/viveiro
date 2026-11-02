import type { BiologicalProfile } from "./types.ts";
import { createMicroclimateProfiles } from "./microclimate-profiles.ts";
export function createReproductiveProfiles(
  generic: BiologicalProfile,
): readonly BiologicalProfile[] {
  const fertility = Object.freeze({
    ...createMicroclimateProfiles(generic)[2],
    id: "generic-fertility-demo",
    version: 1,
    modelRevision: 10,
    fertilityModel: "finite-demo" as const,
    label: "Fertilidade · espermateca finita",
    description:
      "Créditos reprodutivos finitos por macho encontrado, perda de viabilidade e parentesco por ovo. Sem capacidade de armazenamento ou taxa de perda calibradas; esgotamento altera o sexo da prole, não mata a rainha.",
  });
  return [
    fertility,
    Object.freeze({
      ...fertility,
      id: "generic-survival-demo",
      version: 1,
      modelRevision: 11,
      survivalModel: "risk-demo" as const,
      label: "Saúde · riscos e longevidade",
      description:
        "Energia, ferimentos, infecção local e risco por idade separados. Curvas e taxas demonstrativas; não prevê longevidade natural de uma espécie. Rainha pode consumir estoque acessível na própria câmara.",
    }),
  ];
}
