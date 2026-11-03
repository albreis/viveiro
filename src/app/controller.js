import { translate } from "../i18n/core.ts";
import {
  locale,
  t,
  message as setMessage,
  messageSource,
  messageAttribute,
} from "../i18n/runtime.ts";
import { renderChartSummary } from "./chart-summary.ts";
import { installAccessibleInterventions } from "./accessible-interventions.ts";
import { installDailyControls } from "./daily-controls.ts";
import { installLessonControls } from "./lesson-controls.ts";
import { createLessonSession } from "../modules/lessons/recipe.ts";
import { setLessonCamera } from "./lessons/camera.ts";
import { installTourControls } from "./tour-controls.ts";
import { ownsSpaceKey } from "./keyboard.ts";
import { installPerformanceControls } from "./performance-controls.ts";
import { readPerformanceMode } from "../services/performance-preference.ts";
import { renderProfile } from "../modules/renderer/performance-profile.ts";
import { installSurvivalControls } from "./survival-view.ts";
import { installMaterialControls } from "./material-controls.ts";
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
import { SimulationClock, normalizeClock } from "../modules/time/clock.ts";
import { stepSession } from "../modules/time/session-step.ts";
import { installTimeControls } from "./time-controls.ts";
import { installAdvanceControls } from "./advance-controls.ts";
const clock = new SimulationClock();
let timeControls, advanceControls, advancePlan;
const $ = (id) => document.getElementById(id);
let world,
  comparison = null,
  scenario = "a",
  scene,
  running = true;
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
let forecaster,
  toastTimer,
  performanceControls,
  lessonControls,
  lesson,
  dailyControls;
const active = () => (scenario === "b" && comparison ? comparison : world);
const format = (n) =>
  new Intl.NumberFormat(locale.locale, { maximumFractionDigits: 1 }).format(n);
let antCamera;
let hadSavedExperiment = true;

