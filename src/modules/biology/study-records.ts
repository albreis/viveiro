import type { ParameterRecord } from "./types.ts";
export const REFERENCE_AIR = Object.freeze({ temperatureC: 21, humidity: 80 });
const protocol = (
  id: string,
  label: string,
  value: number,
  unit: string,
): ParameterRecord => ({
  id,
  label,
  value,
  unit,
  topic: "study",
  version: 1,
  evidence: "protocol",
  source: "majidifar-2024",
  sample: null,
  uncertainty: "Condição de criação, não ótimo estimado",
  context:
    "Lasius niger; condição geral de incubadora. Variações e amostras por experimento na Tabela S1.",
  application: "preset",
});
export const studyRecords: readonly ParameterRecord[] = [
  protocol(
    "study.temperature",
    "Ar da incubadora",
    REFERENCE_AIR.temperatureC,
    "°C",
  ),
  protocol(
    "study.humidity",
    "Umidade da incubadora",
    REFERENCE_AIR.humidity,
    "%",
  ),
  {
    id: "study.workerProduction",
    label: "Rainhas sobreviventes que produziram operárias",
    value: 17 / 22,
    unit: "fração",
    topic: "study",
    version: 1,
    evidence: "measurement",
    source: "majidifar-2024",
    sample: 22,
    uncertainty: "Incerteza não extraída; amostra pequena",
    context:
      "17/22 sobreviventes em 93 dias; coorte inicial de 24. Não é prazo universal de fundação.",
    application: "none",
  },
];
