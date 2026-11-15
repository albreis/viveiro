import { parseGautraisGraph } from "./graph.ts";
import { graphTopology } from "./topology.ts";
import { developmentReplicas } from "./protocol.ts";
import type { GautraisPlan } from "./types.ts";

/** The callback only receives selected development paths, never reserved ones. */
export function measureGautraisDevelopment(
  plan: GautraisPlan,
  read: (path: string) => string,
) {
  return developmentReplicas(plan).map((replica) => {
    const final = graphTopology(
      parseGautraisGraph(read("Final/" + replica.id + ".gra")),
    );
    const samples = replica.series
      ? plan.measurements.frames.map((frame) => ({
          frame,
          nominalMinutes:
            (frame - 1) * plan.measurements.nominalMinutesPerFrame,
          metrics: graphTopology(
            parseGautraisGraph(
              read(
                "TimeSequences/" +
                  replica.id.slice(0, 4) +
                  "/" +
                  replica.id +
                  "/tst" +
                  String(frame).padStart(3, "0") +
                  ".gra",
              ),
            ),
          ),
        }))
      : [];
    return { ...replica, partition: "development" as const, final, samples };
  });
}
export type DevelopmentObservations = ReturnType<
  typeof measureGautraisDevelopment
>;

export function summarizeDevelopment(replicas: DevelopmentObservations) {
  return [50, 100, 200].map((workers) => {
    const group = replicas.filter((r) => r.workers === workers);
    const metrics = (["nodes", "edges", "cycleRank"] as const).map((metric) => {
      const values = group.map((r) => r.final[metric]),
        n = values.length;
      const mean = n ? values.reduce((a, b) => a + b, 0) / n : null;
      const sampleSD =
        n > 1
          ? Math.sqrt(
              values.reduce((sum, value) => sum + (value - mean!) ** 2, 0) /
                (n - 1),
            )
          : null;
      return { metric, n, mean, sampleSD };
    });
    return {
      workers,
      replicas: group.length,
      series: group.filter((r) => r.series).length,
      final: metrics,
    };
  });
}
