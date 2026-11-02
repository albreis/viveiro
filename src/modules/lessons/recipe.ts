import { lessonReference, type LessonReference } from "./reference.ts";
import { lessonWorld, populateLesson, finishLessonWorld } from "./world.ts";
import {
  ventilationNest,
  preparedAir,
  warmSoil,
  maternalAllele,
  initialTrail,
} from "./treatments.ts";
import { normalizeSession } from "../persistence/validation.ts";
import type { SessionState } from "../persistence/types.ts";

export function createLessonSession(value: LessonReference): SessionState {
  const ref = lessonReference(value);
  const seed = "AULA-v1-" + ref.id;
  const founding = ref.id === "fundacao-coleta";
  const worlds = [false, true].map((b) => {
    const w = lessonWorld(seed, founding && b, founding);
    w.predators = [];
    if (founding) w.params.humidity = 80;
    else {
      if (ref.id === "entradas-ar") ventilationNest(w, b);
      if (ref.id === "heranca") maternalAllele(w, b ? 0.8 : 0.2);
      if (ref.id === "repouso-solo") {
        if (!w.intervene("collapse"))
          throw Error("O cenário não gerou terra solta.");
        w.params.reposeAngle = b ? 55 : 15;
      }
      populateLesson(w);
      if (ref.id === "trilhas-vento") {
        initialTrail(w);
        w.params.windX = b ? 1.5 : 0;
      }
      if (ref.id === "crias-temperatura") warmSoil(w, b ? 28 : 18);
      if (ref.id === "entradas-ar") preparedAir(w);
      if (ref.id === "mesma-seed" && b) {
        const first = w.ants.find((a) => a.kind === "worker")!;
        w.intervene("food", first.x, first.z);
      }
    }
    finishLessonWorld(w);
    return w;
  });
  const [a, b] = worlds;
  return normalizeSession({
    version: 2,
    lesson: ref,
    world: a.snapshot(),
    comparison: b.snapshot(),
    scenario: "a",
    initial: {
      seed,
      params: { ...a.params },
      startMode: founding ? "founding" : "established",
      biologicalProfile: a.biologicalProfile,
    },
    interventions: [],
    replaying: false,
    replayIndex: 0,
    running: false,
    clock: { version: 1, secondsPerDay: 60, speed: 1, pendingTicks: 0 },
  });
}
