import type { TrainingReport } from "../modules/learning/types.ts";
export const learningNumber = (value: number, digits = 1) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
export function describeTraining(r: TrainingReport) {
  return (
    "Teste reservado do modelo inicial (" +
    r.seed +
    "): rede " +
    r.trained.deliveries +
    "/" +
    r.trained.episodes +
    " entregas · ACO " +
    r.baseline.deliveries +
    "/" +
    r.baseline.episodes +
    " · sem treino " +
    r.untrained.deliveries +
    "/" +
    r.untrained.episodes +
    ". Passos médios: rede " +
    learningNumber(r.trained.meanSteps) +
    " · ACO " +
    learningNumber(r.baseline.meanSteps) +
    ". São grafos de treino; desempenho no terrário pode ser diferente."
  );
}
