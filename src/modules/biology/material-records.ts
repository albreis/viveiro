import type { ParameterRecord } from "./types.ts";
import { MATERIAL_PARAMETERS as p } from "../soil-material/types.ts";
const names: Record<keyof typeof p, string> = {
  clayReference: "Referência do índice de argila",
  packingReference: "Referência de compactação",
  capillaryClay: "Peso da argila na redistribuição capilar",
  capillaryPacking: "Peso da compactação na redistribuição capilar",
  drainageClay: "Peso da argila na drenagem",
  drainagePacking: "Peso da compactação na drenagem",
  heatPacking: "Peso da compactação na condução térmica",
  densityPacking: "Peso da compactação na carga relativa",
  cohesionClay: "Peso da argila na coesão relativa",
  cohesionPacking: "Peso da compactação na coesão relativa",
  wetSoftening: "Amolecimento relativo em saturação alta",
};
export const materialRecords: readonly ParameterRecord[] = Object.entries(
  p,
).map(([id, value]) => ({
  id: "material." + id,
  label: names[id as keyof typeof p],
  value,
  unit: id.endsWith("Reference") ? "índice 0–100" : "coeficiente relativo",
  topic: "materials",
  version: 1,
  minModelRevision: 9,
  requiresSoilMaterial: true,
  evidence: "approximation",
  source: "viveiro-demo",
  sample: null,
  uncertainty:
    "Escolha exploratória normalizada; sem densidade, textura ou resistência experimentalmente ajustadas.",
  context:
    "Argila e compactação alteram transporte e capacidade relativa do teto; porosidade volumétrica fixa e volume de terra conservado. Não é um ensaio geotécnico.",
  application: "simulation",
}));
