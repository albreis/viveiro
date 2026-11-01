import type { ParameterRecord, ParameterTopic } from "./types.ts";
const proposal = (
  id: string,
  label: string,
  range: readonly [number, number],
  unit: string,
  topic: ParameterTopic,
): ParameterRecord => ({
  id,
  label,
  range,
  unit,
  topic,
  value: null,
  version: 1,
  evidence: "hypothesis",
  source: "user-ai-notes",
  sample: null,
  uncertainty: "Espécie, amostra e dispersão não verificadas",
  context: "Faixa recebida para investigação; não altera timers.",
  application: "none",
});
export const proposedRecords: readonly ParameterRecord[] = [
  proposal("proposal.burrow", "Escavação inicial", [12, 24], "h", "founding"),
  proposal(
    "proposal.firstEggs",
    "Primeira postura após selamento",
    [1, 7],
    "d",
    "founding",
  ),
  proposal("proposal.clutch", "Primeira coorte", [5, 30], "ovos", "founding"),
  proposal("proposal.egg", "Ovo até larva", [10, 14], "d", "development"),
  proposal("proposal.larva", "Larva até pupa", [10, 15], "d", "development"),
  proposal("proposal.pupa", "Pupa até adulta", [10, 24], "d", "development"),
  proposal(
    "proposal.temperature",
    "Referência térmica proposta",
    [24, 27],
    "°C",
    "development",
  ),
];
