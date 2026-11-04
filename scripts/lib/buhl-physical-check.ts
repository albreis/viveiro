import {
  BUHL_CURVE_HOURS,
  BUHL_GROUPS,
} from "../../src/modules/benchmarks/buhl-2005-data.ts";
import { logLogSlope } from "../../src/modules/benchmarks/digging-compare.ts";
import { parseBuhlPhysicalSeries } from "./buhl-physical-series.ts";

const readError = 3;
const articleFinal = [
  { mean: 25.35, sd: 11, n: 5 },
  { mean: 37.15, sd: 9.2, n: 5 },
  { mean: 65.27, sd: 22.4, n: 10 },
] as const;

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const inBand = (value: number, [lo, hi]: number[]) =>
  value >= lo && value <= hi;
const curveBand = (value: number) => [
  Math.max(0, value - readError),
  value + readError,
];

function slopeBand() {
  // For fixed x the log-log slope is linear in log(y). Its extremes over
  // the positive endpoint ranges occur at corners of the box.
  const slopes = Array.from({ length: 2 ** BUHL_GROUPS.length }, (_, mask) =>
    logLogSlope(
      BUHL_GROUPS.map((group, i) => ({
        workers: group.workers,
        volume: curveBand(group.curveCm3.at(-1)!)[(mask >> i) & 1],
      })),
    )!,
  );
  return [Math.min(...slopes), Math.max(...slopes)];
}

export function assessBuhlPhysicalSeries(input: unknown) {
  const { groups, sourceFingerprint, secondsPerTick } =
    parseBuhlPhysicalSeries(input);
  const summaries = groups.map((group, index) => {
    const reference = BUHL_GROUPS[index].curveCm3;
    const curve = BUHL_CURVE_HOURS.map((hour, i) => {
      const volumes = group.runs.map((r) => r.volumes[i]);
      const simulatedMean = mean(volumes);
      const variance =
        volumes.reduce((sum, v) => sum + (v - simulatedMean) ** 2, 0) /
        (volumes.length - 1);
      const band = hour === 0 ? [0, 0] : curveBand(reference[i]);
      return {
        hour,
        simulatedMeanCm3: simulatedMean,
        simulatedSampleSdCm3: Math.sqrt(variance),
        readCm3: reference[i],
        bandCm3: band,
        within: inBand(simulatedMean, band),
      };
    });
    const final = curve.at(-1)!.simulatedMeanCm3;
    const article = articleFinal[index];
    const articleBand = [
      Math.max(0, article.mean - article.sd),
      article.mean + article.sd,
    ];
    return {
      workers: group.workers,
      replicateSeeds: group.runs.map((r) => r.seed),
      curve,
      maeCm3: mean(
        curve.slice(1).map((p) => Math.abs(p.simulatedMeanCm3 - p.readCm3)),
      ),
      readBandCoverage:
        curve.slice(1).filter((p) => p.within).length / (curve.length - 1),
      finalCm3: final,
      earlyFraction: [24, 48].map((h) => {
        const p = curve.find((point) => point.hour === h)!;
        return {
          hour: h,
          simulated: final > 0 ? p.simulatedMeanCm3 / final : null,
          read: p.readCm3 / reference.at(-1)!,
        };
      }),
      articleFinal72h: {
        observedMeanCm3: article.mean,
        observedSdCm3: article.sd,
        observedN: article.n,
        descriptiveBandCm3: articleBand,
        withinDescriptiveBand: inBand(final, articleBand),
      },
    };
  });
  const slope = summaries.every((g) => g.finalCm3 > 0)
    ? logLogSlope(
        summaries.map((g) => ({ workers: g.workers, volume: g.finalCm3 })),
      )
    : null;
  const band = slopeBand();
  return {
    schema: "viveiro-buhl-arena-diagnostico-v1",
    calibrated: false,
    sourceFingerprint,
    secondsPerTick,
    references: {
      curve: "Buhl et al. (2001), Fig. 2a; digitalização aproximada.",
      readingErrorCm3: readError,
      final:
        "Buhl et al. (2005), Tabela 1, disco fixo; doi:10.1007/s00265-004-0906-2",
    },
    groups: summaries,
    scale: {
      simulatedSlope: slope,
      digitizationBand: band,
      withinDigitizationBand: slope !== null && inBand(slope, band),
    },
  };
}
