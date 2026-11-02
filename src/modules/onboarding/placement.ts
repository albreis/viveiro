export type TourDock =
  "bottom-right" | "bottom-left" | "top-right" | "top-left";
export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
export function dockForTarget(
  viewport: { width: number; height: number },
  card: { width: number; height: number },
  target: Rect,
): TourDock | null {
  const margin = 20,
    gap = 8;
  for (const dock of [
    "bottom-right",
    "bottom-left",
    "top-right",
    "top-left",
  ] as const) {
    const left = dock.endsWith("left")
      ? margin
      : viewport.width - card.width - margin;
    const top = dock.startsWith("top")
      ? margin
      : viewport.height - card.height - margin;
    if (
      left + card.width + gap < target.left ||
      left - gap > target.right ||
      top + card.height + gap < target.top ||
      top - gap > target.bottom
    )
      return dock;
  }
  return null;
}
