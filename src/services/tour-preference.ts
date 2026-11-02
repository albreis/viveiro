export type TourChoice = "completed" | "dismissed";
export interface TourPreferenceStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export const tourPreferenceKey = "viveiro:first-visit-tour:v1";
function browserStore(): TourPreferenceStore | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
export function readTourChoice(store = browserStore()): TourChoice | null {
  try {
    const value = store?.getItem(tourPreferenceKey);
    return value === "completed" || value === "dismissed" ? value : null;
  } catch {
    return null;
  }
}
export function writeTourChoice(
  choice: TourChoice,
  store = browserStore(),
): boolean {
  try {
    if (!store) return false;
    store.setItem(tourPreferenceKey, choice);
    return true;
  } catch {
    return false;
  }
}
