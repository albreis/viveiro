import { resolveBiologicalProfile } from "../biology/catalog.ts";
import type { FoundingWorld } from "../founding/types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import { changePhase } from "../founding/types.ts";
import { walkFoundress } from "../founding/motion.ts";
import { travelToFront, haulFoundingSoil } from "../founding/travel.ts";
import { depositSoil } from "../soil/ledger.ts";
import { removePlug } from "./material.ts";
import { sealDumpPoint } from "./queen.ts";
import { SEAL_PARAMETERS } from "./types.ts";
/** A single local worker opens a pilot hole, then physically carries each load outside. */
export function updateSealWorker(w: FoundingWorld, a: ColonyAgent): boolean {
  const f = w.founding,
    task = f?.seal,
    pilot =
      resolveBiologicalProfile(w.biologicalProfile).establishmentModel ===
      "pilot-access";
  if (
    !task ||
    (f!.phase !== "claustral" && !(pilot && f!.phase === "established")) ||
    task.phase === "opened" ||
    a.kind !== "worker"
  )
    return false;
  const p = w.nest.plugs?.find((p) => p.id === task.plugId);
  if (!p) return false;
  if (
    task.workerId === undefined ||
    !w.ants.some((x) => x.id === task.workerId)
  )
    task.workerId = a.id;
  if (task.workerId !== a.id) return false;
  delete a.bioTask;
  delete a.soilTask;
  if (task.phase === "closed") {
    task.phase = "remove";
    a.route = [];
    delete a.routeIntent;
    delete a.supportMotion;
  }
  if (task.phase === "haul") {
    a.state = "Levando terra do tampão para fora";
    if (haulFoundingSoil(w, a, sealDumpPoint(w))) {
      depositSoil(w, a);
      task.trips++;
      if (p.mass <= 1e-9) {
        task.phase = "opened";
        task.openedTick = w.tick;
        a.route = [];
        delete a.routeIntent;
        if (f!.phase !== "established")
          changePhase(
            w,
            "established",
            "As naníticas removeram o tampão e transportaram a terra para fora. A entrada permite forrageamento.",
          );
      } else {
        task.phase = "return";
        // A completed trip proves physical access to external food before all
        // plug material is gone. Keep hauling the remainder after foundation.
        if (pilot && f!.phase === "claustral")
          changePhase(
            w,
            "established",
            "As naníticas abriram uma passagem e levaram a primeira carga de terra para fora. A colônia pode usar alimento externo enquanto termina de abrir a entrada.",
          );
      }
    }
    return true;
  }
  if (task.phase === "return") {
    a.state = "Voltando ao tampão";
    if (!travelToFront(w, a, task.workerPoint)) return true;
    task.phase = "remove";
    a.route = [];
    delete a.routeIntent;
  }
  a.state = "Escavando o tampão da entrada";
  if (!walkFoundress(w, a, task.workerPoint)) return true;
  removePlug(w, a, p, SEAL_PARAMETERS.bite);
  // Keep opening the pilot until this body and its load can cross it.
  const required = 0.14 * (a.bodyScale || 1) + 0.03;
  if (
    p.mass <= 1e-9 ||
    ((a.carryingSoil || 0) >= 0.04 && p.innerRadius > required + 0.02)
  ) {
    task.phase = "haul";
    delete a.supportMotion;
  }
  return true;
}
