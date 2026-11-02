import { lessonDefinition } from "../../modules/lessons/catalog.ts";
import type { LessonReference } from "../../modules/lessons/reference.ts";
interface LessonScene {
  showTrails: boolean;
  setView(view: boolean | "side"): void;
  setInterior(visible: boolean): void;
}
export function setLessonCamera(scene: LessonScene, ref: LessonReference) {
  const d = lessonDefinition(ref.id);
  scene.setView(d.view === "top" ? true : d.view === "side" ? "side" : false);
  scene.showTrails = d.trails;
  scene.setInterior(d.interior);
  (document.getElementById("trails") as HTMLInputElement).checked = d.trails;
  (document.getElementById("interior") as HTMLInputElement).checked =
    d.interior;
}
