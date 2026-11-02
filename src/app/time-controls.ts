import { SimulationClock, normalizeClock } from "../modules/time/clock.ts";
import { timeMarkup } from "./time-markup.ts";
export function installTimeControls(clock: SimulationClock, save: () => void) {
  const panel = document.createElement("section");
  panel.className = "panel time-panel";
  panel.id = "time-panel";
  panel.innerHTML = timeMarkup;
  document.querySelector(".scene-card")!.after(panel);
  const pace = document.getElementById("day-pace") as HTMLSelectElement,
    status = document.getElementById("clock-status")!;
  const render = () => {
    pace.value = String(clock.state.secondsPerDay);
    const lag =
      clock.state.pendingTicks >= 1
        ? " · " +
          Math.floor(clock.state.pendingTicks) +
          " passos aguardando processamento."
        : "";
    const text =
      "Ritmo nominal: " +
      (clock.state.secondsPerDay / clock.state.speed).toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      }) +
      " s/dia a " +
      clock.state.speed +
      "×. A página oculta pausa o relógio." +
      lag;
    if (status.textContent !== text) status.textContent = text;
    document
      .querySelectorAll<HTMLButtonElement>("[data-speed]")
      .forEach((b) => {
        const on = Number(b.dataset.speed) === clock.state.speed;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
  };
  pace.onchange = () => {
    clock.state = normalizeClock({
      ...clock.state,
      secondsPerDay: Number(pace.value),
    });
    render();
    save();
  };
  document.querySelectorAll<HTMLButtonElement>("[data-speed]").forEach(
    (b) =>
      (b.onclick = () => {
        clock.state = normalizeClock({
          ...clock.state,
          speed: Number(b.dataset.speed),
        });
        render();
        save();
      }),
  );
  render();
  return { render };
}
