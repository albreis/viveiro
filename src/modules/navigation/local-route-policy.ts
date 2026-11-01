import { sampleACO } from "../chemistry/aco.ts";
export interface RouteOption {
  id: number;
  signal: number;
  visited: boolean;
  backtrack: boolean;
  goalVisible: boolean;
}
/** Policy input contains only local exits and recent experience, never the world map. */
export function chooseLocalExit(
  options: readonly RouteOption[],
  random: () => number,
) {
  if (!options.length) return null;
  if (options.length === 1) return options[0].id;
  const pheromone = options.map((o) =>
    Math.exp(Math.max(-6, Math.min(6, o.signal * 60))),
  );
  const heuristic = options.map((o) =>
    o.goalVisible ? 100 : o.backtrack ? 0.12 : o.visited ? 0.5 : 1,
  );
  return options[
    sampleACO(pheromone, heuristic, random, {
      alpha: 1.4,
      beta: 2,
      exploration: 0.025,
    })
  ].id;
}
