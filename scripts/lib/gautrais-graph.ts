import { parseGautraisGraph } from "../../src/modules/benchmarks/gautrais/graph.ts";
import { graphTopology } from "../../src/modules/benchmarks/gautrais/topology.ts";

/** Legacy inventory API: preserve its original fields and exact calculations. */
export function summarizeGautraisGraph(text: string) {
  const { nodes, edges, components, cycleRank, parallelEdges } = graphTopology(
    parseGautraisGraph(text),
  );
  return { nodes, edges, components, cycleRank, parallelEdges };
}
