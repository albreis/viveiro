/** Geometry-only laboratory mode. Dimensions are model units unless named Mm. */
export interface LaboratoryGeometry {
  kind: "gautrais-sand-disk-preparation-v1";
  millimetersPerUnit: number;
  sandRadius: number;
  sandDepth: number;
  arenaRadius: number;
  coverHalfWidth: number;
  coverThickness: number;
}
export function validateLaboratoryGeometry(g: LaboratoryGeometry): void {
  if (
    !g ||
    g.kind !== "gautrais-sand-disk-preparation-v1" ||
    Object.keys(g).sort().join() !==
      "arenaRadius,coverHalfWidth,coverThickness,kind,millimetersPerUnit,sandDepth,sandRadius" ||
    ![
      g.millimetersPerUnit,
      g.sandRadius,
      g.sandDepth,
      g.arenaRadius,
      g.coverHalfWidth,
      g.coverThickness,
    ].every((v) => Number.isFinite(v) && v > 0) ||
    g.millimetersPerUnit > 1000 ||
    g.sandRadius > 1000 ||
    g.arenaRadius <= g.sandRadius ||
    g.coverHalfWidth <= g.sandRadius ||
    g.coverHalfWidth >= g.arenaRadius ||
    g.sandDepth >= g.sandRadius ||
    g.coverThickness >= g.sandDepth
  )
    throw Error("Invalid laboratory geometry");
}
/** The legacy tick must never silently become a physical laboratory second. */
export function assertLaboratoryRunnable(nest: {
  laboratory?: LaboratoryGeometry;
}) {
  if (!nest.laboratory) return;
  validateLaboratoryGeometry(nest.laboratory);
  throw Error(
    "Laboratory preparation cannot advance: physical clocks, boundaries and soil transport are not integrated yet (K1)",
  );
}
