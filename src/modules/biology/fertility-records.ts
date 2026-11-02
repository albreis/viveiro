import type { ParameterRecord } from "./types.ts";
import { FERTILITY_PARAMETERS as p } from "../fertility/types.ts";
const labels: Record<keyof typeof p, string> = {
  creditsPerMating: "Capacidade por macho encontrado",
  usePerFemale: "Crédito usado por ovo fecundado",
  decayPerDay: "Perda de viabilidade por dia do modelo",
  maxMates: "Limite de machos registrados na ocasião de acasalamento",
};
export const fertilityRecords: readonly ParameterRecord[] = Object.entries(
  p,
).map(([id, value]) => ({
  id: "fertility." + id,
  label: labels[id as keyof typeof p],
  value,
  unit:
    id === "decayPerDay"
      ? "por dia do modelo"
      : id === "maxMates"
        ? "machos"
        : "créditos abstratos",
  topic: "fertility",
  version: 1,
  minModelRevision: 10,
  requiresFertility: true,
  evidence: "approximation",
  source: "viveiro-demo",
  sample: null,
  uncertainty:
    "Sem capacidade, senescência espermática ou frequência de poliandria calibradas por espécie.",
  context:
    "Saldo recebido = viável + utilizado + perdido. Fêmeas têm cópia paterna de um macho registrado; ovos não fecundados são machos haploides neste perfil demonstrativo.",
  application: "simulation",
}));
