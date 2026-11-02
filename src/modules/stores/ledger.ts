import type { StockWorld, FoodFlow } from "./types.ts";
import type { Vec3 } from "../navigation/types.ts";
export const hasStockBin = (w: StockWorld, node: number) =>
  !!w.colony?.stores?.bins.some((b) => b.node === node && b.amount > 1e-9);
function binPoint(w: StockWorld, node: number): Vec3 {
  const n = w.nest?.nodes[node];
  if (!n) throw new Error("Câmara de estoque inexistente.");
  return { x: n.x, y: n.y - n.r * 0.9, z: n.z };
}
export function addStock(
  w: StockWorld,
  amount: number,
  flow: FoodFlow,
  node?: number,
  point?: Vec3,
): void {
  if (!(amount > 0)) return;
  if (!Number.isFinite(amount)) throw new Error("Entrada alimentar inválida.");
  const s = w.colony?.stores;
  if (s) {
    const target =
      node ??
      w.ants?.find((a) => a.kind === "queen" && a.node !== null)?.node ??
      w.nest?.nodes.findIndex(
        (n) => (n.colonyId ?? 1) === (w.colonyId ?? 1) && n.type !== "entrance",
      );
    if (target === undefined || target < 0)
      throw new Error("Entrada sem câmara de estoque.");
    let b = s.bins.find((b) => b.node === target);
    if (!b) {
      b = {
        node: target,
        point: point ? { ...point } : binPoint(w, target),
        amount: 0,
      };
      s.bins.push(b);
    }
    b.amount += amount;
    s.incoming += amount;
    s.flows[flow] = (s.flows[flow] ?? 0) + amount;
  }
  w.food += amount;
}
/** Colony-level brood budgets retain the existing pooled-feeding abstraction; direct visits are local. */
export function takeStock(
  w: StockWorld,
  requested: number,
  flow: FoodFlow,
  node?: number,
  localOnly = false,
): number {
  const s = w.colony?.stores;
  let amount = Math.max(0, Math.min(w.food, requested));
  if (!Number.isFinite(amount)) throw new Error("Saída alimentar inválida.");
  if (s) {
    const bins = [...s.bins].sort(
      (a, b) => Number(b.node === node) - Number(a.node === node),
    );
    const available = bins
      .filter((b) => !localOnly || b.node === node)
      .reduce((n, b) => n + b.amount, 0);
    amount = Math.min(amount, available);
    let remaining = amount;
    for (const b of bins) {
      if (localOnly && b.node !== node) continue;
      const paid = Math.min(b.amount, remaining);
      b.amount -= paid;
      remaining -= paid;
      if (remaining <= 0) break;
    }
    s.bins = s.bins.filter((b) => b.amount > 0);
    s.outgoing += amount;
    s.flows[flow] = (s.flows[flow] ?? 0) - amount;
  }
  w.food -= amount;
  return amount;
}
export function stockBalance(w: StockWorld) {
  const s = w.colony?.stores;
  return s
    ? {
        ledger: s.initial + s.incoming - s.outgoing - w.food,
        rooms: s.bins.reduce((n, b) => n + b.amount, 0) - w.food,
      }
    : null;
}
