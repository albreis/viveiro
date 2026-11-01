import type { TinyBrain, PolicyScore, TrainingResult } from "./types.ts";
import { createBrain, learningRng, forward, trainValue } from "./network.ts";
import { localFeatures, neuralChoice } from "./policy.ts";
import { trainingArena, arenaOptions } from "./training-world.ts";
import { chooseLocalExit } from "../navigation/local-route-policy.ts";
export function trainingEpisode(
  brain: TinyBrain,
  seed: string,
  mode: "train" | "neural" | "aco",
) {
  const arena = trainingArena(seed),
    random = learningRng(seed + ":actions");
  let node = 0,
    loaded = false,
    reward = 0,
    hazards = 0,
    steps = 0,
    recent: number[] = [],
    previous: number[] | undefined,
    pending = 0;
  for (; steps < 100; steps++) {
    const options = arenaOptions(arena, node, loaded, recent, random),
      features = options.map((o) => localFeatures(o, loaded));
    const epsilon = mode === "train" ? 0.12 : 0.025;
    const baselineChoice =
      mode === "aco" ? chooseLocalExit(options, random) : null;
    const pick =
      mode === "aco"
        ? options.findIndex((o) => o.id === baselineChoice)
        : neuralChoice(brain, features, random, epsilon);
    if (mode === "train" && previous)
      trainValue(
        brain,
        previous,
        pending + 0.95 * forward(brain, features[pick]).value,
        0.015,
      );
    previous = features[pick];
    recent = [...recent, node].slice(-8);
    node = options[pick].id;
    pending = -0.02;
    if (arena.comfort[node] < 1) {
      pending -= 0.08;
      hazards++;
    }
    if (!loaded && node === arena.food) {
      loaded = true;
      recent = [];
      pending += 1;
    }
    const done = loaded && node === 0;
    if (done) pending += 3;
    if (steps === 99 && !done) pending -= 1;
    reward += pending;
    if (done || steps === 99) {
      if (mode === "train") trainValue(brain, previous, pending, 0.015);
      steps++;
      return { delivered: done, steps, reward, hazards };
    }
  }
  return { delivered: false, steps, reward, hazards };
}
export function evaluateBrain(
  brain: TinyBrain,
  seed: string,
  mode: "neural" | "aco",
  episodes = 64,
): PolicyScore {
  let deliveries = 0,
    steps = 0,
    reward = 0,
    hazards = 0;
  for (let i = 0; i < episodes; i++) {
    const r = trainingEpisode(brain, seed + ":held-out:" + i, mode);
    deliveries += Number(r.delivered);
    steps += r.steps;
    reward += r.reward;
    hazards += r.hazards;
  }
  return {
    deliveries,
    episodes,
    meanSteps: steps / episodes,
    meanReward: reward / episodes,
    hazards,
  };
}
export function trainBrain(
  seed: string,
  episodes = 1200,
  onProgress?: (episode: number) => void,
): TrainingResult {
  if (!Number.isInteger(episodes) || episodes < 1 || episodes > 3000)
    throw new RangeError("Número de episódios fora do limite.");
  const brain = createBrain(seed),
    before = structuredClone(brain);
  for (let i = 0; i < episodes; i++) {
    trainingEpisode(brain, seed + ":train:" + i, "train");
    if ((i + 1) % 200 === 0) onProgress?.(i + 1);
  }
  return {
    brain,
    report: {
      seed,
      episodes,
      trained: evaluateBrain(brain, seed, "neural"),
      baseline: evaluateBrain(before, seed, "aco"),
      untrained: evaluateBrain(before, seed, "neural"),
    },
  };
}
