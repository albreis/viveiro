import { message, messageSource, t } from "../i18n/runtime.ts";
import { createLessonSession } from "../modules/lessons/recipe.ts";
import { lessonDefinition } from "../modules/lessons/catalog.ts";
import {
  switchLesson,
  type LessonSwitchContext,
} from "../modules/lessons/safe-switch.ts";
import type { LessonReference } from "../modules/lessons/reference.ts";
import { lessonView } from "./lessons/view.ts";
interface LessonContext extends LessonSwitchContext {
  current(): LessonReference | undefined;
  actions(): number;
  save(): Promise<void>;
}
export function installLessonControls(context: LessonContext) {
  const view = lessonView();
  let busy = false;
  for (const button of view.buttons)
    button.onclick = async () => {
      if (busy) return;
      busy = true;
      view.busy(true);
      const started = performance.now();
      message(view.status, "lessons.preparing");
      try {
        const d = lessonDefinition(button.dataset.lesson!);
        const candidate = createLessonSession({ id: d.id, version: 2 });
        await switchLesson(candidate, context);
        document.dispatchEvent(new Event("viveiro:saved"));
        await context.save();
        view.render(context.current(), context.actions());
        const seconds = ((performance.now() - started) / 1000).toFixed(2);
        message(view.status, "lessons.opened", { seconds });
        document
          .getElementById("viewport")!
          .scrollIntoView({ block: "center", behavior: "auto" });
      } catch (error) {
        messageSource(
          view.status,
          error instanceof Error ? error.message : t("lessons.failed"),
        );
      } finally {
        busy = false;
        view.busy(false);
      }
    };
  return {
    render(ref: LessonReference | undefined, actions: number) {
      view.render(ref, actions);
    },
  };
}
