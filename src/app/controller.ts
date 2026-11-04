import { element as $ } from "./dom-elements.ts";
import { locale } from "../i18n/runtime.ts";
import { installDailyControls } from "./daily-controls.ts";
import { installLessonControls } from "./lesson-controls.ts";
import { setLessonCamera } from "./lessons/camera.ts";
import { installTourControls } from "./tour-controls.ts";
import { installPerformanceControls } from "./performance-controls.ts";
import { readPerformanceMode } from "../services/performance-preference.ts";
import { renderProfile } from "../modules/renderer/performance-profile.ts";
import { installForecastBenchmark } from "./forecast-benchmark.ts";
import { ForecastClient } from "../services/forecast-client.ts";
import { renderForecast, installForecastControls } from "./forecast-panel.ts";
import { presentFamily } from "../modules/colonies/presentation.ts";
import { AntCameraControls } from "./AntCameraControls.ts";
import { storageNotice, checkpointStore } from "../services/session-store.ts";
import { Terrarium } from "../modules/renderer/scene.ts";
import { SoilMesher } from "../services/SoilMesher.ts";
import { FrameController } from "./controller-frame.ts";
import { installControllerControls } from "./controller-controls.ts";
class Controller extends FrameController {
  start = async () => {
    this.sceneFactory = (world) =>
      new Terrarium($("viewport"), world, this.intervention);
    await this.load();
    this.antCamera = new AntCameraControls({
      getScene: () => this.scene,
      getWorld: () => presentFamily(this.active()),
      getScenario: () => this.scenario,
      getRunning: () => this.running,
      toast: this.toast,
    });
    const notice = storageNotice();
    if (notice) this.toast(notice);
    const world = presentFamily(this.active());
    const mesher = new SoilMesher(
      renderProfile(readPerformanceMode()).soilDetail,
    );
    try {
      const data = await mesher.prepare(world.nest);
      this.scene = new Terrarium($("viewport"), world, this.intervention, {
        data,
        mesher,
      });
      this.configureAntCamera();
      $("loading").hidden = true;
      this.forecaster = new ForecastClient(
        () => {
          if (this.forecaster)
            renderForecast(
              this.forecaster.state,
              this.scenario,
              this.forecaster.options,
            );
        },
        () =>
          new Worker(
            new URL("../workers/forecast.worker.ts", import.meta.url),
            {
              type: "module",
            },
          ),
      );
      this.forecaster.options.observation = renderProfile(
        readPerformanceMode(),
      ).forecast;
      installForecastControls(
        this.forecaster,
        this.forecastSource,
        () => this.scenario,
      );
      this.performanceControls = installPerformanceControls(
        () => this.scene,
        this.forecaster,
      );
      installForecastBenchmark();
      if (import.meta.hot)
        import.meta.hot.dispose(() => this.forecaster?.dispose());
    } catch (error) {
      if (!this.scene) mesher.dispose();
      this.handleError(error);
    }

    installControllerControls.call(this);
    this.installFrameEvents();
    this.dailyControls = installDailyControls({
      scenarios: () => [
        { id: "a", world: this.world },
        ...(this.comparison
          ? [{ id: "b" as const, world: this.comparison }]
          : []),
      ],
      lesson: () =>
        this.lesson ? this.lesson.id + "@" + this.lesson.version : "",
    });
    this.syncControls();
    this.updateUi();
    this.lessonControls = installLessonControls({
      current: () => this.lesson,
      actions: () => this.interventions.length,
      capture: this.getSession,
      pause: () => {
        this.running = false;
        this.advanceControls?.invalidate();
        this.forecaster?.cancel();
        this.syncControls();
      },
      backup: (session, label) =>
        checkpointStore.save(session, label, "manual"),
      apply: (session) => {
        this.applySavedSession(session, true);
        if (this.scene && session.lesson)
          setLessonCamera(this.scene, session.lesson);
        this.scene?.update(
          presentFamily(this.active()),
          performance.now() / 1000,
          1,
        );
        this.scene?.render();
      },
      save: this.save,
    });
    this.lessonControls.render(this.lesson, this.interventions.length);
    if (this.lesson && this.scene) setLessonCamera(this.scene, this.lesson);
    const tourControls = installTourControls({
      hadSavedExperiment:
        this.hadSavedExperiment || checkpointStore.isProtected(),
      ready: () => !!this.scene,
    });
    if (import.meta.hot) import.meta.hot.dispose(() => tourControls.dispose());
    this.forecaster?.consider(
      this.forecastSource,
      this.scenario,
      this.active().tick,
    );
    this.previous = performance.now();
    requestAnimationFrame(this.frame);

    const stopLocaleRendering = locale.subscribe(() => this.updateUi());
    window.addEventListener("pagehide", stopLocaleRendering, { once: true });
  };
}
export function startTerrarium(): Promise<void> {
  return new Controller().start();
}
