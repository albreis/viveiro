import { digReadiness } from "../modules/fatigue/effort-model.ts";
import { locale, t, message, messageSource } from "../i18n/runtime.ts";
import { translateSource } from "../i18n/source.ts";
import { localGasLabel } from "./gas-status.ts";
import type { GasWorld } from "../modules/ventilation/types.ts";
import { localClimateLabel } from "./climate-status.ts";
import { describeGenome } from "./genetics-summary.ts";
import type { ColonyAgent as AgentState } from "../modules/colony/types.ts";

interface SceneControls {
  followId: number | null;
  tool: string | null;
  followAnt(id: number): boolean;
  stopFollowing(): void;
  setView(view: boolean | "side"): void;
  setInterior(visible: boolean): void;
  viewLabel?: string;
  currentView?: import("../modules/renderer/render-types.ts").SceneView;
  onSelect?: (id: number) => void;
  onFollowStarted?: (id: number) => void;
  onFollowEnded?: () => void;
}

interface CameraContext {
  getScene(): SceneControls | undefined;
  getWorld(): GasWorld;
  getScenario(): string;
  getRunning(): boolean;
  toast(message: string): void;
}

const element = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const format = (n: number) =>
  new Intl.NumberFormat(locale.locale, { maximumFractionDigits: 1 }).format(n);

export class AntCameraControls {
  private selectedId: number | null = null;
  private listKey = "";

