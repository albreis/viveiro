export type PerformanceMode = "full" | "light";
export interface RenderProfile {
  mode: PerformanceMode;
  pixelRatio: number;
  shadows: boolean;
  workerLimit: number;
  soilDetail: "full" | "light";
  forecast: "complete" | "counts";
}
const profiles: Record<PerformanceMode, RenderProfile> = {
  full: {
    mode: "full",
    pixelRatio: 1.8,
    shadows: true,
    workerLimit: Infinity,
    soilDetail: "full",
    forecast: "complete",
  },
  light: {
    mode: "light",
    pixelRatio: 1,
    shadows: false,
    workerLimit: 80,
    soilDetail: "light",
    forecast: "counts",
  },
};
export function renderProfile(mode: unknown): Readonly<RenderProfile> {
  return profiles[mode === "light" ? "light" : "full"];
}
interface RenderAgent {
  id: number;
  x: number;
  y?: number;
  z: number;
}
export function visibleWorkers<T extends RenderAgent>(
  workers: readonly T[],
  profile: Readonly<RenderProfile>,
  camera: { x: number; y: number; z: number },
  follow: number | null,
  selected: number | null,
): T[] {
  const visible = workers.filter((ant) => ant.id !== follow);
  if (visible.length <= profile.workerLimit) return visible;
  const distance = (ant: T) =>
    (ant.x - camera.x) ** 2 +
    ((ant.y ?? 0) - camera.y) ** 2 +
    (ant.z - camera.z) ** 2;
  return visible
    .sort(
      (a, b) =>
        Number(b.id === selected) - Number(a.id === selected) ||
        distance(a) - distance(b) ||
        a.id - b.id,
    )
    .slice(0, profile.workerLimit);
}
