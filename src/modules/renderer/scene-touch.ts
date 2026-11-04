import { TOUCH } from "three";
import type { Terrarium } from "./scene.ts";

export function installSceneTouch(
  host: Terrarium,
  cancelTap: () => void,
): void {
  const canvas = host.renderer.domElement;
  host.controls.touches.ONE = null;
  host.controls.touches.TWO = TOUCH.DOLLY_ROTATE;
  canvas.style.touchAction = "pan-y";

  let previous: { x: number; y: number } | undefined;
  const midpoint = (touches: TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });
  canvas.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length < 2) return;
      cancelTap();
      previous = midpoint(event.touches);
    },
    { passive: true },
  );
  canvas.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length < 2 || !event.cancelable) return;
      // Two fingers belong to the scene. A single finger can scroll the page.
      event.preventDefault();
      const current = midpoint(event.touches);
      if (host.followId && previous) {
        host.lookYaw += (current.x - previous.x) * 0.004;
        host.lookPitch = Math.max(
          -0.8,
          Math.min(0.8, host.lookPitch - (current.y - previous.y) * 0.004),
        );
      }
      previous = current;
    },
    { passive: false },
  );
  const end = () => {
    previous = undefined;
  };
  canvas.addEventListener("touchend", end);
  canvas.addEventListener("touchcancel", end);
}
