import { installBroodInspection } from "./development-status.ts";
import { installSeasonControls } from "./season-controls.ts";
import { installSealingControls } from "./sealing-controls.ts";
import {
  latestProfileReference,
  prepareBiologicalExperiment,
} from "../modules/biology/catalog.ts";
import {
  installBiologyControls,
  selectedBiologicalProfile,
} from "./biology-controls.ts";
import { installForecastBenchmark } from "./forecast-benchmark.ts";
import { observeCounts } from "../modules/forecast/observations.ts";
import { ForecastClient } from "../services/forecast-client.ts";
import { renderForecast, installForecastControls } from "./forecast-panel.ts";
import { installLearningControls } from "./learning-controls.ts";
import { installGasControls } from "./gas-status.ts";
import { installClimateControls } from "./climate-status.ts";
import { installGranularControls } from "./granular-controls.ts";
import { presentFamily } from "../modules/colonies/presentation.ts";
import { AntCameraControls } from "./AntCameraControls.ts";
import {
  readState,
  writeState,
  emergencyState,
  storageNotice,
  protectWrites,
  checkpointStore,
} from "../services/session-store.ts";
import { captureSession, restoreSessionModels } from "./session-models.ts";
import { installCheckpointControls } from "./checkpoint-controls.ts";
import { renderStatus } from "./status-view.js";
import { drawChart as renderChart } from "./chart-view.js";
import { World, TICKS_PER_DAY, hashSeed } from "../modules/simulation/world.js";
import { Terrarium } from "../modules/renderer/scene.js";
const $ = (id) => document.getElementById(id);
let world,
  comparison = null,
  scenario = "a",
  scene,
  running = true,
  speed = 1,
  accumulator = 0;
let initial = {
  seed: "SEMENTE-42",
  startMode: "founding",
  biologicalProfile: latestProfileReference(),
  params: { humidity: 58, light: 72, randomness: 28 },
};
let interventions = [],
  replaying = false,
  replayIndex = 0,
  lastUi = 0,
  lastSave = 0;
let forecaster, toastTimer;
const active = () => (scenario === "b" && comparison ? comparison : world);
const format = (n) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(n);
let antCamera;