function toast(message) {
  messageSource($("toast"), message);
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
    ...(lesson ? { lesson } : {}),
    clock: { ...clock.state },
    ...(advancePlan ? { advance: advancePlan } : {}),
  });
}
function applySavedSession(value, paused = false, fromAdvance = false) {
  if (!fromAdvance) advanceControls?.invalidate();
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
  lesson = next.lesson;
  scenario = next.scenario;
  interventions = next.interventions;
  replaying = next.replaying;
  replayIndex = next.replayIndex;
  running = paused ? false : next.running;
  clock.state = normalizeClock(next.clock);
  advancePlan = next.advance;
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
    hadSavedExperiment = Boolean(saved);
    if (saved) {
      applySavedSession(saved);
      return;
    }
  } catch {
    protectWrites(translate("scene.save.failed"));
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
  messageSource(
    $("save-status"),
    result.message ||
      (result.ok ? t("controls.save.ok") : t("controls.save.failed")),
  );
}
function intervention(type, x = 0, z = 0, value) {
  advanceControls?.invalidate();
  advancePlan = undefined;
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
  if (replay && lesson) {
    const actions = interventions;
    const candidate = createLessonSession(lesson);
    candidate.interventions = actions;
    candidate.replaying = true;
    candidate.running = true;
    applySavedSession(candidate);
    setLessonCamera(scene, lesson);
    save();
    return;
  }
  advanceControls?.invalidate();
  advancePlan = undefined;
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
  clock.state.pendingTicks = 0;
  if (!replay) {
    lesson = undefined;
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

  setMessage($("tool-hint"), "terrarium.tools.help");
  setMessage($("scene-guide"), "terrarium.camera.guide");
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
  messageAttribute(
    $("play"),
    "aria-label",
    running ? "terrarium.pause" : "controls.resume",
  );
  setMessage(
    $("status-text"),
    running ? "terrarium.status.live" : "controls.paused",
  );
  $("resume-overlay").hidden = running;
  $("comparison-panel").hidden = !comparison;
  $("chart-b-legend").hidden = !comparison;
  $("chart-comparison-legend").hidden = !comparison;
  setMessage(
    $("compare").querySelector("[data-i18n]"),
    comparison ? "controls.comparison.end" : "terrarium.comparison.run",
  );
  document.querySelectorAll("[data-scenario]").forEach((b) => {
    b.classList.toggle("active", b.dataset.scenario === scenario);
    b.setAttribute("aria-pressed", String(b.dataset.scenario === scenario));
  });
}
function updateUi() {
  renderChartSummary(world, comparison);
  dailyControls?.render();
  timeControls?.render();
  advanceControls?.refresh();
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
  lessonControls?.render(lesson, interventions.length);
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
  setMessage(title, "controls.webgl.title");
  setMessage(message, "controls.webgl.help");
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
  forecaster.options.observation = renderProfile(
    readPerformanceMode(),
  ).forecast;
  installForecastControls(forecaster, forecastSource, () => scenario);
  performanceControls = installPerformanceControls(() => scene, forecaster);
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
  toast(t("controls.rain"));
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
    advanceControls?.invalidate();
    syncControls();
  },
  save,
});
timeControls = installTimeControls(clock, () => {
  advanceControls?.invalidate();
  advancePlan = undefined;
  void save();
});
advanceControls = installAdvanceControls({
  capture: getSession,
  plan: () => advancePlan,
  apply: (value) => applySavedSession(value, true, true),
  pause: () => {
    running = false;
    forecaster?.cancel();
    syncControls();
  },
  save,
});
installLearningControls(intervention, active);
installGasControls(intervention);
installClimateControls(intervention);
installSeasonControls(intervention);
installMaterialControls(intervention);
installSurvivalControls(intervention);
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
  toast(t("controls.disturb"));
};
$("play").onclick = () => {
  advanceControls?.invalidate();
  advancePlan = undefined;
  running = !running;
  previous = performance.now();
  syncControls();
  save();
};
$("resume-overlay").onclick = () => {
  if (!running) $("play").click();
};
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
      setMessage(
        $("tool-hint"),
        tool ? "controls.tool." + tool : "terrarium.tools.help",
      );
      setMessage(
        $("scene-guide"),
        tool ? "controls.camera.place" : "terrarium.camera.guide",
      );
    }),
);
$("trails").onchange = () => {
  if (scene) scene.showTrails = $("trails").checked;
};
$("new-world").onclick = () => {
  const seed = "SEMENTE-" + Math.floor(Date.now() % 100000);
  reset(seed, { ...world.params });
  toast(t("controls.new"));
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
  toast(t("controls.replay"));
};
$("compare").onclick = () => {
  advanceControls?.invalidate();
  advancePlan = undefined;
  if (comparison) {
    comparison = null;
    scenario = "a";
    toast(t("controls.comparison.stopped"));
  } else {
    comparison = World.restore(world.snapshot());
    comparison.params.humidity = Math.min(100, comparison.params.humidity + 1);
    comparison.log("Cenário B: umidade aumentada em 1 ponto.");
    toast(t("controls.comparison.started"));
  }
  forecaster?.invalidate();
  syncControls();
  updateUi();
  save();
};
document.querySelectorAll("[data-scenario]").forEach(
  (button) =>
    (button.onclick = () => {
      advanceControls?.invalidate();
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
  if (e.defaultPrevented || document.querySelector("dialog[open]")) return;
  if (e.key === "Escape" && scene?.tool)
    document.querySelector("[data-tool].active")?.click();
  if (e.key === "Escape" && scene?.followId) {
    scene.stopFollowing();
    updateAntCamera(active());
  }
  if (
    e.code === "Space" &&
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    !ownsSpaceKey(e.target) &&
    !dialog.open
  ) {
    e.preventDefault();
    $("play").click();
  }
});
$("export").onclick = () => {
  const data = {
    ...getSession(),
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
  toast(t("controls.exported"));
};
function tick() {
  const cursor = { interventions, replaying, replayIndex };
  if (stepSession(world, comparison, cursor)) forecaster?.invalidate();
  replayIndex = cursor.replayIndex;
}
let previous = performance.now();
function frame(now) {
  const dt = Math.max(0, (now - previous) / 1000);
  previous = now;
  if (running && !document.hidden) {
    clock.credit(dt);
    clock.drain(tick);
  }
  if (scene) {
    scene.update(
      presentFamily(active()),
      now / 1000,
      running ? clock.alpha : 1,
    );
    scene.render();
    performanceControls?.frame(now);
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
  const now = performance.now();
  if (document.hidden && running)
    clock.credit(Math.max(0, (now - previous) / 1000));
  previous = now;
  if (document.hidden) {
    emergencyState(getSession());
    void save();
  }
});
window.addEventListener("pagehide", () => emergencyState(getSession()));
window.addEventListener("resize", () => renderChart(world, comparison));
installAccessibleInterventions(intervention);
$("viewport").addEventListener("keydown", (event) => {
  if (
    event.target === $("viewport") &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    scene?.cameraKey(event.key)
  )
    event.preventDefault();
});
dailyControls = installDailyControls({
  scenarios: () => [
    { id: "a", world },
    ...(comparison ? [{ id: "b", world: comparison }] : []),
  ],
  lesson: () => (lesson ? lesson.id + "@" + lesson.version : ""),
});
syncControls();
updateUi();
lessonControls = installLessonControls({
  current: () => lesson,
  actions: () => interventions.length,
  capture: getSession,
  pause: () => {
    running = false;
    advanceControls?.invalidate();
    forecaster?.cancel();
    syncControls();
  },
  backup: (session, label) => checkpointStore.save(session, label, "manual"),
  apply: (session) => {
    applySavedSession(session, true);
    setLessonCamera(scene, session.lesson);
    scene.update(presentFamily(active()), performance.now() / 1000, 1);
    scene.render();
  },
  save,
});
lessonControls.render(lesson, interventions.length);
if (lesson) setLessonCamera(scene, lesson);
const tourControls = installTourControls({
  hadSavedExperiment: hadSavedExperiment || checkpointStore.isProtected(),
  ready: () => !!scene,
});
if (import.meta.hot) import.meta.hot.dispose(() => tourControls.dispose());
forecaster?.consider(forecastSource, scenario, active().tick);
requestAnimationFrame(frame);

const stopLocaleRendering = locale.subscribe(() => updateUi());
window.addEventListener("pagehide", stopLocaleRendering, { once: true });
