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
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(n);

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
        context.toast("Arraste para olhar ao redor · Esc para sair.");
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
        context.toast("Tela cheia indisponível neste navegador.");
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
      this.context.toast("Visão da formiga #" + id + " · Esc para sair.");
    };
    scene.onFollowEnded = () => {
      this.context.toast(
        "Esta formiga não está mais na colônia. A câmera voltou ao terrário.",
      );
      this.render();
    };
    element("view-iso").classList.add("active");
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
      this.context.getScenario() + ":" + ants.map((ant) => ant.id).join(",");
    const select = element<HTMLSelectElement>("ant-select");
    if (key !== this.listKey) {
      this.listKey = key;
      select.replaceChildren(
        ...ants.map((ant) => {
          const option = document.createElement("option");
          option.value = String(ant.id);
          const label =
            ant.kind === "gyne"
              ? "Princesa"
              : ant.kind === "queen"
                ? "Rainha"
                : ant.kind === "male"
                  ? "Macho"
                  : ant.caste === "major"
                    ? "Soldado"
                    : "Operária";
          option.textContent =
            label +
            " #" +
            ant.id +
            ((ant.colonyId || 1) > 1 ? " · colônia " + ant.colonyId : "");
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
    element("ant-state").textContent = ant
      ? (this.context.getRunning() ? "" : "Pausada · ") +
        ((ant.y || 0) < -0.1 ? "Subsolo · " : "Superfície · ") +
        ((ant.socialUntil || 0) > tick && ant.socialPartner
          ? ant.state + " · contato com #" + ant.socialPartner
          : ant.state) +
        " · percurso " +
        format(ant.distanceWalked || 0) +
        " u. · idade " +
        format(ant.age || 0) +
        " d · saúde " +
        Math.round(ant.health ?? 100) +
        "%"
      : "Nenhuma formiga viva.";
    element("ant-genome").textContent = describeGenome(ant?.genome);
    const local = document.getElementById("ant-climate");
    if (local)
      local.textContent = ant
        ? localClimateLabel(microclimate, { x: ant.x, y: ant.y || 0, z: ant.z })
        : "";
    const gasLabel = document.getElementById("ant-gas");
    if (gasLabel)
      gasLabel.textContent = ant ? localGasLabel(selectedWorld, ant) : "";
    const follow = element<HTMLButtonElement>("follow-ant");
    follow.disabled = !ant;
    follow.hidden = !!scene?.followId;
    element("exit-ant").hidden = !scene?.followId;
    element("scene-guide").textContent = scene?.followId
      ? "Arraste para olhar · Esc para sair"
      : scene?.tool
        ? "Clique no solo · Esc para sair"
        : scene?.viewLabel
          ? scene.viewLabel + " · Clique em vista lateral para girar"
          : "Duplo clique na formiga · Arraste para orbitar";
  }

  private setView(view: boolean | "side") {
    this.context.getScene()?.setView(view);
    element("view-top").classList.toggle("active", view === true);
    element("view-iso").classList.toggle("active", view === false);
    element("view-side").classList.toggle("active", view === "side");
    this.render();
  }
}
