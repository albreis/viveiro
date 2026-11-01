import type { ParameterRecord } from "./types.ts";
import { DEVELOPMENT_PARAMETERS as p } from "../development/types.ts";
const record = (
  id: string,
  label: string,
  value: number,
  unit: string,
): ParameterRecord => ({
  id: "development." + id,
  label,
  value,
  unit,
  topic: "development",
  version: 1,
  minModelRevision: 4,
  evidence: "approximation",
  source: "viveiro-demo",
  sample: null,
  uncertainty:
    "Escolha demonstrativa não ajustada a espécie, estágio ou população natural.",
  context:
    "Revisão 4: dias do modelo acelerado. Temperatura local e água nos poros, que não equivale à umidade relativa da câmara. As faixas recebidas de outra IA continuam hipóteses inativas.",
  application: "simulation",
});
export const developmentRecords = [
  record("egg", "Duração de referência do ovo", p.eggDays, "dia do modelo"),
  record(
    "larva",
    "Duração de referência da larva",
    p.larvaDays,
    "dia do modelo",
  ),
  record("pupa", "Duração de referência da pupa", p.pupaDays, "dia do modelo"),
  record("minimum", "Limite frio da curva", p.minimum, "°C do modelo"),
  record("optimum", "Pico escolhido da curva", p.optimum, "°C do modelo"),
  record("maximum", "Limite quente da curva", p.maximum, "°C do modelo"),
  record(
    "stress",
    "Acúmulo máximo de estresse",
    p.stressPerTick,
    "fração/passo",
  ),
  record(
    "recovery",
    "Recuperação máxima do estresse",
    p.recoveryPerTick,
    "fração/passo",
  ),
  record(
    "waterDry",
    "Água no solo: limite seco",
    p.waterDry,
    "fração dos poros",
  ),
  record(
    "waterComfortDry",
    "Água no solo: início do platô",
    p.waterComfortDry,
    "fração dos poros",
  ),
  record(
    "waterComfortWet",
    "Água no solo: fim do platô",
    p.waterComfortWet,
    "fração dos poros",
  ),
  record(
    "waterWet",
    "Água no solo: limite molhado",
    p.waterWet,
    "fração dos poros",
  ),
];
