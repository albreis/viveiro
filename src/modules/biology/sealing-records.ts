import type { ParameterRecord } from "./types.ts";
import { SEAL_PARAMETERS as p } from "../sealing/types.ts";
const record = (
  id: string,
  label: string,
  value: number,
  unit: string,
): ParameterRecord => ({
  id: "sealing." + id,
  label,
  topic: "founding",
  version: 1,
  minModelRevision: 3,
  requiresEntrancePlug: true,
  value,
  unit,
  evidence: "approximation",
  source: "viveiro-demo",
  sample: null,
  uncertainty: "Coeficiente exploratório sem ajuste experimental.",
  context:
    "Tampão de terra transportada na revisão 3; difusão porosa e fluxo reduzido, sem isolamento térmico ou de umidade do ar calibrado.",
  application: "simulation",
});
export const sealingRecords = [
  record("depth", "Espessura do tampão", p.depth, "u."),
  record(
    "bite",
    "Material acomodado ou removido por passo",
    p.bite,
    "u³/passo",
  ),
  record("load", "Carga máxima de fechamento da rainha", p.maxLoad, "u³"),
  record(
    "diffusion",
    "Fração difusiva do tampão fechado",
    p.diffusionPorosity,
    "fração",
  ),
  record(
    "flow",
    "Fração de condutância do tampão fechado",
    p.flowPorosity,
    "fração",
  ),
];
