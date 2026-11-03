import { element as $ } from "./dom-elements.ts";
import { message as setMessage } from "../i18n/runtime.ts";
import { createLessonSession } from "../modules/lessons/recipe.ts";
import { setLessonCamera } from "./lessons/camera.ts";
import { prepareBiologicalExperiment } from "../modules/biology/catalog.ts";
import { selectedBiologicalProfile } from "./biology-controls.ts";
import { presentFamily } from "../modules/colonies/presentation.ts";
import { checkpointStore } from "../services/session-store.ts";
import { restoreSessionModels } from "./session-models.ts";

import { normalizeClock } from "../modules/time/clock.ts";
import { AppState } from "./runtime-state.ts";
import { createLiveWorld, liveWorld } from "./runtime-world.ts";

export abstract class SessionController extends AppState {
  abstract configureAntCamera: () => void;
  abstract handleError: (error: unknown) => void;
  makeScene = (
    world: import("../modules/renderer/render-types.ts").RenderWorld,
  ) => {
    if (!this.sceneFactory) throw Error("Scene factory unavailable");
    return this.sceneFactory(world);
  };
  applySavedSession = (value: unknown, paused = false, fromAdvance = false) => {
    if (!fromAdvance) this.advanceControls?.invalidate();
    const restored = restoreSessionModels(value),
      next = restored.session;
    const nextActive =
      next.scenario === "b" && restored.comparison
        ? restored.comparison
        : restored.world;
    const nextScene = this.scene
      ? this.makeScene(presentFamily(liveWorld(nextActive)))
      : null;
    const previousScene = this.scene;
    this.world = liveWorld(restored.world);
    this.comparison = restored.comparison
      ? liveWorld(restored.comparison)
      : null;
    this.initial = restored.initial;
    this.lesson = next.lesson;
    this.scenario = next.scenario;
    this.interventions = next.interventions;
    this.replaying = next.replaying;
    this.replayIndex = next.replayIndex;
    this.running = paused ? false : next.running;
    this.clock.state = normalizeClock(next.clock);
    this.advancePlan = next.advance;
    this.forecaster?.invalidate();
    if (nextScene) {
      this.scene = nextScene;
      previousScene?.dispose();
      this.scene.showTrails = $("trails").checked;
      this.configureAntCamera();
      this.syncControls();
      this.updateUi();
    }
  };
  intervention = (type: string, x = 0, z = 0, value?: unknown) => {
    this.advanceControls?.invalidate();
    this.advancePlan = undefined;
    if (this.replaying) {
      this.interventions = this.interventions.slice(0, this.replayIndex);
      this.replaying = false;
    }
    const accepted = this.world.intervene(type, x, z, value);
    if (!accepted) {
      this.toast(this.world.events[0].text);
      return;
    }
    if (this.comparison) this.comparison.intervene(type, x, z, value);
    this.interventions.push({ tick: this.world.tick, type, x, z, value });
    this.forecaster?.invalidate();
    this.syncControls();
    this.updateUi();
    this.save();
  };
  reset = (seed: string, params: Record<string, number>, replay = false) => {
    if (replay && this.lesson) {
      const actions = this.interventions;
      const candidate = createLessonSession(this.lesson);
      candidate.interventions = actions;
      candidate.replaying = true;
      candidate.running = true;
      this.applySavedSession(candidate);
      if (this.scene) setLessonCamera(this.scene, this.lesson);
      this.save();
      return;
    }
    this.advanceControls?.invalidate();
    this.advancePlan = undefined;
    checkpointStore.allowWrites();
    const configuration = replay
      ? { params, biologicalProfile: this.initial.biologicalProfile }
      : prepareBiologicalExperiment(selectedBiologicalProfile(), params);
    this.world = createLiveWorld(seed, configuration.params, {
      biologicalProfile: configuration.biologicalProfile,
      founding: !replay || this.initial.startMode !== "established",
    });
    this.comparison = null;
    this.scenario = "a";
    this.clock.state.pendingTicks = 0;
    if (!replay) {
      this.lesson = undefined;
      this.initial = {
        seed,
        params: { ...configuration.params },
        startMode: "founding",
        biologicalProfile: configuration.biologicalProfile,
      };
      this.interventions = [];
      this.replaying = false;
      this.replayIndex = 0;
    } else {
      this.replaying = true;
      this.replayIndex = 0;
    }
    this.forecaster?.invalidate();
    try {
      this.scene?.dispose();
      this.scene = this.makeScene(this.world);
    } catch (error) {
      this.handleError(error);
    }
    this.running = true;
    document.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    if (this.scene) this.scene.showTrails = $("trails").checked;
    this.configureAntCamera();

    setMessage($("tool-hint"), "terrarium.tools.help");
    setMessage($("scene-guide"), "terrarium.camera.guide");
    this.syncControls();
    this.updateUi();
    this.save();
  };
}
