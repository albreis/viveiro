import { trainBrain } from "../modules/learning/train.ts";
self.onmessage = ({
  data,
}: {
  data: { id: number; seed: string; episodes?: number };
}) => {
  try {
    const episodes = Math.max(
        200,
        Math.min(3000, Math.round(data.episodes ?? 1200)),
      ),
      seed = String(data.seed).slice(0, 80);
    const result = trainBrain(seed, episodes, (episode) =>
      self.postMessage({ id: data.id, episode }),
    );
    self.postMessage({ id: data.id, result });
  } catch (error) {
    self.postMessage({
      id: data.id,
      error: error instanceof Error ? error.message : "Treino indisponível.",
    });
  }
};
