import { join } from "node:path";
import { describeBuhlLab } from "../src/modules/benchmarks/buhl-arena/run.ts";
import { buhlLabJson, runBuhlLabJobs } from "./lib/buhl-lab-jobs.ts";
import { readBuhlLabOptions } from "./lib/buhl-lab-options.ts";
import { plansForBuhlLab } from "./lib/buhl-lab-plans.ts";
import { immutableSweepFile } from "./lib/sweep-files.ts";

const controller = new AbortController();
const stop = () => controller.abort();
try {
  const command = readBuhlLabOptions("scripts/sweep-buhl-arena.ts");
  if (command) {
    const plans = plansForBuhlLab(command.input);
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
    const result = await runBuhlLabJobs(
      plans,
      command.options,
      controller.signal,
      (folder, sourceFingerprint, runs) => {
        immutableSweepFile(
          join(folder, "series.json"),
          buhlLabJson({
            schema: "viveiro-buhl-arena-series-v1",
            ...describeBuhlLab(plans[0]),
            sourceFingerprint,
            runs,
          }),
        );
      },
    );
    process.stdout.write(buhlLabJson(result));
  }
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = controller.signal.aborted ? 130 : 1;
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
}
