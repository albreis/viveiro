import { locale, t } from "../i18n/runtime.ts";
import type { TrainingReport } from "../modules/learning/types.ts";
export const learningNumber = (value: number, digits = 1) =>
  value.toLocaleString(locale.locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
export function describeTraining(r: TrainingReport) {
  return t("execution.learning.report", {
    seed: r.seed,
    trained: r.trained.deliveries,
    episodes: r.trained.episodes,
    baseline: r.baseline.deliveries,
    baselineEpisodes: r.baseline.episodes,
    untrained: r.untrained.deliveries,
    untrainedEpisodes: r.untrained.episodes,
    trainedSteps: learningNumber(r.trained.meanSteps),
    baselineSteps: learningNumber(r.baseline.meanSteps),
  });
}