function toast(message) {
  $("toast").textContent = message;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").hidden = true), 3800);
}
function getSession() {
  return captureSession({
    world,
    comparison,
    scenario,
    initial,
    interventions,
    replaying,
    replayIndex,
    running,
  });
}
function applySavedSession(value, paused = false) {
  const restored = restoreSessionModels(value),
    next = restored.session;
  const nextActive =
    next.scenario === "b" && restored.comparison
      ? restored.comparison
      : restored.world;
  const nextScene = scene
    ? new Terrarium($("viewport"), presentFamily(nextActive), intervention)
    : null;
  const previousScene = scene;
  world = restored.world;
  comparison = restored.comparison;
  initial = restored.initial;
  scenario = next.scenario;
  interventions = next.interventions;
  replaying = next.replaying;
  replayIndex = next.replayIndex;
  running = paused ? false : next.running;
  accumulator = 0;
  forecaster?.invalidate();
  if (nextScene) {
    scene = nextScene;
    previousScene?.dispose();
    scene.showTrails = $("trails").checked;
    configureAntCamera();
    syncControls();
    updateUi();
  }
}
async function load() {
  try {
    const saved = await readState();
    if (saved) {
      applySavedSession(saved);
      return;
    }
  } catch {
    protectWrites(
      "O save não pôde ser reconstruído. A gravação ficou protegida; importe um experimento ou inicie outro terrário.",
    );
  }
  world = new World(initial.seed, initial.params, {
    biologicalProfile: initial.biologicalProfile,
  });
  initial.params = { ...world.params };
  if (checkpointStore.isProtected()) running = false;
}
let saveGeneration = 0;
let lastCheckpointId;
async function save() {
  const generation = ++saveGeneration;
  const result = await writeState(getSession());
  if (generation !== saveGeneration || result.superseded) return;
  if (result.ok && result.id !== lastCheckpointId) {
    lastCheckpointId = result.id;
    document.dispatchEvent(new Event("viveiro:saved"));
  }
  $("save-status").textContent =
    result.message ||
    (result.ok
      ? "Progresso salvo neste navegador"
      : "Não foi possível salvar — exporte o experimento em JSON");
}
function intervention(type, x = 0, z = 0, value) {
  if (replaying) {
    interventions = interventions.slice(0, replayIndex);
    replaying = false;
  }
  const accepted = world.intervene(type, x, z, value);
  if (!accepted) {
    toast(world.events[0].text);
    return;
  }
  if (comparison) comparison.intervene(type, x, z, value);
  interventions.push({ tick: world.tick, type, x, z, value });
  forecaster?.invalidate();
  syncControls();
  updateUi();
  save();
}
function reset(seed, params, replay = false) {
  checkpointStore.allowWrites();
  const configuration = replay
    ? { params, biologicalProfile: initial.biologicalProfile }
    : prepareBiologicalExperiment(selectedBiologicalProfile(), params);
  world = new World(seed, configuration.params, {
    biologicalProfile: configuration.biologicalProfile,
    founding: !replay || initial.startMode !== "established",
  });
  comparison = null;
  scenario = "a";
  accumulator = 0;
  if (!replay) {
    initial = {
      seed,
      params: { ...configuration.params },
      startMode: "founding",
      biologicalProfile: configuration.biologicalProfile,
    };
    interventions = [];
    replaying = false;
    replayIndex = 0;
  } else {
    replaying = true;
    replayIndex = 0;
  }
  forecaster?.invalidate();
  try {
    scene?.dispose();
    scene = new Terrarium($("viewport"), world, intervention);
  } catch (error) {
    handleError(error);
  }
  running = true;
  document.querySelectorAll("[data-tool]").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
  if (scene) scene.showTrails = $("trails").checked;
  configureAntCamera();

  $("tool-hint").textContent = "Escolha um elemento e clique no solo.";
  $("scene-guide").textContent = "Arraste para orbitar · Role para aproximar";
  syncControls();
  updateUi();
  save();
}
function syncControls() {
  for (const key of ["humidity", "light", "randomness"]) {
    $(key).value = world.params[key];
    $(key + "-value").textContent = world.params[key] + "%";
    $(key).style.setProperty("--range", world.params[key] + "%");
  }
  $("seed").value = initial.seed;
  $("play").textContent = running ? "Ⅱ" : "▶";
  $("play").setAttribute(
    "aria-label",
    running ? "Pausar simulação" : "Continuar simulação",
  );
  $("status-text").textContent = running
    ? "ECOSSISTEMA VIVO"
    : "OBSERVAÇÃO PAUSADA";
  $("resume-overlay").hidden = running;
  $("comparison-panel").hidden = !comparison;
  $("chart-b-legend").hidden = !comparison;
  $("chart-comparison-legend").hidden = !comparison;
  $("compare").firstChild.textContent = comparison
    ? "Encerrar comparação "
    : "Comparar dois cenários ";
  document
    .querySelectorAll("[data-scenario]")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.scenario === scenario),
    );
}
function updateUi() {
  renderStatus(
    {
      world: presentFamily(world),
      comparison: comparison ? presentFamily(comparison) : null,
      scenario,
      current: presentFamily(active()),
    },
    updateAntCamera,
  );
  if (forecaster)
    renderForecast(forecaster.state, scenario, forecaster.options);
}
function configureAntCamera() {
  antCamera.configureScene();
}
function updateAntCamera() {
  antCamera.render();
}
function forecastSource() {
  return forecaster.options.observation === "counts"
    ? observeCounts(active())
    : active().snapshot();
}
function handleError(error) {
  console.error(error);
  const loading = $("loading");
  loading.hidden = false;
  loading.replaceChildren();
  const title = document.createElement("strong"),
    message = document.createElement("span");
  title.textContent = "A cena 3D não pôde iniciar.";
  message.textContent =
    "Use um navegador com WebGL e aceleração de hardware ativada.";
  loading.append(title, message);
}
await load();
antCamera = new AntCameraControls({
  getScene: () => scene,
  getWorld: () => presentFamily(active()),
  getScenario: () => scenario,
  getRunning: () => running,
  toast,
});
if (storageNotice()) toast(storageNotice());
try {
  scene = new Terrarium($("viewport"), presentFamily(active()), intervention);
  configureAntCamera();
  $("loading").hidden = true;
  forecaster = new ForecastClient(
    () => renderForecast(forecaster.state, scenario, forecaster.options),
    () =>
      new Worker(new URL("../workers/forecast.worker.ts", import.meta.url), {
        type: "module",
      }),
  );
  installForecastControls(forecaster, forecastSource, () => scenario);
  installForecastBenchmark();
  if (import.meta.hot) import.meta.hot.dispose(() => forecaster.dispose());
} catch (error) {
  handleError(error);
}
for (const key of ["humidity", "light", "randomness"]) {
  $(key).addEventListener("input", () => {
    $(key + "-value").textContent = $(key).value + "%";
    $(key).style.setProperty("--range", $(key).value + "%");
  });
  $(key).addEventListener("change", () =>
    intervention(key, 0, 0, Number($(key).value)),
  );
}
$("rain").onclick = () => {
  intervention("rain");
  toast("A umidade aumentou. Observe a resposta do ambiente.");
};
$("focus-ecology").onclick = () => {
  if (!scene) return;
  toast(scene.focusEcology());
  $("interior").checked = !!scene.showInterior;
  updateUi();
  $("viewport").scrollIntoView({ block: "center", behavior: "smooth" });
};
installBiologyControls(active());
installGranularControls(intervention);
installCheckpointControls({
  capture: getSession,
  apply: (value) => applySavedSession(value, true),
  pause: () => {
    running = false;
    accumulator = 0;
    syncControls();
  },
  save,
});
installLearningControls(intervention, active);
installGasControls(intervention);
installClimateControls(intervention);
installSeasonControls(intervention);
installBroodInspection(() => scene, toast);
installSealingControls(() => scene, toast);
const focusStructureButton = $("focus-structure");
if (focusStructureButton)
  focusStructureButton.onclick = () => {
    if (!scene) return;
    toast(scene.focusStructure());
    $("interior").checked = !!scene.showInterior;
    updateUi();
    $("viewport").scrollIntoView({ block: "center", behavior: "smooth" });
  };
