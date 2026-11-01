import type { NestState } from "../navigation/types.ts";
import type { FoundingState } from "../founding/types.ts";
import { updatePlugRadius } from "./material.ts";
const fail = () => {
  throw new Error("Estado do tampão ou da terra recuperada inconsistente.");
};
const finite = (x: unknown) => typeof x === "number" && Number.isFinite(x);
const point = (p: unknown) =>
  !!p &&
  typeof p === "object" &&
  ["x", "y", "z"].every((k) => finite((p as Record<string, unknown>)[k]));
/** Validate stored material independently of the visual mesh; never repair by granting soil. */
export function validatePlugMaterials(nest: unknown, soil: unknown): void {
  const n = nest as NestState | undefined,
    s = soil as { reclaimed?: number; deposited: number } | undefined;
  if (
    s?.reclaimed !== undefined &&
    (!finite(s.reclaimed) ||
      s.reclaimed < 0 ||
      !finite(s.deposited) ||
      s.reclaimed > s.deposited + 1e-7)
  )
    fail();
  if (n?.plugs === undefined) return;
  if (!Array.isArray(n.plugs) || n.plugs.length > 16) fail();
  const ids = new Set<number>();
  for (const p of n.plugs) {
    if (
      !p ||
      p.version !== 1 ||
      !point(p) ||
      !point(p.axis) ||
      !Number.isSafeInteger(p.id) ||
      ids.has(p.id) ||
      !Number.isSafeInteger(p.owner) ||
      p.owner < 1 ||
      !Number.isInteger(p.edge) ||
      !n.links[p.edge]
    )
      fail();
    ids.add(p.id);
    if (
      Math.abs(Math.hypot(p.axis.x, p.axis.y, p.axis.z) - 1) > 1e-7 ||
      !finite(p.radius) ||
      p.radius <= 0 ||
      p.radius > 1.5 ||
      !finite(p.depth) ||
      p.depth <= 0 ||
      p.depth > 1 ||
      !finite(p.capacity) ||
      p.capacity <= 0 ||
      !finite(p.mass) ||
      p.mass < 0 ||
      p.mass > p.capacity + 1e-9 ||
      !finite(p.innerRadius)
    )
      fail();
    if (
      !Array.isArray(p.shells) ||
      p.shells.length !== 32 ||
      p.shells.some((x) => !finite(x) || x < 0) ||
      Math.abs(p.shells.reduce((n, x) => n + x, 0) - p.capacity) > 1e-8 ||
      p.capacity > Math.PI * p.radius * p.radius * p.depth + 1e-8
    )
      fail();
    const expected = { ...p };
    updatePlugRadius(expected);
    if (Math.abs(expected.innerRadius - p.innerRadius) > 1e-7) fail();
  }
}
export function validateSealTask(
  f: FoundingState | undefined,
  required: boolean,
  nest: unknown,
): void {
  if (!f) return;
  if (!f.seal) {
    if (required && ["sealing", "claustral", "established"].includes(f.phase))
      fail();
    return;
  }
  const t = f.seal,
    n = nest as NestState,
    p = n?.plugs?.find((p) => p.id === t.plugId),
    pair = p && n.links[p.edge];
  if (
    !required ||
    t.version !== 1 ||
    !p ||
    !pair ||
    !pair.includes(f.entry!) ||
    !pair.includes(f.front!) ||
    !point(t.queenPoint) ||
    !point(t.workerPoint) ||
    ![
      "collect",
      "return",
      "build",
      "closed",
      "remove",
      "haul",
      "opened",
    ].includes(t.phase) ||
    !Number.isSafeInteger(t.trips) ||
    t.trips < 0
  )
    fail();
  if (t.workerId !== undefined && !Number.isSafeInteger(t.workerId)) fail();
  for (const tick of [t.closedTick, t.openedTick])
    if (tick !== undefined && (!Number.isSafeInteger(tick) || tick < 0)) fail();
  if (t.phase === "closed" && Math.abs(p!.mass - p!.capacity) > 1e-7) fail();
  if (t.phase === "opened" && p!.mass > 1e-7) fail();
}
