export function logLevel(x: number, z: number) {
  const dx = x - 4.3,
    dz = z - 3.6,
    c = Math.cos(0.5),
    s = Math.sin(0.5);
  return ((dx * c + dz * s) / 1.95) ** 2 + ((-dx * s + dz * c) / 0.55) ** 2;
}
export const hitsLog = (x: number, z: number) => logLevel(x, z) < 1;
export function pondLevel(x: number, z: number) {
  return ((x - 4.3) / 1.9) ** 2 + ((z + 2.5) / 1.35) ** 2;
}
export function blocksObstacle(next: number, current: number) {
  return next < 1 && (current >= 1 || next <= current + 0.00001);
}
