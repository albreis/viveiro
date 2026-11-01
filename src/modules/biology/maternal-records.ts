import type { ParameterRecord } from "./types.ts";
import { MATERNAL_PARAMETERS as settings } from "../maternal/types.ts";
const record = (
  id: string,
  label: string,
  value: number,
  unit: string,
): ParameterRecord => ({
  id,
  label,
  value,
  unit,
  topic: "model",
  version: 1,
  minModelRevision: 2,
  evidence: "approximation",
  source: "viveiro-demo",
  sample: null,
  uncertainty: "Coeficiente demonstrativo, sem ajuste experimental",
  context:
    "Só revisões com reservas separadas. Créditos abstratos disponíveis, não massa corporal nem calorimetria.",
  application: "simulation",
});
export const maternalRecords: readonly ParameterRecord[] = [
  record(
    "maternal.lipid",
    "Fração inicial de lipídio",
    settings.lipidFraction,
    "fração",
  ),
  record(
    "maternal.protein",
    "Fração inicial de proteína",
    settings.proteinFraction,
    "fração",
  ),
  record(
    "maternal.muscle",
    "Fração inicial de músculo",
    settings.muscleFraction,
    "fração",
  ),
  record(
    "maternal.histolysis",
    "Transferência de músculo para proteína",
    settings.histolysisPerTick,
    "u./passo",
  ),
  record(
    "maternal.eggCost",
    "Custo proteico por ovo",
    settings.eggCost,
    "u./ovo",
  ),
];
