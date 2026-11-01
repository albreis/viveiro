import type { FamilyWorld } from "../colonies/types.ts";
import { colonyWorlds } from "../colonies/types.ts";
import { createLearning } from "./live.ts";
import { validBrain } from "./network.ts";
import type { TrainingReport, TrainingResult } from "./types.ts";
function validReport(r: TrainingReport) {
  return (
    r &&
    typeof r.seed === "string" &&
    r.seed.length <= 128 &&
    Number.isInteger(r.episodes) &&
    r.episodes > 0 &&
    r.episodes <= 10000 &&
    [r.trained, r.baseline, r.untrained].every(
      (s) =>
        s &&
        Number.isInteger(s.episodes) &&
        s.episodes > 0 &&
        s.episodes <= 1000 &&
        Number.isInteger(s.deliveries) &&
        s.deliveries >= 0 &&
        s.deliveries <= s.episodes &&
        [s.meanSteps, s.meanReward, s.hazards].every(Number.isFinite),
    )
  );
}
export function applyLearningIntervention(
  w: FamilyWorld,
  type: string,
  value: unknown,
): boolean | null {
  if (type === "learningPolicy") {
    const data = value as TrainingResult;
    if (!data || !validBrain(data.brain) || !validReport(data.report)) {
      w.log("Política inválida. O treino não foi aplicado.");
      return false;
    }
    for (const c of colonyWorlds(w)) {
      c.learning = createLearning(c.seed, data.brain);
      c.learning.training = structuredClone(data.report);
      for (const a of c.ants) {
        delete a.learningTrace;
        delete a.learningBrain;
        delete a.learningUpdates;
      }
    }
    w.log(
      "Política neural experimental aplicada às colônias atuais. Aprendizado usa encontros e objetivos locais.",
    );
    return true;
  }
  if (type === "learningEnabled") {
    const enabled = value === 1;
    if (enabled && !colonyWorlds(w).some((c) => c.learning)) {
      w.log("Treine e aplique uma política antes de ativar o aprendizado.");
      return false;
    }
    for (const c of colonyWorlds(w)) {
      if (!c.learning) continue;
      c.learning.enabled = enabled;
      for (const a of c.ants) delete a.learningTrace;
    }
    w.log(enabled ? "Aprendizado local retomado." : "Navegação ACO retomada.");
    return true;
  }
  return null;
}
