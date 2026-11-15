import type { GautraisPlan, Replica } from "./types.ts";
export const GAUTRAIS_PROTOCOL_SHA256 =
  "7e2216b5aaf64cc710ab305674d37d57346603d1675522c4296e15af46cafd2b";

/** This version opens development only. Reservation is a later explicit gate. */
export function developmentReplicas(plan: GautraisPlan): Replica[] {
  if (
    plan.schema !== "viveiro-gautrais-protocol-v1" ||
    !plan.evaluation.developmentAnalysisOnly ||
    plan.evaluation.reservedMetricsMayBeComputed
  )
    throw Error(
      "Protocolo de desenvolvimento inválido; reserva fechada nesta etapa.",
    );
  if (
    JSON.stringify(plan.measurements.frames) !== "[1,37,73,109,145,181,217]" ||
    plan.measurements.nominalMinutesPerFrame !== 20
  )
    throw Error("Quadros diferentes do protocolo congelado.");
  if (plan.groups.length !== 3)
    throw Error("Grupos diferentes do protocolo congelado.");
  const result: Replica[] = [];
  for (const [index, group] of plan.groups.entries()) {
    const workers = [50, 100, 200][index],
      count = workers === 200 ? 18 : 5;
    if (group.workers !== workers || group.series !== (workers !== 50))
      throw Error("Grupo incompatível.");
    const expected = (parity: number) =>
      Array.from({ length: count }, (_, i) => i + 1)
        .filter((i) => i % 2 === parity)
        .map(
          (i) =>
            "A" +
            String(workers).padStart(3, "0") +
            "-" +
            String(i).padStart(2, "0"),
        );
    if (
      JSON.stringify(group.development) !== JSON.stringify(expected(1)) ||
      JSON.stringify(group.reserved) !== JSON.stringify(expected(0))
    )
      throw Error("Partição de réplicas diferente do protocolo congelado.");
    result.push(
      ...group.development.map((id) => ({ id, workers, series: group.series })),
    );
  }
  return result;
}
