interface Position {
  x: number;
  y: number;
  z: number;
  set(x: number, y: number, z: number): void;
}
export interface KeyboardCamera {
  followId: number | null;
  lookYaw: number;
  lookPitch: number;
  camera: { position: Position };
  controls: {
    target: Position;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    update(): void;
  };
  setView(view: boolean): void;
}
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
/** Changes presentation only. No world, RNG, ant position or biological clock access. */
export function keyboardCamera(host: KeyboardCamera, key: string): boolean {
  if (
    ![
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "+",
      "=",
      "-",
      "Home",
    ].includes(key)
  )
    return false;
  if (host.followId) {
    if (key === "Home") host.lookYaw = host.lookPitch = 0;
    if (key === "ArrowLeft") host.lookYaw -= 0.12;
    if (key === "ArrowRight") host.lookYaw += 0.12;
    if (key === "ArrowUp")
      host.lookPitch = clamp(host.lookPitch + 0.1, -0.8, 0.8);
    if (key === "ArrowDown")
      host.lookPitch = clamp(host.lookPitch - 0.1, -0.8, 0.8);
    return true;
  }
  if (key === "Home") {
    host.setView(false);
    return true;
  }
  const p = host.camera.position,
    c = host.controls,
    t = c.target;
  const dx = p.x - t.x,
    dy = p.y - t.y,
    dz = p.z - t.z;
  let radius = Math.hypot(dx, dy, dz);
  if (radius < 0.001) return true;
  let angle = Math.atan2(dx, dz),
    polar = Math.acos(clamp(dy / radius, -1, 1));
  if (key === "ArrowLeft") angle -= 0.12;
  if (key === "ArrowRight") angle += 0.12;
  if (key === "ArrowUp") polar -= 0.1;
  if (key === "ArrowDown") polar += 0.1;
  if (key === "+" || key === "=") radius *= 0.9;
  if (key === "-") radius /= 0.9;
  radius = clamp(radius, c.minDistance, c.maxDistance);
  polar = clamp(polar, c.minPolarAngle, c.maxPolarAngle);
  p.set(
    t.x + radius * Math.sin(polar) * Math.sin(angle),
    t.y + radius * Math.cos(polar),
    t.z + radius * Math.sin(polar) * Math.cos(angle),
  );
  c.update();
  return true;
}
