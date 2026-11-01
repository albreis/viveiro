import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import type { IntrusionTask } from "./types.ts";
import {
  requestRoute,
  continueLocalRoute,
} from "../navigation/local-routing.ts";
/** Choose by the chemical channel sensed at the current node, never by a global path search. */
export function requestIntrusionRoute(
  w: ColonyWorld,
  a: ColonyAgent,
  t: IntrusionTask,
) {
  if (a.node === null) return;
  if (t.phase === "exit") {
    requestRoute(w, a, t.entry, t.owner);
    return;
  }
  const fields = ("nestOdors" in w ? w.nestOdors : undefined) as
    { fields: Record<string, number[]> } | undefined;
  const storage = fields?.fields[t.owner + ":storage"]?.[a.node] || 0;
  t.goal ??= storage > 0.000001 ? "storage" : "royal";
  a.routeIntent = {
    destination: t.entry,
    tag: t.goal,
    odor: t.goal,
    owner: t.owner,
  };
  continueLocalRoute(w, a);
}
