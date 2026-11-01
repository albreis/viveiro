import { NEST, LIMIT, BOUNDS } from "./constants.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export function updatePredators(world, dead) {
  for (const p of world.predators) {
    p.previousX = p.x;
    p.previousY = p.y ?? 0;
    p.previousAngle = p.angle;
    p.previousZ = p.z;
    p.previousDistance = p.distanceWalked || 0;
    p.energy -= 0.012;
    if (p.cooldown > 0) p.cooldown--;
    let target = null,
      nearest = 2.6;
    for (const a of world.ants)
      if (
        a.kind === "worker" &&
        a.y >= -0.1 &&
        !dead.has(a.id) &&
        !world.nest.nodes.some(
          (n) => n.type === "entrance" && distance(a, n) < 1.3,
        )
      ) {
        const d = distance(a, p);
        if (d < nearest) {
          nearest = d;
          target = a;
        }
      }
    if (target) {
      p.angle = Math.atan2(target.z - p.z, target.x - p.x);
      if (nearest < 0.4 && p.cooldown === 0 && world.random() < 0.24) {
        target.deathCause = "predation";
        dead.add(target.id);
        world.deaths++;
        p.prey++;
        p.energy = Math.min(100, p.energy + 20);
        p.cooldown = 65;
        world.log("Uma aranha capturou uma operária.", "danger");
      }
    } else if (world.random() < 0.07) p.angle += world.range(-1, 1);
    const speed = target?.kind ? 0.062 : 0.024;
    world.moveSurface(p, p.angle, speed, true);
  }
  world.predators = world.predators.filter((p) => p.energy > 0);
}
