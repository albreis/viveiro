import type { Terrarium } from "./scene.ts";
export function installSceneInput(host: Terrarium) {
  let down: { x: number; y: number; lastX: number; lastY: number } | null =
    null;
  host.renderer.domElement.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY };
  });
  host.renderer.domElement.addEventListener("pointermove", (e) => {
    if (host.followId && down) {
      host.lookYaw += (e.clientX - down.lastX) * 0.004;
      host.lookPitch = Math.max(
        -0.8,
        Math.min(0.8, host.lookPitch - (e.clientY - down.lastY) * 0.004),
      );
      down.lastX = e.clientX;
      down.lastY = e.clientY;
      return;
    }
    const p = host.groundPoint(e);
    host.marker.visible = !!host.tool && !!p;
    if (p) host.marker.position.set(p.x, 0.045, p.z);
  });
  host.renderer.domElement.addEventListener(
    "pointerleave",
    () => (host.marker.visible = false),
  );
  host.renderer.domElement.addEventListener("pointerup", (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    if (host.followId || moved > 6) return;
    const p = host.groundPoint(e);
    if (host.tool) {
      if (p) host.onPlace(host.tool, p.x, p.z);
      return;
    }
    const id = host.pickAnt(e);
    if (id) {
      host.selectedId = id;
      host.onSelect?.(id);
    }
  });
  host.renderer.domElement.addEventListener("dblclick", (e) => {
    if (host.tool || host.followId) return;
    const id = host.pickAnt(e);
    if (!id) return;
    e.preventDefault();
    host.selectedId = id;
    host.onSelect?.(id);
    host.followAnt(id);
    host.onFollowStarted?.(id);
  });
}
