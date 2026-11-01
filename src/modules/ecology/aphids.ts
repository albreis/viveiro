import type { FamilyWorld } from "../colonies/types.ts";
export function updateAphids(w: FamilyWorld) {
  const e = w.ecology;
  if (!e) return;
  const h = w.params.humidity / 100,
    light = w.params.light / 100;
  for (const a of e.aphids) {
    const p = w.plants.find((p) => p.id === a.plant);
    const fit = p
      ? Math.max(0, 1 - Math.abs(h - 0.65) * 1.8) *
        (p.health ?? 1) *
        (0.25 + light * 0.75)
      : 0;
    // Abstract conversion of plant biomass into food units; no measured sugar mass.
    const sap = p
      ? Math.max(0, Math.min((p.biomass - 0.05) * 25, a.count * 0.00009 * fit))
      : 0;
    if (p) p.biomass -= sap / 25;
    e.sap += sap;
    e.assimilated += sap * 0.4;
    const honey = sap * 0.6;
    e.honeyProduced += honey;
    const overflow = Math.max(0, a.honey + honey - 1.2),
      loss = Math.min(a.honey, 0.001 * (1 + w.landscape.rainPulse) * a.honey);
    a.honey = Math.max(0, Math.min(1.2, a.honey + honey) - loss);
    e.honeyLost += overflow + loss;
    const nourished = Math.min(
      fit,
      sap / Math.max(0.0000001, a.count * 0.00009),
    );
    a.count = Math.max(
      0,
      Math.min(
        p ? 40 * p.biomass : 0,
        a.count + a.count * (0.00035 * nourished - 0.0004 * (1 - nourished)),
      ),
    );
  }
}
