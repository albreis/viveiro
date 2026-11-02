import { modelMath } from "../../libs/model-math.ts";
import type { StockWorld, FoodFlow } from "./types.ts";
import { stockBalance } from "./ledger.ts";
const finite = (n: unknown) =>
  typeof n === "number" && Number.isFinite(n) && n >= 0;
const flows = new Set<FoodFlow>([
  "foraged",
  "refund",
  "foundress",
  "brood",
  "silk",
  "care",
  "sexual",
  "spoilage",
  "stolen",
]);
export function validateRoomStores(
  value: unknown,
  required: boolean,
  sharedNest?: StockWorld["nest"],
): void {
  const w = value as StockWorld,
    s = w.colony?.stores;
  const nest = w.nest ?? sharedNest;
  for (const a of w.ants ?? [])
    if (
      a.stockGoal !== undefined &&
      (!required ||
        !Number.isSafeInteger(a.stockGoal) ||
        a.stockGoal < 0 ||
        (nest && !nest.nodes[a.stockGoal]))
    )
      throw new Error("Destino alimentar inválido.");
  if (!s) {
    if (required) throw new Error("Estoque espacial ausente.");
    return;
  }
  if (
    !required ||
    s.version !== 1 ||
    ![w.food, s.initial, s.incoming, s.outgoing].every(finite) ||
    !Array.isArray(s.bins) ||
    s.bins.length > 1024 ||
    !s.flows
  )
    throw new Error("Estoque espacial inválido.");
  const seen = new Set<number>();
  for (const b of s.bins) {
    if (
      !Number.isSafeInteger(b.node) ||
      b.node < 0 ||
      seen.has(b.node) ||
      !finite(b.amount) ||
      !b.point ||
      ![b.point.x, b.point.y, b.point.z].every(Number.isFinite)
    )
      throw new Error("Câmara alimentar inválida.");
    seen.add(b.node);
    if (
      nest &&
      nest.nodes[b.node] &&
      ((nest.nodes[b.node].colonyId ?? 1) !== (w.colonyId ?? 1) ||
        modelMath.hypot(
          b.point.x - nest.nodes[b.node].x,
          b.point.y - nest.nodes[b.node].y,
          b.point.z - nest.nodes[b.node].z,
        ) >
          nest.nodes[b.node].r + 0.5)
    )
      throw new Error("Localização alimentar inválida.");
    if (nest && !nest.nodes[b.node])
      throw new Error("Câmara alimentar inexistente.");
  }
  for (const [key, n] of Object.entries(s.flows))
    if (!flows.has(key as FoodFlow) || !Number.isFinite(n))
      throw new Error("Fluxo alimentar inválido.");
  const b = stockBalance(w)!;
  const flow = Object.values(s.flows).reduce((n, v) => n + (v ?? 0), 0);
  if (
    Math.abs(b.ledger) > 1e-7 ||
    Math.abs(b.rooms) > 1e-7 ||
    Math.abs(flow - s.incoming + s.outgoing) > 1e-7
  )
    throw new Error("Balanço alimentar inconsistente.");
}
