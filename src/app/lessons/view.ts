import {
  locale,
  t,
  message,
  messageSource,
  clearMessage,
} from "../../i18n/runtime.ts";
import type { MessageKey } from "../../i18n/catalogs.ts";
import { presentLesson } from "../../i18n/lessons.ts";
import { lessons, lessonDefinition } from "../../modules/lessons/catalog.ts";
import type { LessonReference } from "../../modules/lessons/reference.ts";
export function lessonView() {
  const panel = document.createElement("details");
  panel.className = "panel lesson-panel";
  panel.id = "lesson-panel";
  const title = document.createElement("h2");
  message(title, "lessons.title");
  const note = document.createElement("p");
  message(note, "lessons.help");
  const grid = document.createElement("div");
  grid.className = "lesson-grid";
  const buttons = lessons.map((d) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.lesson = d.id;
    const name = document.createElement("strong");
    message(name, ("lessons." + d.id + ".title") as MessageKey);
    const labels = document.createElement("span");
    const render = () => {
      const p = presentLesson(d);
      message(labels, "lessons.conditions", { a: p.a, b: p.b });
    };
    render();
    const stop = locale.subscribe(render);
    window.addEventListener("pagehide", stop, { once: true });
    button.append(name, labels);
    grid.append(button);
    return button;
  });
  const question = document.createElement("p");
  question.id = "lesson-question";
  const setup = document.createElement("p");
  setup.id = "lesson-setup";
  const status = document.createElement("p");
  status.id = "lesson-status";
  status.setAttribute("role", "status");
  message(status, "lessons.choose");
  const summary = document.createElement("summary");
  summary.append(title);
  panel.append(summary, note, grid, question, setup, status);
  document.querySelector(".scene-card")!.after(panel);
  let key = "";
  return {
    buttons,
    status,
    busy(value: boolean) {
      for (const button of buttons) button.disabled = value;
    },
    render(ref: LessonReference | undefined, interventions: number) {
      const compare = document.getElementById("compare") as HTMLButtonElement;
      compare.disabled = !!ref;
      if (ref)
        message(compare.querySelector("[data-i18n]")!, "lessons.comparison");
      const next = locale.locale + ":" + (ref?.id ?? "") + ":" + interventions;
      if (ref) {
        const active = presentLesson(lessonDefinition(ref.id));
        message(
          document.getElementById("comparison-text")!,
          "lessons.comparisonDescription",
          { question: active.question, a: active.a, b: active.b },
        );
      }
      if (next === key) return;
      key = next;
      const d = ref ? presentLesson(lessonDefinition(ref.id)) : null;
      messageSource(question, d ? d.question : "");
      messageSource(
        setup,
        d
          ? d.setup +
              (interventions
                ? t("lessons.interventions", { count: interventions })
                : "")
          : "",
      );
      messageSource(
        document.querySelector<HTMLButtonElement>('[data-scenario="a"]')!,
        d ? "A · " + d.a : t("terrarium.comparison.a"),
      );
      messageSource(
        document.querySelector<HTMLButtonElement>('[data-scenario="b"]')!,
        d ? "B · " + d.b : t("terrarium.comparison.b"),
      );
      for (const button of buttons)
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.lesson === ref?.id),
        );
    },
  };
}
