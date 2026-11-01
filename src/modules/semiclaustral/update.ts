import type { FoundingWorld } from "../founding/types.ts";
import { founder, spendReserve } from "../founding/types.ts";
import { haulFoundingSoil, travelToFront } from "../founding/travel.ts";
import { outsideSite } from "../founding/site.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { FORAGING_PARAMETERS as p } from "./types.ts";
/** The queen knows her own entrance; food is detected only within antenna range. */
export function updateFoundressForaging(w: FoundingWorld): void {
  const f = w.founding!,
    s = f.foraging!,
    q = founder(w)!;
  const home = w.nest.nodes[f.front!];
  const goal = { x: home.x - 0.12, y: home.y - home.r * 0.88, z: home.z };
  if (s.phase === "nursing") {
    q.state = "Cuidando da prole e do alimento coletado";
    if (
      f.nanitics > 0 ||
      w.tick < s.nextDeparture ||
      s.pantry >= p.pantryTarget
    )
      return;
    s.phase = "outbound";
    s.searchTicks = 0;
    const out = outsideSite(f, 0.72);
    s.heading = Math.atan2(out.z - f.site.z, out.x - f.site.x);
  }
  if (s.phase === "outbound") {
    const out = outsideSite(f, 0.72),
      lip = { ...out, y: surfaceHeight(w.nest.relief, out.x, out.z) + 0.008 };
    q.state = "Saindo para coletar alimento na fundação semiclaustral";
    if (haulFoundingSoil(w, q, lip)) s.phase = "searching";
    return;
  }
  if (s.phase === "searching") {
    s.searchTicks++;
    if (f.nanitics > 0 || s.searchTicks >= p.searchLimit) {
      s.phase = "returning";
      return;
    }
    const danger = w.predators.find(
      (a) => Math.hypot(a.x - q.x, a.z - q.z) < 1.5,
    );
    let heading = s.heading;
    if (danger) {
      heading = Math.atan2(q.z - danger.z, q.x - danger.x);
      q.state = "Fugindo de predador durante a coleta";
      s.phase = "returning";
    } else {
      let best: number = p.sensorRadius,
        nearest: (typeof w.patches)[number] | undefined;
      for (const patch of w.patches) {
        const d = Math.hypot(patch.x - q.x, patch.z - q.z);
        if (patch.amount > 1e-9 && d < best) {
          best = d;
          nearest = patch;
        }
      }
      if (nearest) {
        heading = Math.atan2(nearest.z - q.z, nearest.x - q.x);
        q.state = "Rainha coletando alimento";
        if (
          best < p.contactRadius &&
          Math.abs(
            (q.y ?? 0) - surfaceHeight(w.nest.relief, nearest.x, nearest.z),
          ) < 0.25
        ) {
          const amount = Math.min(p.capacity, nearest.amount);
          nearest.amount -= amount;
          nearest.discovered = true;
          s.load += amount;
          s.collected += amount;
          q.carrying = s.load;
          s.phase = "returning";
          return;
        }
      } else {
        if (s.searchTicks % 35 === 0) heading += w.range(-0.9, 0.9);
        q.state = "Explorando com sensores locais";
      }
    }
    s.heading = heading;
    w.moveSurface(q, heading, q.speed * 0.85);
    spendReserve(w, "maintenance", p.travelCost);
    return;
  }
  q.state =
    s.load > 0
      ? "Rainha levando alimento à primeira câmara"
      : "Voltando ao primeiro abrigo";
  if (!travelToFront(w, q, goal)) return;
  s.pantry += s.load;
  s.delivered += s.load;
  if (s.load > 0) s.trips++;
  s.load = 0;
  q.carrying = 0;
  s.phase = "nursing";
  s.nextDeparture = w.tick + p.restTicks;
  if (f.nanitics > 0) return;
  w.log(
    "A rainha voltou ao abrigo: " +
      s.pantry.toFixed(2) +
      " crédito(s) de alimento coletado disponíveis.",
    "food",
  );
}
