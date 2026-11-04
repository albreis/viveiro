import { message } from "../../i18n/runtime.ts";
import { dockForTarget } from "../../modules/onboarding/placement.ts";
import type { TourState } from "../../modules/onboarding/tour.ts";
import { tourSteps } from "./steps.ts";
import { tourMarkup } from "./markup.ts";

export class TourView {
  readonly panel = document.createElement("section");
  private target: HTMLElement | null = null;
  readonly title: HTMLHeadingElement;
  readonly next: HTMLButtonElement;
  readonly back: HTMLButtonElement;
  readonly jump: HTMLButtonElement;
  constructor() {
    this.panel.id = "tour-panel";
    this.panel.className = "tour-panel";
    this.panel.hidden = true;
    this.panel.setAttribute("role", "region");
    this.panel.setAttribute("aria-labelledby", "tour-title");
    this.panel.innerHTML = tourMarkup;
    document.querySelector(".center-panel")!.append(this.panel);
    this.title = this.panel.querySelector("#tour-title")!;
    this.next = this.panel.querySelector("#tour-next")!;
    this.back = this.panel.querySelector("#tour-back")!;
    this.jump = this.panel.querySelector("#tour-jump")!;
  }
  render(state: TourState, agentAvailable: boolean) {
    this.target?.classList.remove("tour-target");
    this.panel.hidden = !state.open;
    if (!state.open) return;
    const step = tourSteps[state.step];
    message(this.title, step.title);
    message(
      this.panel.querySelector("#tour-progress")!,
      state.step === 0 ? "tour.intro" : "tour.progress",
      { step: state.step },
    );
    message(
      this.panel.querySelector("#tour-description")!,
      state.step > 0 && state.step < 3 && !agentAvailable
        ? "tour.empty"
        : step.description,
    );
    this.back.hidden = state.step === 0 || state.step === 3;
    message(this.next, step.next);
    this.next.disabled =
      (state.step === 1 && !agentAvailable) ||
      (state.step === 2 && !state.enteredFirstPerson);
    message(this.jump, step.jump);
    this.jump.setAttribute("aria-controls", step.target);
    this.target = document.getElementById(step.target);
    this.jump.disabled =
      !this.target ||
      Boolean(this.target.hidden) ||
      (state.step > 0 && state.step < 3 && !agentAvailable);
    this.target?.classList.add("tour-target");
    this.place();
  }
  place() {
    if (this.panel.hidden || !this.target || this.target.hidden) return;
    const dock = dockForTarget(
      { width: window.innerWidth, height: window.innerHeight },
      this.panel.getBoundingClientRect(),
      this.target.getBoundingClientRect(),
    );
    if (dock) this.panel.dataset.dock = dock;
  }
  focusPanel() {
    this.panel.scrollTop = 0;
    this.title.focus({ preventScroll: true });
  }
  focusTarget() {
    if (!this.target || this.jump.disabled) return;
    this.target.scrollIntoView({ block: "center", behavior: "auto" });
    this.place();
    // The viewport is a canvas container; don't add persistent tab stops to it.
    if (this.target.id === "viewport") return;
    this.target.focus({ preventScroll: true });
  }
  dispose() {
    this.target?.classList.remove("tour-target");
    this.panel.remove();
  }
}