$("disturb").onclick = () => {
  intervention("collapse");
  toast("Observe a terra solta e o trabalho de recuperação.");
};
$("play").onclick = () => {
  running = !running;
  accumulator = 0;
  syncControls();
  save();
};
$("resume-overlay").onclick = () => {
  if (!running) $("play").click();
};
document.querySelectorAll("[data-speed]").forEach(
  (button) =>
    (button.onclick = () => {
      speed = Number(button.dataset.speed);
      document
        .querySelectorAll("[data-speed]")
        .forEach((b) => b.classList.toggle("active", b === button));
    }),
);
document.querySelectorAll("[data-tool]").forEach(
  (button) =>
    (button.onclick = () => {
      if (!scene) return;
      const tool =
        scene.tool === button.dataset.tool ? null : button.dataset.tool;
      scene.setTool(tool);
      document.querySelectorAll("[data-tool]").forEach((b) => {
        const selected = b.dataset.tool === tool;
        b.classList.toggle("active", selected);
        b.setAttribute("aria-pressed", String(selected));
      });
      $("tool-hint").textContent =
        tool === "scent"
          ? "Clique no solo perto de uma formiga na superfície para alterar seu odor."
          : tool
            ? "Clique no solo para adicionar " +
              { food: "alimento", plant: "uma planta", predator: "uma aranha" }[
                tool
              ] +
              "."
            : "Escolha um elemento e clique no solo.";
      $("scene-guide").textContent = tool
        ? "Clique no solo · Esc para sair"
        : "Arraste para orbitar · Role para aproximar";
    }),
);
$("trails").onchange = () => {
  if (scene) scene.showTrails = $("trails").checked;
};
$("new-world").onclick = () => {
  const seed = "SEMENTE-" + Math.floor(Date.now() % 100000);
  reset(seed, { ...world.params });
  toast("Um novo começo. Observe os primeiros ovos.");
};
$("apply-seed").onclick = () => {
  const seed = $("seed").value.trim();
  if (seed) reset(seed, { ...world.params });
};
$("seed").onkeydown = (e) => {
  if (e.key === "Enter") $("apply-seed").click();
};
$("replay").onclick = () => {
  reset(initial.seed, initial.params, true);
  toast("Repetindo o cenário com as mesmas intervenções nos mesmos instantes.");
};
$("compare").onclick = () => {
  if (comparison) {
    comparison = null;
    scenario = "a";
    toast("Comparação encerrada. O cenário A continua.");
  } else {
    comparison = World.restore(world.snapshot());
    comparison.params.humidity = Math.min(100, comparison.params.humidity + 1);
    comparison.log("Cenário B: umidade aumentada em 1 ponto.");
    toast("Dois mundos, uma pequena diferença. Compare a evolução no gráfico.");
  }
  forecaster?.invalidate();
  syncControls();
  updateUi();
  save();
};
document.querySelectorAll("[data-scenario]").forEach(
  (button) =>
    (button.onclick = () => {
      scenario = button.dataset.scenario;
      forecaster.invalidate();
      syncControls();
      updateUi();
    }),
);
const dialog = $("help-dialog");
$("help").onclick = () => dialog.showModal();
$("close-help").onclick = $("start-observing").onclick = () => dialog.close();
dialog.onclick = (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && scene?.tool)
    document.querySelector("[data-tool].active")?.click();
  if (e.key === "Escape" && scene?.followId) {
    scene.stopFollowing();
    updateAntCamera(active());
  }
  if (
    e.code === "Space" &&
    !/INPUT|BUTTON/.test(e.target.tagName) &&
    !dialog.open
  ) {
    e.preventDefault();
    $("play").click();
  }
});
$("export").onclick = () => {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    initial,
    interventions,
    world: world.snapshot(),
    comparison: comparison?.snapshot(),
    forecast: forecaster?.state,
    description:
      "Modelo ecológico simplificado. Tempos de vida acelerados. 100 passos = 1 dia simulado.",
  };
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "viveiro-" +
    world.seed.replace(/[^a-z0-9_-]/gi, "_") +
    "-dia-" +
    Math.floor(world.day) +
    ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast("Dados, histórico e semente exportados em JSON.");
};
function tick() {
  if (replaying) {
    while (
      replayIndex < interventions.length &&
      interventions[replayIndex].tick <= world.tick
    ) {
      const action = interventions[replayIndex++];
      forecaster?.invalidate();
      world.intervene(action.type, action.x, action.z, action.value);
      if (comparison)
        comparison.intervene(action.type, action.x, action.z, action.value);
    }
  }
  world.step();
  comparison?.step();
}
let previous = performance.now();
function frame(now) {
  const dt = Math.min((now - previous) / 1000, 0.1);
  previous = now;
  if (running && !document.hidden) {
    accumulator += dt * 10 * speed;
    let budget = 30;
    while (accumulator >= 1 && budget-- > 0) {
      tick();
      accumulator--;
    }
  }
  if (scene) {
    scene.update(
      presentFamily(active()),
      now / 1000,
      running ? Math.min(1, accumulator) : 1,
    );
    scene.render();
  }
  if (now - lastUi > 350) {
    updateUi();
    lastUi = now;
  }
  if (now - lastSave > 5000) {
    save();
    lastSave = now;
  }
  forecaster?.consider(forecastSource, scenario, active().tick);
  requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange", () => {
  previous = performance.now();
  accumulator = 0;
  if (document.hidden) {
    emergencyState(getSession());
    void save();
  }
});
window.addEventListener("pagehide", () => emergencyState(getSession()));
window.addEventListener("resize", () => renderChart(world, comparison));
syncControls();
updateUi();
forecaster?.consider(() => active().snapshot(), scenario, active().tick);
requestAnimationFrame(frame);
