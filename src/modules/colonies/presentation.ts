import type { FamilyWorld } from "./types.ts";
import { allAnts, allBrood, colonyWorlds } from "./types.ts";
export interface FamilyPresentation extends FamilyWorld {
  colonyCount: number;
  foundings: {
    colonyId: number;
    queenId?: number;
    state: NonNullable<FamilyWorld["founding"]>;
  }[];
}
/** Render a combined habitat without merging the colonies' biological resource pools. */
export function presentFamily<T extends FamilyWorld>(
  world: T,
): FamilyPresentation & T {
  const colonies = colonyWorlds(world),
    ants = allAnts(world),
    view = Object.create(world) as FamilyPresentation & T;
  view.ants = ants;
  view.brood = allBrood(world);
  view.food = colonies.reduce(
    (s, c) => s + c.food + (c.colony.reproductiveFood || 0),
    0,
  );
  view.colonyCount = colonies.length;
  view.events = colonies
    .flatMap((c) => c.events)
    .sort((a, b) => b.tick - a.tick)
    .slice(0, 35);
  view.foundings = colonies.flatMap((c) =>
    c.founding
      ? [
          {
            colonyId: c.colonyId || 1,
            queenId: c.genetics?.queen.id,
            state: c.founding,
          },
        ]
      : [],
  );
  Object.defineProperties(view, {
    population: { value: ants.length },
    workers: { value: ants.filter((a) => a.kind === "worker") },
  });
  return view;
}
