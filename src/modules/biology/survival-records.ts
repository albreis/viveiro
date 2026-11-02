import type { ParameterRecord } from "./types.ts";
import { SURVIVAL_PARAMETERS as p } from "../survival/types.ts";
const names: Record<keyof typeof p, string> = {
  queenScaleDays: "Escala de envelhecimento da rainha",
  workerScaleDays: "Escala de envelhecimento da operária",
  maleScaleDays: "Escala de envelhecimento do macho",
  ageShape: "Forma da curva de envelhecimento",
  wasteExposurePerDay: "Exposição local por resíduos",
  contactExposurePerDay: "Transmissão por contato local",
  clearancePerDay: "Remoção da carga com nutrição plena",
  diseaseHazardPerDay: "Risco por carga infecciosa",
  woundHazardMultiplier: "Modulação do risco por ferimentos",
  repairHpPerDay: "Reparo corporal máximo",
  repairFoodPerHp: "Custo alimentar do reparo",
  challengeDose: "Carga do desafio experimental",
};
export const survivalRecords: readonly ParameterRecord[] = Object.entries(
  p,
).map(([id, value]) => ({
  id: "survival." + id,
  label: names[id as keyof typeof p],
  value,
  unit: id.endsWith("Days")
    ? "dias do modelo"
    : id === "ageShape" || id === "woundHazardMultiplier"
      ? "adimensional"
      : id === "repairHpPerDay"
        ? "pontos de saúde/dia"
        : id === "repairFoodPerHp"
          ? "créditos/ponto de saúde"
          : id === "challengeDose"
            ? "índice 0–1"
            : "por dia do modelo",
  topic: "survival",
  version: 1,
  minModelRevision: 11,
  requiresSurvival: true,
  evidence: "approximation",
  source: "viveiro-demo",
  sample: null,
  uncertainty:
    "Curva e taxas escolhidas para investigação; sem ajuste de sobrevivência ou doença por espécie.",
  context:
    "Riscos de idade e doença são separados de energia, ferimentos, infertilidade e predação. A escala não é idade máxima nem expectativa natural medida.",
  application: "simulation",
}));
