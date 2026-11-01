import { describeTraining, learningNumber } from "./learning-report.ts";
import type { FamilyWorld } from "../modules/colonies/types.ts";
import { colonyWorlds } from "../modules/colonies/types.ts";
import type { TrainingResult } from "../modules/learning/types.ts";
let candidate: TrainingResult | undefined,
  worker: Worker | undefined,
  job = 0;
export function installLearningControls(
  intervene: (type: string, x: number, z: number, value: unknown) => void,
  getWorld: () => FamilyWorld,
) {
  const train = document.getElementById(
      "train-policy",
    ) as HTMLButtonElement | null,
    apply = document.getElementById("apply-policy") as HTMLButtonElement | null,
    mode = document.getElementById("learning-mode") as HTMLSelectElement | null;
  if (!train || !apply || !mode) return;
  mode.onchange = () =>
    intervene("learningEnabled", 0, 0, mode.value === "neural" ? 1 : 0);
  train.onclick = () => {
    if (worker) return;
    candidate = undefined;
    apply.disabled = true;
    train.disabled = true;
    const id = ++job;
    const status = document.getElementById("training-status")!;
    status.textContent = "Treinando em grafos separados do terrário…";
    worker = new Worker(
      new URL("../workers/learning.worker.ts", import.meta.url),
      { type: "module" },
    );
    const finish = () => {
      worker?.terminate();
      worker = undefined;
      train.disabled = false;
    };
    worker.onmessage = ({ data }) => {
      if (data.id !== job) return;
      if (data.episode)
        status.textContent = "Treino: " + data.episode + "/1200 episódios.";
      if (data.result) {
        candidate = data.result;
        status.textContent = describeTraining(candidate!.report);
        apply.disabled = false;
        finish();
      }
      if (data.error) {
        status.textContent = "O treino não pôde terminar.";
        finish();
      }
    };
    worker.onerror = () => {
      status.textContent = "Treino indisponível neste navegador.";
      finish();
    };
    worker.postMessage({
      id,
      seed: getWorld().seed + ":policy",
      episodes: 1200,
    });
  };
  apply.onclick = () => {
    if (candidate) {
      intervene("learningPolicy", 0, 0, candidate);
      candidate = undefined;
      apply.disabled = true;
    }
  };
}
export function renderLearningStatus(w: FamilyWorld) {
  const target = document.getElementById("learning-status"),
    mode = document.getElementById("learning-mode") as HTMLSelectElement | null;
  if (!target || !mode) return;
  if (!worker && !candidate && w.learning?.training) {
    const report = document.getElementById("training-status");
    if (report) report.textContent = describeTraining(w.learning.training);
  }
  const states = colonyWorlds(w).flatMap((c) =>
      c.learning ? [c.learning] : [],
    ),
    active = states.filter((s) => s.enabled).length;
  mode.value = w.learning?.enabled ? "neural" : "aco";
  mode.querySelector<HTMLOptionElement>('option[value="neural"]')!.disabled =
    !w.learning;
  target.textContent = active
    ? "Aprendizado em " +
      active +
      " colônia(s) · " +
      states.reduce((n, s) => n + s.decisions, 0) +
      " escolhas locais · " +
      states.reduce((n, s) => n + s.updates, 0) +
      " ajustes individuais. Recompensa acumulada: " +
      learningNumber(
        states.reduce((n, s) => n + s.reward, 0),
        2,
      ) +
      "."
    : "ACO ativo. A política aprendida é opcional e pode ser comparada no mesmo ambiente.";
}
