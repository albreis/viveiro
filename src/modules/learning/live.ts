import type { AgentState, NavigationWorld } from "../navigation/types.ts";
import type { LearningState, TinyBrain } from "./types.ts";
import type { RouteOption } from "../navigation/local-route-policy.ts";
import { createBrain, forward, trainValue } from "./network.ts";
import { localFeatures, neuralChoice } from "./policy.ts";
export const createLearning = (
  seed: string,
  brain: TinyBrain = createBrain(seed),
): LearningState => ({
  version: 1,
  enabled: true,
  brain: structuredClone(brain),
  decisions: 0,
  updates: 0,
  reward: 0,
});
export function chooseLearnedExit(
  w: NavigationWorld,
  a: AgentState,
  options: RouteOption[],
  random: () => number,
) {
  const state = w.learning;
  if (!state?.enabled) return null;
  const features = options.map((o) =>
    localFeatures(o, !!(a.carrying || a.carryingBrood || a.carryingSoil)),
  );
  if (!features.length) return null;
  const brain = (a.learningBrain ??= structuredClone(state.brain));
  const choice = neuralChoice(brain, features, random, 0.05);
  const trace = a.learningTrace;
  if (trace?.finished) {
    trainValue(
      brain,
      trace.features,
      trace.reward + 0.95 * forward(brain, features[choice]).value,
      0.005,
    );
    a.learningUpdates = (a.learningUpdates ?? 0) + 1;
    state.updates++;
    state.reward += trace.reward;
  }
  a.learningTrace = {
    features: features[choice],
    reward: 0,
    tick: w.tick,
    from: a.node ?? -1,
  };
  state.decisions++;
  return options[choice].id;
}
export function learningTick(w: NavigationWorld, a: AgentState) {
  if (!w.learning?.enabled || !a.learningTrace || a.learningTrace.finished)
    return;
  a.learningTrace.reward -=
    0.0005 +
    Math.max(0, 35 - a.energy) * 0.00001 +
    ((a.navigation?.contactTicks ?? 0) > 5 ? 0.001 : 0);
}
export function finishLearningEdge(
  w: NavigationWorld,
  a: AgentState,
  goal: boolean,
  reversed = false,
) {
  const s = w.learning,
    t = a.learningTrace;
  if (!s?.enabled || !t) return;
  t.finished = true;
  if (reversed) t.reward -= 0.1;
  if (goal) {
    t.reward += 0.3;
    const brain = (a.learningBrain ??= structuredClone(s.brain));
    trainValue(brain, t.features, t.reward, 0.005);
    a.learningUpdates = (a.learningUpdates ?? 0) + 1;
    s.updates++;
    s.reward += t.reward;
    delete a.learningTrace;
  }
}

export function learningDeath(w: NavigationWorld, a: AgentState) {
  const s = w.learning,
    t = a.learningTrace;
  if (!s?.enabled || !t) return;
  const brain = (a.learningBrain ??= structuredClone(s.brain));
  t.reward -= 0.5;
  trainValue(brain, t.features, t.reward, 0.005);
  a.learningUpdates = (a.learningUpdates ?? 0) + 1;
  s.updates++;
  s.reward += t.reward;
  delete a.learningTrace;
}
