import { graphTopology } from "../topology.ts";
import { maskTopology, roundedLift, type PlanarMask } from "./mask.ts";
import { thinMask } from "./thin.ts";
import { skeletonGraph } from "./pixel-graph.ts";
export const NETWORK_OBSERVER_ID = "physical-section-4fg8bg-degree2-v2";
export function observePhysicalNetwork(mask: PlanarMask) {
  const before = maskTopology(mask),
    lifted = roundedLift(mask),
    skeleton = thinMask(lifted);
  const liftedTopology = maskTopology(lifted, true),
    after = maskTopology(skeleton, true);
  const graph = skeletonGraph(skeleton),
    metrics = graphTopology(graph);
  for (const result of [liftedTopology, after])
    if (
      result.components !== before.components ||
      result.holes !== before.holes
    )
      throw Error("Observation changed digital connectivity or holes");
  if (
    metrics.components !== before.components ||
    metrics.cycleRank !== before.holes
  )
    throw Error("Skeleton graph does not retain physical topology");
  return {
    operator: NETWORK_OBSERVER_ID,
    graph,
    metrics,
    physicalTopology: before,
    chamberConvention:
      "Degree-2 chamber/subdivision vertices suppressed; these are not the original paper node counts.",
    boundaryConvention:
      "Clipped section; no outside air or perimeter ring is connected.",
  };
}
