interface MaterialWorld {
  nest?: { plugs?: { mass: number }[]; rubble?: { mass: number }[] };
  soil?: {
    removed: number;
    eroded: number;
    deposited: number;
    reclaimed?: number;
    deposits: { mass: number }[];
  };
  ants: { id: number; carryingSoil?: number }[];
  colonies?: MaterialWorld[];
}
/** Validate once after assembling the whole shared habitat, never per daughter alone. */
export function validateSealBudget(value: unknown): void {
  const w = value as MaterialWorld,
    s = w.soil;
  if (!w.nest?.plugs?.length && s?.reclaimed === undefined) return;
  const fail = () => {
    throw new Error("Balanço de terra do tampão inconsistente.");
  };
  if (
    !s ||
    ![s.removed, s.eroded, s.deposited, s.reclaimed ?? 0].every(
      (x) => Number.isFinite(x) && x >= 0,
    ) ||
    !Array.isArray(s.deposits)
  )
    fail();
  const grains = [...(w.nest?.rubble || []), ...(s!.deposits || [])];
  if (grains.some((p) => !p || !Number.isFinite(p.mass) || p.mass < 0)) fail();
  const agents = new Map(
    [w, ...(w.colonies || [])].flatMap((c) => c.ants).map((a) => [a.id, a]),
  );
  if (
    [...agents.values()].some(
      (a) => !Number.isFinite(a.carryingSoil ?? 0) || (a.carryingSoil ?? 0) < 0,
    )
  )
    fail();
  const carried = [...agents.values()].reduce(
      (n, a) => n + (a.carryingSoil || 0),
      0,
    ),
    loose = (w.nest?.rubble || []).reduce((n, p) => n + p.mass, 0),
    sealed = (w.nest?.plugs || []).reduce((n, p) => n + p.mass, 0),
    surface = s!.deposited - (s!.reclaimed || 0);
  if (
    Math.abs(s!.removed + s!.eroded - carried - loose - sealed - surface) >
      1e-7 ||
    Math.abs(s!.deposits.reduce((n, p) => n + p.mass, 0) - surface) > 1e-7
  )
    fail();
}
