export type TourStep = 0 | 1 | 2 | 3;
export interface TourState {
  open: boolean;
  step: TourStep;
  enteredFirstPerson: boolean;
}
export type TourEvent =
  | { type: "start"; firstPerson: boolean }
  | { type: "next"; agentAvailable: boolean }
  | { type: "back" }
  | { type: "close" }
  | { type: "first-person" };

export function initialTour(): TourState {
  return { open: false, step: 0, enteredFirstPerson: false };
}
export function tourTransition(
  state: Readonly<TourState>,
  event: TourEvent,
): TourState {
  if (event.type === "start")
    return {
      open: true,
      step: event.firstPerson ? 3 : 0,
      enteredFirstPerson: event.firstPerson,
    };
  if (!state.open) return { ...state };
  if (event.type === "close") return { ...state, open: false };
  if (event.type === "first-person")
    return { ...state, step: 3, enteredFirstPerson: true };
  if (event.type === "back")
    return { ...state, step: Math.max(0, state.step - 1) as TourStep };
  if (state.step === 3) return { ...state, open: false };
  if (state.step === 1 && !event.agentAvailable) return { ...state };
  if (state.step === 2 && !state.enteredFirstPerson) return { ...state };
  return { ...state, step: (state.step + 1) as TourStep };
}
export function shouldOfferTour(
  hadSavedExperiment: boolean,
  choice: unknown,
): boolean {
  return !hadSavedExperiment && choice == null;
}
export function tourOutcome(
  state: Readonly<TourState>,
): "completed" | "dismissed" {
  return state.enteredFirstPerson ? "completed" : "dismissed";
}
