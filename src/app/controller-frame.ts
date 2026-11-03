import { element as $ } from "./dom-elements.ts";
import { installAccessibleInterventions } from "./accessible-interventions.ts";
import { presentFamily } from "../modules/colonies/presentation.ts";
import { emergencyState } from "../services/session-store.ts";
import { drawChart as renderChart } from "./chart-view.ts";
import { stepSession } from "../modules/time/session-step.ts";
import { ViewController } from "./view-controller.ts";
export class FrameController extends ViewController {
  tick = () => {
    const cursor = {
      interventions: this.interventions,
      replaying: this.replaying,
      replayIndex: this.replayIndex,
    };
    if (stepSession(this.world, this.comparison, cursor))
      this.forecaster?.invalidate();
    this.replayIndex = cursor.replayIndex;
  };
  frame = (now: number) => {
    const dt = Math.max(0, (now - this.previous) / 1000);
    this.previous = now;
    if (this.running && !document.hidden) {
      this.clock.credit(dt);
      this.clock.drain(this.tick);
    }
    if (this.scene) {
      this.scene.update(
        presentFamily(this.active()),
        now / 1000,
        this.running ? this.clock.alpha : 1,
      );
      this.scene.render();
      this.performanceControls?.frame(now);
    }
    if (now - this.lastUi > 350) {
      this.updateUi();
      this.lastUi = now;
    }
    if (now - this.lastSave > 5000) {
      this.save();
      this.lastSave = now;
    }
    this.forecaster?.consider(
      this.forecastSource,
      this.scenario,
      this.active().tick,
    );
    requestAnimationFrame(this.frame);
  };
  installFrameEvents = () => {
    document.addEventListener("visibilitychange", () => {
      const now = performance.now();
      if (document.hidden && this.running)
        this.clock.credit(Math.max(0, (now - this.previous) / 1000));
      this.previous = now;
      if (document.hidden) {
        emergencyState(this.getSession());
        void this.save();
      }
    });
    window.addEventListener("pagehide", () =>
      emergencyState(this.getSession()),
    );
    window.addEventListener("resize", () =>
      renderChart(this.world, this.comparison),
    );
    installAccessibleInterventions(this.intervention);
    $("viewport").addEventListener("keydown", (event) => {
      if (
        event.target === $("viewport") &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        this.scene?.cameraKey(event.key)
      )
        event.preventDefault();
    });
  };
}
