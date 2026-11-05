import { modelMath } from "../../../libs/model-math.ts";
import { seededRandom } from "../../../libs/seeded-random.ts";
import { BUHL_DISK_MM, type ArenaPoint, type BuhlArena } from "./geometry.ts";

export type BuhlGroupSize = 50 | 100 | 200;

/** Random dispersal in the annulus, independent of later behaviour draws. */
export function placeBuhlWorkers(
  arena: BuhlArena,
  seed: string,
  workers: BuhlGroupSize,
  separationMm: number,
): ArenaPoint[] {
  if (![50, 100, 200].includes(workers))
    throw Error("O protocolo exige grupos de 50, 100 ou 200 operárias.");
  if (!Number.isFinite(separationMm) || separationMm <= 0)
    throw Error("Informe a separação inicial em mm.");
  const inner = BUHL_DISK_MM.sandDiameter / 2 + separationMm / 2;
  const outer = BUHL_DISK_MM.arenaDiameter / 2 - separationMm / 2;
  if (inner >= outer) throw Error("Separação incompatível com o anel externo.");
  const points: ArenaPoint[] = [];
  const rng = seededRandom(seed + ":buhl-arena-placement-v1");
  for (
    let attempt = 0;
    attempt < workers * 100 && points.length < workers;
    attempt++
  ) {
    const distance = Math.sqrt(rng.range(inner * inner, outer * outer));
    const angle = rng.range(0, 2 * Math.PI);
    const point = {
      xMm: distance * modelMath.cos(angle),
      zMm: distance * modelMath.sin(angle),
    };
    if (arena.material(arena.indexAt(point)) !== "floor") continue;
    if (
      points.some((p) => {
        const dx = p.xMm - point.xMm;
        const dz = p.zMm - point.zMm;
        return dx * dx + dz * dz < separationMm * separationMm;
      })
    )
      continue;
    points.push(point);
  }
  if (points.length !== workers)
    throw Error("Não couberam todas as operárias com a separação solicitada.");
  return points;
}
