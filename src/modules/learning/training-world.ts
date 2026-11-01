import type { RouteOption } from "../navigation/local-route-policy.ts";
import { learningRng } from "./network.ts";
export interface TrainingArena {
  links: number[][];
  food: number;
  odor: number[][];
  comfort: number[];
}
export function trainingArena(seed: string): TrainingArena {
  const random = learningRng(seed),
    size = 12 + Math.floor(random() * 9),
    links = Array.from({ length: size }, () => [] as number[]);
  for (let i = 1; i < size; i++) {
    const p = Math.floor(random() * i);
    links[p].push(i);
    links[i].push(p);
  }
  const leaves = links.flatMap((n, i) => (n.length === 1 && i > 0 ? [i] : [])),
    food = leaves[Math.floor(random() * leaves.length)];
  const distances = (goal: number) => {
    const d = Array(size).fill(Infinity),
      queue = [goal];
    d[goal] = 0;
    for (const i of queue)
      for (const j of links[i])
        if (d[j] > d[i] + 1) {
          d[j] = d[i] + 1;
          queue.push(j);
        }
    return d;
  };
  return {
    links,
    food,
    odor: [distances(food), distances(0)],
    comfort: Array.from({ length: size }, (_, i) =>
      i && i !== food && random() < 0.15 ? 0.2 : 1,
    ),
  };
}
export function arenaOptions(
  arena: TrainingArena,
  node: number,
  loaded: boolean,
  recent: number[],
  random: () => number,
): RouteOption[] {
  const distance = arena.odor[loaded ? 1 : 0],
    goal = loaded ? 0 : arena.food;
  return arena.links[node].map((id) => ({
    id,
    signal: (distance[node] - distance[id]) * 0.035 + (random() - 0.5) * 0.06,
    visited: recent.includes(id),
    visits: recent.filter((n) => n === id).length,
    backtrack: recent.at(-1) === id,
    goalVisible: id === goal,
    comfort: arena.comfort[id],
  }));
}
