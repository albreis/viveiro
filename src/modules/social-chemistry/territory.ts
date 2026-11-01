import type { FamilyWorld } from "../colonies/types.ts";
import { allAnts } from "../colonies/types.ts";
import { diffuseEvaporate } from "../chemistry/reaction-diffusion.ts";
export const territoryIndex = (x: number, z: number) =>
  Math.max(0, Math.min(25, Math.floor(((z + 6.5) / 13) * 26))) * 40 +
  Math.max(0, Math.min(39, Math.floor(((x + 10) / 20) * 40)));
export function updateTerritory(root: FamilyWorld) {
  const state = root.socialChemistry;
  if (!state) return;
  for (const field of Object.values(state.territory)) {
    const before = field.reduce((s, v) => s + v, 0);
    diffuseEvaporate(field, {
      width: 40,
      height: 26,
      cellSize: 0.5,
      diffusion: 0.006,
      decay: 0.006 + (1 - root.params.humidity / 100) * 0.003,
      dt: 1,
      windX: 0,
      windZ: 0,
    });
    state.evaporated += before - field.reduce((s, v) => s + v, 0);
  }
  for (const a of allAnts(root))
    if (a.kind === "worker" && a.node === null && a.energy > 0) {
      const field = state.territory[String(a.colonyId || 1)];
      if (!field) continue;
      const i = territoryIndex(a.x, a.z),
        amount = Math.max(0, Math.min(0.018, 10 - field[i]));
      field[i] += amount;
      state.deposited += amount;
    }
}
export function localTerritory(
  w: FamilyWorld,
  a: { x: number; z: number; colonyId?: number },
) {
  const fields = w.socialChemistry?.territory || {},
    i = territoryIndex(a.x, a.z),
    own = fields[String(a.colonyId || 1)]?.[i] || 0;
  const foreign = Object.entries(fields).reduce(
    (s, [id, f]) => s + (id === String(a.colonyId || 1) ? 0 : f[i]),
    0,
  );
  return { own, foreign };
}
