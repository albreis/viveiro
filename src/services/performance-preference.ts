import {
  renderProfile,
  type PerformanceMode,
} from "../modules/renderer/performance-profile.ts";
const key = "viveiro:render-profile:v1";
/** Display preference only: never enters a model snapshot or replay. */
export function readPerformanceMode(): PerformanceMode {
  try {
    return renderProfile(localStorage.getItem(key)).mode;
  } catch {
    return "full";
  }
}
export function writePerformanceMode(mode: PerformanceMode): boolean {
  try {
    localStorage.setItem(key, renderProfile(mode).mode);
    return true;
  } catch {
    return false;
  }
}
