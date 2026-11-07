import { element as $ } from "./dom-elements.ts";
import { translate } from "../i18n/core.ts";
import { t, messageSource } from "../i18n/runtime.ts";
import type { installDailyControls } from "./daily-controls.ts";
import type { installLessonControls } from "./lesson-controls.ts";
import type { installPerformanceControls } from "./performance-controls.ts";
import { officialBiologicalProfile } from "../modules/biology/catalog.ts";
import type { ForecastClient } from "../services/forecast-client.ts";
import type { AntCameraControls } from "./AntCameraControls.ts";
import {
  readState,
  writeState,
  protectWrites,
  checkpointStore,
} from "../services/session-store.ts";
import { captureSession } from "./session-models.ts";

import type { Terrarium } from "../modules/renderer/scene.ts";
import { SimulationClock } from "../modules/time/clock.ts";
import type { installTimeControls } from "./time-controls.ts";
import type { installAdvanceControls } from "./advance-controls.ts";
import type { LiveWorld } from "./runtime-world.ts";
import { createLiveWorld } from "./runtime-world.ts";
import type { SessionState } from "../modules/persistence/types.ts";

export abstract class AppState {
  clock = new SimulationClock();
  timeControls?: ReturnType<typeof installTimeControls>;
  advanceControls?: ReturnType<typeof installAdvanceControls>;
  advancePlan?: SessionState["advance"];
  world!: LiveWorld;
  comparison: LiveWorld | null = null;
  scenario: "a" | "b" = "a";
  scene?: Terrarium;
  sceneFactory?: (
    world: import("../modules/renderer/render-types.ts").RenderWorld,
  ) => Terrarium;
  running = true;
  initial: SessionState["initial"] = {
    seed: "SEMENTE-42",
    startMode: "founding",
    biologicalProfile: officialBiologicalProfile(),
    params: { humidity: 58, light: 72, randomness: 28 },
  };
  interventions: SessionState["interventions"] = [];
  replaying = false;
  replayIndex = 0;
  lastUi = 0;
  lastSave = 0;
  forecaster?: ForecastClient;
  toastTimer?: ReturnType<typeof setTimeout>;
  performanceControls?: ReturnType<typeof installPerformanceControls>;
  lessonControls?: ReturnType<typeof installLessonControls>;
  lesson?: SessionState["lesson"];
  dailyControls?: ReturnType<typeof installDailyControls>;
  antCamera!: AntCameraControls;
  hadSavedExperiment = true;
  saveGeneration = 0;
  lastCheckpointId?: string;
  previous = performance.now();
  active = () =>
    this.scenario === "b" && this.comparison ? this.comparison : this.world;
  abstract applySavedSession: (
    value: unknown,
    paused?: boolean,
    fromAdvance?: boolean,
  ) => void;
  abstract syncControls: () => void;
  abstract updateUi: () => void;

  toast = (message: string) => {
    messageSource($("toast"), message);
    $("toast").hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => ($("toast").hidden = true), 3800);
  };
  getSession = () => {
    return captureSession({
      world: this.world,
      comparison: this.comparison,
      scenario: this.scenario,
      initial: this.initial,
      interventions: this.interventions,
      replaying: this.replaying,
      replayIndex: this.replayIndex,
      running: this.running,
      ...(this.lesson ? { lesson: this.lesson } : {}),
      clock: { ...this.clock.state },
      ...(this.advancePlan ? { advance: this.advancePlan } : {}),
    });
  };
  load = async () => {
    try {
      const saved = await readState();
      this.hadSavedExperiment = Boolean(saved);
      if (saved) {
        this.applySavedSession(saved);
        return;
      }
    } catch {
      protectWrites(translate("scene.save.failed"));
    }
    this.world = createLiveWorld(this.initial.seed, this.initial.params, {
      biologicalProfile: this.initial.biologicalProfile,
    });
    this.initial.params = { ...this.world.params };
    if (checkpointStore.isProtected()) this.running = false;
  };
  save = async () => {
    const generation = ++this.saveGeneration;
    const result = await writeState(this.getSession());
    if (generation !== this.saveGeneration || result.superseded) return;
    if (result.ok && result.id !== this.lastCheckpointId) {
      this.lastCheckpointId = result.id;
      document.dispatchEvent(new Event("viveiro:saved"));
    }
    messageSource(
      $("save-status"),
      result.message ||
        (result.ok ? t("controls.save.ok") : t("controls.save.failed")),
    );
  };
}
