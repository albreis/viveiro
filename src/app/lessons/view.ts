import { lessons, lessonDefinition } from "../../modules/lessons/catalog.ts";
import type { LessonReference } from "../../modules/lessons/reference.ts";
export function lessonView() {
  const panel = document.createElement("section");
  panel.className = "panel lesson-panel";
  panel.id = "lesson-panel";
  const title = document.createElement("h2");
  title.textContent = "Experimentos de um clique";
  const note = document.createElement("p");
  note.textContent =
    "Abre uma comparação em pausa. Seu terrário atual será guardado num checkpoint antes da troca.";
  const grid = document.createElement("div");
  grid.className = "lesson-grid";
  const buttons = lessons.map((d) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.lesson = d.id;
    const name = document.createElement("strong");
    name.textContent = d.title;
    const labels = document.createElement("span");
    labels.textContent = "A: " + d.a + " · B: " + d.b;
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
  status.textContent =
    "Escolha uma pergunta. Os modelos são exploratórios, sem espécie calibrada.";
  panel.append(title, note, grid, question, setup, status);
  document.querySelector(".scene-card")!.before(panel);
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
      if (ref) compare.firstChild!.textContent = "Comparação da aula ";
      const next = (ref?.id ?? "") + ":" + interventions;
      if (ref) {
        const active = lessonDefinition(ref.id);
        document.getElementById("comparison-text")!.textContent =
          active.question + " A: " + active.a + "; B: " + active.b;
      }
      if (next === key) return;
      key = next;
      const d = ref ? lessonDefinition(ref.id) : null;
      question.textContent = d ? d.question : "";
      setup.textContent = d
        ? d.setup +
          (interventions
            ? " Intervenções comuns adicionais: " + interventions + "."
            : "")
        : "";
      document.querySelector<HTMLButtonElement>(
        '[data-scenario="a"]',
      )!.textContent = d ? "A · " + d.a : "A · original";
      document.querySelector<HTMLButtonElement>(
        '[data-scenario="b"]',
      )!.textContent = d ? "B · " + d.b : "B · alterado";
      for (const button of buttons)
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.lesson === ref?.id),
        );
    },
  };
}
