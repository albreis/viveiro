import { installLearningControls } from "./learning-controls.ts";
import { installGasControls } from "./gas-status.ts";
import { installClimateControls } from "./climate-status.ts";
import { installGranularControls } from "./granular-controls.ts";
import { presentFamily } from "../modules/colonies/presentation.ts";
import { AntCameraControls } from "./AntCameraControls.ts";
import { readState, writeState } from "../services/state-store.ts";
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
  params: { humidity: 58, light: 72, randomness: 28 },
};
let interventions = [],
  replaying = false,
  replayIndex = 0,
  lastUi = 0,
  lastSave = 0,
  lastForecast = -1000;
let forecastPending = false,
  forecastId = 0,
  forecastCache = null,
  worker = null,
  toastTimer;
const active = () => (scenario === "b" && comparison ? comparison : world);
const format = (n) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(n);
const antCamera = new AntCameraControls({
  getScene: () => scene,
  getWorld: () => presentFamily(active()),
  getScenario: () => scenario,
  getRunning: () => running,
  toast,
});
function toast(message) {
  $("toast").textContent = message;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").hidden = true), 3800);
}
function load() {
  try {
    const saved = readState();
    if (
      saved?.version === 1 &&
      saved.world?.seed &&
      Array.isArray(saved.world.ants) &&
      saved.world.ants.length <= 450
    ) {
      world = World.restore(saved.world);
      initial = {
        ...saved.initial,
        startMode:
          saved.initial?.startMode ||
          (saved.world.founding ? "founding" : "established"),
      };
      interventions = saved.interventions || [];
      comparison = saved.comparison ? World.restore(saved.comparison) : null;
      scenario = saved.scenario === "b" && comparison ? "b" : "a";
      replaying = !!saved.replaying;
      replayIndex = saved.replayIndex || 0;
      running = saved.running !== false;
      return;
    }
  } catch {}
  world = new World(initial.seed, initial.params);
}
function save() {
  const ok = writeState({
    version: 1,
    world: world.snapshot(),
    comparison: comparison?.snapshot(),
    scenario,
    initial,
    interventions,
    replaying,
    replayIndex,
    running,
  });
  $("save-status").textContent = ok
    ? "Progresso salvo neste navegador"
    : "Armazenamento indispon�vel � use Exportar dados";
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
  lastForecast = -1000;
  syncControls();
  updateUi();
  save();
}
function reset(seed, params, replay = false) {
  world = new World(seed, params, {
    founding: !replay || initial.startMode !== "established",
  });
  comparison = null;
  scenario = "a";
  accumulator = 0;
  if (!replay) {
    initial = { seed, params: { ...params }, startMode: "founding" };
    interventions = [];
    replaying = false;
    replayIndex = 0;
  } else {
    replaying = true;
    replayIndex = 0;
  }
  forecastId++;
  forecastPending = false;
  forecastCache = null;
  lastForecast = -1000;
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
      forecastCache,
      current: presentFamily(active()),
    },
    updateAntCamera,
  );
}
function configureAntCamera() {
  antCamera.configureScene();
}
function updateAntCamera() {
  antCamera.render();
}
function requestForecast() {
  if (!worker || forecastPending) return;
  const w = active();
  forecastPending = true;
  lastForecast = w.tick;
  const id = ++forecastId;
  worker.postMessage({ id, snapshot: w.snapshot(), runs: 18, days: 3 });
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
load();
try {
  scene = new Terrarium($("viewport"), presentFamily(active()), intervention);
  configureAntCamera();
  $("loading").hidden = true;
  worker = new Worker(
    new URL("../workers/forecast.worker.js", import.meta.url),
    { type: "module" },
  );
  worker.onmessage = ({ data }) => {
    if (data.id !== forecastId) return;
    forecastPending = false;
    if (data.result) {
      forecastCache = { scenario, result: data.result };
      updateUi();
    } else {
      $("forecast-note").textContent = "Previsão indisponível nesta execução.";
    }
  };
  worker.onerror = () => {
    forecastPending = false;
    worker.terminate();
    worker = null;
    $("forecast-note").textContent =
      "Este navegador não disponibilizou a previsão.";
  };
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
installGranularControls(intervention);
installLearningControls(intervention, active);
installGasControls(intervention);
installClimateControls(intervention);
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
  forecastId++;
  forecastPending = false;
  forecastCache = null;
  lastForecast = -1000;
  syncControls();
  updateUi();
  save();
};
document.querySelectorAll("[data-scenario]").forEach(
  (button) =>
    (button.onclick = () => {
      scenario = button.dataset.scenario;
      forecastId++;
      forecastPending = false;
      forecastCache = null;
      lastForecast = -1000;
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
    forecast: forecastCache,
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
  if (active().tick - lastForecast > 100 || lastForecast < 0) requestForecast();
  requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange", () => {
  previous = performance.now();
  accumulator = 0;
  if (document.hidden) save();
});
window.addEventListener("pagehide", save);
window.addEventListener("resize", () => renderChart(world, comparison));
syncControls();
updateUi();
requestForecast();
requestAnimationFrame(frame);
