import type { LaboratoryGeometry } from "../../src/modules/terrain/laboratory.ts";
import type { AgentState } from "../../src/modules/navigation/types.ts";
/** Numeric-only diagnostic. Markers show centres, not calibrated ant silhouettes. */
export function laboratorySvg(
  g: LaboratoryGeometry,
  ants: readonly Pick<AgentState, "x" | "z">[],
) {
  const mm = g.millimetersPerUnit,
    radius = g.arenaRadius * mm;
  const points = ants
    .map((a) => '<circle cx="' + a.x * mm + '" cy="' + a.z * mm + '" r="1.8"/>')
    .join("");
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-270 -295 540 610">' +
    '<rect x="-270" y="-295" width="540" height="610" fill="#faf9f2"/>' +
    '<text x="-250" y="-268" fill="#233d34" font-size="16">World · laboratory geometry · ' +
    ants.length +
    " workers</text>" +
    '<circle r="' +
    radius +
    '" fill="#f5f3e9" stroke="#667b65"/>' +
    '<rect x="' +
    -g.coverHalfWidth * mm +
    '" y="' +
    -g.coverHalfWidth * mm +
    '" width="' +
    2 * g.coverHalfWidth * mm +
    '" height="' +
    2 * g.coverHalfWidth * mm +
    '" fill="#dfebe6" fill-opacity="0.45" stroke="#75968c" stroke-dasharray="4 3"/>' +
    '<circle r="' +
    g.sandRadius * mm +
    '" fill="#c5a573" stroke="#a68655"/>' +
    '<g fill="#733e26">' +
    points +
    "</g>" +
    '<text x="-250" y="280" fill="#233d34" font-size="12">Sand Ø200 mm · depth 5 mm · arena Ø500 mm</text>' +
    '<text x="-250" y="300" fill="#233d34" font-size="11">Initial preparation only · no physical-time predictions</text></svg>\n'
  );
}
