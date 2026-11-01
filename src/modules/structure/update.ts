import type { SoilWorld } from "../soil/types.ts";
import { sampleClimate } from "../microclimate/grid.ts";
import { roofGeometry } from "./geometry.ts";
import { roofStrength } from "./strength.ts";
import { releaseRoof } from "./release.ts";
export function updateStructure(w: SoilWorld) {
  const s = (w.soil.structure ??= {
    version: 1,
    revision: -1,
    steps: 0,
    patches: [],
    failures: 0,
    lastFailure: [],
    released: 0,
  });
  const old = new Map(s.patches.map((p) => [p.key, p]));
  const geometry =
    s.revision === w.nest.revision ? s.patches : roofGeometry(w.nest);
  s.patches = geometry.map((g) => {
    const previous = old.get(g.key),
      water = sampleClimate(w.microclimate, g.roof)?.water ?? 0.55;
    const force = roofStrength(
      g,
      water,
      w.params.reposeAngle ?? 36,
      w.soil.integrity[g.edge] ?? 1,
    );
    const same =
      previous &&
      Math.hypot(
        previous.roof.x - g.roof.x,
        previous.roof.y - g.roof.y,
        previous.roof.z - g.roof.z,
      ) < 0.12;
    const damage = Math.min(
      1,
      (same ? previous.damage : 0) + Math.max(0, 1 - force.safety) * 0.08,
    );
    return { ...g, ...force, water, damage };
  });
  s.steps++;
  s.revision = w.nest.revision;
  for (const p of s.patches) {
    if (p.damage < 1 || w.tick - (s.lastFailure[p.edge] ?? -1000) < 500)
      continue;
    const grain = releaseRoof(w, p);
    if (!grain) continue;
    s.failures++;
    s.released += grain.mass;
    s.lastFailure[p.edge] = w.tick;
    p.damage = 0;
    w.log(
      "Uma placa do teto perdeu suporte e se desprendeu. As operárias podem retirar a terra.",
      "danger",
    );
    break;
  }
}