  constructor(private context: CameraContext) {
    element<HTMLSelectElement>("ant-select").onchange = () => {
      this.selectedId = Number(element<HTMLSelectElement>("ant-select").value);
      const scene = context.getScene();
      if (scene?.followId) scene.followAnt(this.selectedId);
      this.render();
    };
    element("follow-ant").onclick = () => {
      if (
        this.selectedId !== null &&
        context.getScene()?.followAnt(this.selectedId)
      ) {
        document.querySelectorAll("[data-tool]").forEach((button) => {
          button.classList.remove("active");
          button.setAttribute("aria-pressed", "false");
        });
        this.render();
        context.toast(t("controls.camera.drag"));
      }
    };
    element("exit-ant").onclick = () => {
      context.getScene()?.stopFollowing();
      this.render();
    };
    element("view-top").onclick = () => this.setView(true);
    element("view-iso").onclick = () => this.setView(false);
    element("view-side").onclick = () => this.setView("side");
    element<HTMLInputElement>("interior").onchange = () =>
      context
        .getScene()
        ?.setInterior(element<HTMLInputElement>("interior").checked);
    element("fullscreen").onclick = async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else
          await document
            .querySelector<HTMLElement>(".scene-card")
            ?.requestFullscreen();
      } catch {
        context.toast(t("controls.camera.unavailable"));
      }
    };
  }

  configureScene() {
    const scene = this.context.getScene();
    if (!scene) return;
    scene.onSelect = (id) => {
      this.selectedId = id;
      this.render();
    };
    scene.onFollowStarted = (id) => {
      this.selectedId = id;
      this.render();
      this.context.toast(t("controls.camera.started", { id }));
    };
    scene.onFollowEnded = () => {
      this.context.toast(t("controls.camera.ended"));
      this.render();
    };
    this.markView(false);
    element("view-top").classList.remove("active");
    element("view-side").classList.remove("active");
    scene.setInterior(element<HTMLInputElement>("interior").checked);
    this.listKey = "";
  }

  render() {
    const selectedWorld = this.context.getWorld();
    const { ants, tick, microclimate } = selectedWorld;
    const scene = this.context.getScene();
    const key =
      locale.locale +
      ":" +
      this.context.getScenario() +
      ":" +
      ants.map((ant) => ant.id).join(",");
    const select = element<HTMLSelectElement>("ant-select");
    if (key !== this.listKey) {
      this.listKey = key;
      select.replaceChildren(
        ...ants.map((ant) => {
          const option = document.createElement("option");
          option.value = String(ant.id);
          const label =
            ant.kind === "gyne"
              ? t("controls.camera.gyne")
              : ant.kind === "queen"
                ? t("controls.camera.queen")
                : ant.kind === "male"
                  ? t("controls.camera.male")
                  : ant.caste === "major"
                    ? t("controls.camera.soldier")
                    : t("controls.camera.worker");
          option.textContent =
            label +
            " #" +
            ant.id +
            ((ant.colonyId || 1) > 1
              ? t("controls.camera.colony", { id: ant.colonyId ?? 1 })
              : "");
          return option;
        }),
      );
    }
    if (!ants.some((ant) => ant.id === this.selectedId)) {
      this.selectedId =
        ants.find((ant) => ant.kind === "worker")?.id ?? ants[0]?.id ?? null;
    }
    select.value = String(this.selectedId ?? "");
    const ant = ants.find((ant) => ant.id === this.selectedId);
    const state = ant ? translateSource(ant.state ?? "", locale.locale) : "";
    messageSource(
      element("ant-state"),
      ant
        ? (this.context.getRunning() ? "" : t("controls.camera.paused")) +
            ((ant.y || 0) < -0.1
              ? t("controls.camera.underground")
              : t("controls.camera.surface")) +
            t("controls.camera.state", {
              state:
                (ant.socialUntil || 0) > tick && ant.socialPartner
                  ? t("controls.camera.contact", {
                      state,
                      id: ant.socialPartner,
                    })
                  : state,
              distance: format(ant.distanceWalked || 0),
              age: format(ant.age || 0),
              healthLabel: t(
                ant.life ? "controls.camera.body" : "controls.camera.health",
              ),
              health: Math.round(ant.health ?? 100),
            }) +
            (ant.life
              ? t("controls.camera.energy", {
                  energy: Math.round(ant.energy),
                  infection: Math.round(ant.life.infection * 100),
                })
              : "") +
            (ant.effort
              ? t("controls.camera.digReadiness", {
                  readiness: Math.round(digReadiness(ant.effort, tick) * 100),
                })
              : "")
        : t("controls.camera.empty"),
    );
    messageSource(element("ant-genome"), describeGenome(ant?.genome));
    const local = document.getElementById("ant-climate");
    if (local)
      local.textContent = ant
        ? localClimateLabel(microclimate, { x: ant.x, y: ant.y || 0, z: ant.z })
        : "";
    const gasLabel = document.getElementById("ant-gas");
    if (gasLabel)
      gasLabel.textContent = ant ? localGasLabel(selectedWorld, ant) : "";
    const cognition = document.getElementById("ant-learning");
    if (cognition)
      message(
        cognition,
        selectedWorld.learning?.enabled
          ? ant?.learningBrain
            ? "controls.camera.brain"
            : "controls.camera.learning"
          : "controls.camera.aco",
        { count: ant?.learningUpdates ?? 0 },
      );
    const view = scene?.followId ? null : (scene?.currentView ?? false);
    this.markView(view);
    message(
      element("camera-mode"),
      view === null
        ? "terrarium.camera.firstPerson"
        : view === true
          ? "terrarium.camera.top"
          : view === "side"
            ? "terrarium.camera.sideShort"
            : "terrarium.camera.perspective",
    );
    const follow = element<HTMLButtonElement>("follow-ant");
    follow.disabled = !ant;
    const focused = document.activeElement;
    follow.hidden = !!scene?.followId;
    element("exit-ant").hidden = !scene?.followId;
    if (focused === follow && follow.hidden) element("viewport").focus();
    if (focused === element("exit-ant") && !scene?.followId)
      (ant ? follow : select).focus();
    message(
      element("scene-guide"),
      scene?.followId
        ? "controls.camera.look"
        : scene?.tool
          ? "controls.camera.place"
          : scene?.viewLabel
            ? "controls.camera.side"
            : "controls.camera.orbit",
      { side: translateSource(scene?.viewLabel || "", locale.locale) },
    );
  }

  private markView(view: boolean | string | null) {
    for (const [id, active] of [
      ["view-top", view === true],
      ["view-iso", view === false],
      ["view-side", view === "side"],
    ] as const) {
      element(id).setAttribute("aria-pressed", String(active));
      element(id).classList.toggle("active", active);
    }
  }
  private setView(view: boolean | "side") {
    this.context.getScene()?.setView(view);
    this.markView(view);
    this.render();
  }
}
