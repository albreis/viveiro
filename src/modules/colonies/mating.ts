import type { FamilyWorld } from "./types.ts";
import { colonyWorlds } from "./types.ts";
import { flightReadiness } from "../founding/flight.ts";
import { spawnDaughter, MAX_COLONIES } from "./spawn.ts";
/** One pair per cohort. Mate choice across colonies is a later ecological extension. */
export function coordinateFlights(root: FamilyWorld) {
  for (const w of colonyWorlds(root)) {
    if (w.landscape.rainPulse > 0.15) w.lastFlightRain = w.tick;
    if (colonyWorlds(root).length >= MAX_COLONIES) return;
    const gyne = w.ants.find(
        (a) => a.kind === "gyne" && a.sexual && a.age >= 1,
      ),
      male = w.ants.find((a) => a.kind === "male" && a.sexual && a.age >= 1);
    if (!gyne || !male) continue;
    const memory = {
      ...w.founding,
      lastRain: w.lastFlightRain ?? w.founding?.lastRain ?? -1000,
    };
    const readiness = flightReadiness(w, memory);
    w.lastFlightRain = memory.lastRain;
    if (readiness <= 0) continue;
    if (!gyne.departure && w.random() >= readiness * 0.2) continue;
    gyne.departure = male.departure = true;
    if (gyne.node === null && male.node === null)
      spawnDaughter(root, w, gyne, male);
  }
}
