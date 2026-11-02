import {
  initialTour,
  shouldOfferTour,
  tourOutcome,
  tourTransition,
  type TourEvent,
} from "../modules/onboarding/tour.ts";
import {
  readTourChoice,
  writeTourChoice,
} from "../services/tour-preference.ts";
import { TourView } from "./tour/view.ts";

export function installTourControls(context: {
  hadSavedExperiment: boolean;
  ready(): boolean;
}) {
  const view = new TourView();
  const opener = document.createElement("button");
  opener.id = "tour-open";
  opener.type = "button";
  opener.className = "text-button";
  opener.textContent = "Tour guiado";
  opener.setAttribute("aria-controls", "tour-panel");
  opener.setAttribute("aria-expanded", "false");
  document.getElementById("help")!.before(opener);
  let state = initialTour(),
    returnFocus: HTMLElement | null = null;
  const select = document.getElementById("ant-select") as HTMLSelectElement;
  const exit = document.getElementById("exit-ant")!;
  const firstPerson = () => !exit.hidden;
  const available = () => select.options.length > 0;
  const render = (focus = false) => {
    view.render(state, available());
    opener.setAttribute("aria-expanded", String(state.open));
    if (focus && state.open) view.focusPanel();
  };
  const dispatch = (event: TourEvent, focus = true) => {
    const wasOpen = state.open;
    state = tourTransition(state, event);
    render(focus);
    if (wasOpen && !state.open) {
      writeTourChoice(tourOutcome(state));
      const target = returnFocus?.isConnected ? returnFocus : opener;
      target.focus({ preventScroll: true });
    }
  };
  const start = () => {
    if (!context.ready()) return;
    returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : opener;
    dispatch({ type: "start", firstPerson: firstPerson() });
  };
  opener.onclick = start;
  view.next.onclick = () =>
    dispatch({ type: "next", agentAvailable: available() });
  view.back.onclick = () => dispatch({ type: "back" });
  view.jump.onclick = () => view.focusTarget();
  for (const id of ["tour-close", "tour-skip"])
    view.panel.querySelector<HTMLButtonElement>("#" + id)!.onclick = () =>
      dispatch({ type: "close" });
  const key = (event: KeyboardEvent) => {
    if (!state.open || document.querySelector("dialog[open]")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      dispatch({ type: "close" });
    } else if (view.panel.contains(event.target as Node)) {
      if (event.code === "Space") event.stopPropagation();
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        dispatch(
          event.key === "ArrowLeft"
            ? { type: "back" }
            : { type: "next", agentAvailable: available() },
        );
      }
    }
  };
  document.addEventListener("keydown", key, true);
  const resized = () => view.place();
  window.addEventListener("resize", resized);
  window.addEventListener("scroll", resized, { passive: true });
  const observer = new MutationObserver(() => {
    if (!state.open) return;
    if (firstPerson()) dispatch({ type: "first-person" });
    else render(false);
  });
  observer.observe(exit, { attributes: true, attributeFilter: ["hidden"] });
  observer.observe(select, { childList: true });
  if (
    context.ready() &&
    shouldOfferTour(context.hadSavedExperiment, readTourChoice())
  )
    start();
  return {
    dispose() {
      observer.disconnect();
      window.removeEventListener("resize", resized);
      window.removeEventListener("scroll", resized);
      document.removeEventListener("keydown", key, true);
      view.dispose();
      opener.remove();
    },
  };
}
