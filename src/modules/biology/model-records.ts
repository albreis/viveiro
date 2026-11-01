import { TICKS_PER_DAY } from "../simulation/constants.js";
import { DEMO_FOUNDING_RESERVE, DEMO_BROOD_STAGES } from "./demo-constants.ts";
import type { ParameterRecord } from "./types.ts";
const approximation = (
  id: string,
  label: string,
  value: number,
  unit: string,
  context: string,
): ParameterRecord => ({
  id,
  label,
  value,
  unit,
  context,
  topic: "model",
  version: 1,
  evidence: "approximation",
  source: "viveiro-demo",
  sample: null,
  uncertainty: "Não aferida; escolha do modelo",
  application: "simulation",
});
export const modelRecords: readonly ParameterRecord[] = [
  approximation(
    "clock.ticksPerDay",
    "Relógio demonstrativo",
    TICKS_PER_DAY,
    "passos/dia do modelo",
    "Não estabelece equivalência fisiológica por espécie.",
  ),
  approximation(
    "founding.reserves",
    "Reserva inicial genérica",
    DEMO_FOUNDING_RESERVE,
    "u. de reserva",
    "Orçamento claustral abstrato; não representa gramas de gordura/proteína.",
  ),
  approximation(
    "brood.larva",
    "Transição genérica para larva",
    DEMO_BROOD_STAGES.larva,
    "fração de desenvolvimento",
    "Progresso interno acelerado; não são dias de incubação.",
  ),
  approximation(
    "brood.pupa",
    "Transição genérica para pupa",
    DEMO_BROOD_STAGES.pupa,
    "fração de desenvolvimento",
    "Não distingue espécies com/sem casulo nesta versão.",
  ),
];
