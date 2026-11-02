import { arithmeticPolicy } from "../../libs/model-math.ts";
import metadata from "../../../package.json" with { type: "json" };
import type { ExperimentPlan } from "./plan.ts";
export interface ExperimentResult {
  csv: string;
  manifest: string;
}
export async function experimentResult(
  plan: ExperimentPlan,
  csv: string,
  finalRng: number,
): Promise<ExperimentResult> {
  const bytes = new TextEncoder().encode(csv);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const sha256 = [...new Uint8Array(digest)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
  const manifest = {
    schema: "viveiro-run-v1",
    modelVersion: metadata.version,
    calibrated: false,
    arithmetic: arithmeticPolicy(),
    plan,
    clock: { ticksPerDay: 100, startTick: 0, endTick: plan.days * 100 },
    collection: {
      kind: "observed endpoints",
      intervalTicks: 100,
      includesInitialState: true,
      scenario: "A",
      discardedDays: 0,
    },
    csv: {
      file: "dados.csv",
      encoding: "UTF-8 with BOM",
      delimiter: ",",
      lineEnding: "CRLF",
      bytes: bytes.length,
      sha256,
    },
    finalRootRng: finalRng,
    limitations: [
      "Model units; not calibrated for a species.",
      "No renderer, saved terrarium, real weather or wall-clock input.",
      "Reproduce with the same model version and arithmetic policy; native and portable runs are distinct numerical contracts.",
    ],
  };
  return { csv, manifest: JSON.stringify(manifest, null, 2) + "\n" };
}
